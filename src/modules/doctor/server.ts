import "server-only";

import prisma from "@/src/lib/db";
import { requireDoctorUser } from "@/src/lib/auth";
import { DoctorTicketStatus } from "@/src/generated/prisma/client";

async function getDoctorContext() {
  const doctor = await requireDoctorUser();

  return {
    doctor,
    specialty: doctor.doctorProfile?.specialty ?? "",
  };
}

export async function getDoctorDashboardData() {
  const { doctor, specialty } = await getDoctorContext();

  const [openCount, claimedCount, completedCount, queuePreview] =
    await Promise.all([
      prisma.doctorTicket.count({
        where: {
          specialty,
          status: DoctorTicketStatus.OPEN,
        },
      }),
      prisma.doctorTicket.count({
        where: {
          claimedByDoctorId: doctor.id,
          status: {
            in: [DoctorTicketStatus.CLAIMED, DoctorTicketStatus.IN_REVIEW],
          },
        },
      }),
      prisma.doctorTicket.count({
        where: {
          claimedByDoctorId: doctor.id,
          status: DoctorTicketStatus.COMPLETED,
        },
      }),
      prisma.doctorTicket.findMany({
        where: {
          OR: [
            {
              specialty,
              status: DoctorTicketStatus.OPEN,
            },
            {
              claimedByDoctorId: doctor.id,
              status: {
                in: [DoctorTicketStatus.CLAIMED, DoctorTicketStatus.IN_REVIEW],
              },
            },
          ],
        },
        include: {
          patient: true,
          consultation: true,
        },
        orderBy: [
          {
            createdAt: "asc",
          },
        ],
        take: 6,
      }),
    ]);

  return {
    doctor,
    specialty,
    counts: {
      open: openCount,
      claimed: claimedCount,
      completed: completedCount,
    },
    queuePreview,
  };
}

export async function getDoctorQueueTickets() {
  const { specialty } = await getDoctorContext();

  return prisma.doctorTicket.findMany({
    where: {
      specialty,
      claimedByDoctorId: null,
      status: DoctorTicketStatus.OPEN,
    },
    include: {
      patient: true,
      consultation: true,
    },
    orderBy: [
      {
        createdAt: "asc",
      },
    ],
  });
}

export async function getDoctorMyTickets() {
  const { doctor } = await getDoctorContext();

  return prisma.doctorTicket.findMany({
    where: {
      claimedByDoctorId: doctor.id,
      status: {
        in: [
          DoctorTicketStatus.CLAIMED,
          DoctorTicketStatus.IN_REVIEW,
          DoctorTicketStatus.COMPLETED,
        ],
      },
    },
    include: {
      patient: true,
      consultation: true,
    },
    orderBy: [
      {
        updatedAt: "desc",
      },
    ],
  });
}

export async function getDoctorTicketById(ticketId: string) {
  const { doctor, specialty } = await getDoctorContext();

  const ticket = await prisma.doctorTicket.findUnique({
    where: {
      id: ticketId,
    },
    include: {
      patient: true,
      consultation: true,
      claimedByDoctor: true,
      finalCarePlan: true,
    },
  });

  if (!ticket) {
    return null;
  }

  const isAllowed =
    ticket.specialty === specialty ||
    ticket.claimedByDoctorId === doctor.id ||
    doctor.role === "ADMIN";

  if (!isAllowed) {
    return null;
  }

  return {
    doctor,
    ticket,
  };
}
