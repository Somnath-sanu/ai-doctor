import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import prisma from "@/src/lib/db";
import { requireDoctorUser } from "@/src/lib/auth";
import { buildDoctorFinalReport } from "@/src/lib/consultation";
import {
  ConsultationStatus,
  DoctorTicketStatus,
  ReportKind,
} from "@/src/generated/prisma/client";

const ticketMutationSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("claim"),
  }),
  z.object({
    action: z.literal("in-review"),
  }),
  z.object({
    action: z.literal("complete"),
    diagnosis: z.string().min(1),
    advice: z.string().min(1),
    medications: z.array(z.string()),
    tests: z.array(z.string()),
    followUp: z.string().optional(),
  }),
]);

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ ticketId: string }> }
) {
  const doctor = await requireDoctorUser();
  const { ticketId } = await context.params;

  try {
    const parsed = ticketMutationSchema.parse(await req.json());

    const ticket = await prisma.doctorTicket.findUnique({
      where: {
        id: ticketId,
      },
      include: {
        consultation: true,
      },
    });

    if (!ticket) {
      return new NextResponse("Ticket not found", { status: 404 });
    }

    if (
      doctor.role !== "ADMIN" &&
      ticket.specialty !== doctor.doctorProfile?.specialty &&
      ticket.claimedByDoctorId !== doctor.id
    ) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    if (parsed.action === "claim") {
      if (
        ticket.status !== DoctorTicketStatus.OPEN &&
        ticket.claimedByDoctorId !== doctor.id
      ) {
        return new NextResponse("Ticket is not available to claim", {
          status: 409,
        });
      }

      const updated = await prisma.doctorTicket.update({
        where: {
          id: ticketId,
        },
        data: {
          claimedByDoctorId: doctor.id,
          claimedAt: ticket.claimedAt ?? new Date(),
          status: DoctorTicketStatus.CLAIMED,
        },
      });

      return NextResponse.json(updated);
    }

    if (parsed.action === "in-review") {
      if (ticket.claimedByDoctorId !== doctor.id) {
        return new NextResponse("Claim this ticket before reviewing it", {
          status: 409,
        });
      }

      const updated = await prisma.doctorTicket.update({
        where: {
          id: ticketId,
        },
        data: {
          status: DoctorTicketStatus.IN_REVIEW,
        },
      });

      return NextResponse.json(updated);
    }

    if (ticket.claimedByDoctorId && ticket.claimedByDoctorId !== doctor.id) {
      return new NextResponse("This ticket is assigned to another doctor", {
        status: 409,
      });
    }

    const finalReport = buildDoctorFinalReport({
      specialty: ticket.specialty,
      diagnosis: parsed.diagnosis,
      advice: parsed.advice,
      medications: parsed.medications,
      tests: parsed.tests,
      followUp: parsed.followUp,
    });

    const result = await prisma.$transaction(async (tx) => {
      const completedTicket = await tx.doctorTicket.update({
        where: {
          id: ticketId,
        },
        data: {
          claimedByDoctorId: doctor.id,
          claimedAt: ticket.claimedAt ?? new Date(),
          completedAt: new Date(),
          status: DoctorTicketStatus.COMPLETED,
        },
      });

      await tx.consultation.update({
        where: {
          id: ticket.consultationId,
        },
        data: {
          status: ConsultationStatus.DOCTOR_COMPLETED,
        },
      });

      const carePlan = await tx.finalCarePlan.upsert({
        where: {
          ticketId,
        },
        update: {
          diagnosis: parsed.diagnosis,
          advice: parsed.advice,
          medications: parsed.medications,
          tests: parsed.tests,
          followUp: parsed.followUp,
          finalReport,
          doctorId: doctor.id,
        },
        create: {
          consultationId: ticket.consultationId,
          ticketId,
          patientId: ticket.patientId,
          doctorId: doctor.id,
          diagnosis: parsed.diagnosis,
          advice: parsed.advice,
          medications: parsed.medications,
          tests: parsed.tests,
          followUp: parsed.followUp,
          finalReport,
        },
      });

      await tx.report.create({
        data: {
          userId: ticket.patientId,
          consultationId: ticket.consultationId,
          finalCarePlanId: carePlan.id,
          specialist: ticket.specialty,
          title: "Doctor validated final care plan",
          content: finalReport,
          kind: ReportKind.DOCTOR_FINAL,
        },
      });

      return {
        completedTicket,
        carePlan,
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to update doctor ticket", error);
    return new NextResponse("Failed to update ticket", { status: 500 });
  }
}
