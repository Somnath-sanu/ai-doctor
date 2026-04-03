import { NextRequest, NextResponse } from "next/server";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";

import prisma from "@/src/lib/db";
import { syncCurrentUser } from "@/src/lib/auth";
import {
  buildDraftMarkdownReport,
  buildTranscriptPrompt,
  consultationIntakeSchema,
  CONSULTATION_INTAKE_PROMPT,
  shouldEscalateToDoctor,
} from "@/src/lib/consultation";
import {
  ConsultationStatus,
  ReportKind,
  UrgencyLevel,
} from "@/src/generated/prisma/client";

type TranscriptMessage = {
  role: string;
  text: string;
};

function normalizeTranscript(input: unknown): TranscriptMessage[] {
  if (!Array.isArray(input)) {
    return [];
  }

  return input
    .map((entry) => {
      if (typeof entry === "string") {
        try {
          const parsed = JSON.parse(entry);

          if (
            parsed &&
            typeof parsed === "object" &&
            "role" in parsed &&
            "text" in parsed
          ) {
            return {
              role: String(parsed.role),
              text: String(parsed.text),
            };
          }
        } catch {
          return {
            role: "unknown",
            text: entry,
          };
        }
      }

      if (
        entry &&
        typeof entry === "object" &&
        "role" in entry &&
        "text" in entry
      ) {
        return {
          role: String(entry.role),
          text: String(entry.text),
        };
      }

      return null;
    })
    .filter((message): message is TranscriptMessage => Boolean(message));
}

export async function GET() {
  const user = await syncCurrentUser();

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const reports = await prisma.report.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(reports);
}

export async function POST(req: NextRequest) {
  const user = await syncCurrentUser();

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await req.json();
    const transcriptMessages = normalizeTranscript(body.transcript);
    const transcriptLines = transcriptMessages.map(
      (item) => `${item.role}: ${item.text}`
    );

    const { object } = await generateObject({
      model: google("gemini-2.5-flash"),
      schema: consultationIntakeSchema,
      system: CONSULTATION_INTAKE_PROMPT,
      prompt: buildTranscriptPrompt(transcriptLines),
      temperature: 0.2,
    });

    const specialist = body.specialist || object.likelySpecialty;
    const intake = {
      ...object,
      likelySpecialty: specialist,
    };
    const aiDraftReport = buildDraftMarkdownReport(intake);
    const shouldEscalate = shouldEscalateToDoctor(object);
    const consultationStatus = shouldEscalate
      ? ConsultationStatus.ESCALATED
      : ConsultationStatus.AI_COMPLETED;

    const result = await prisma.$transaction(async (tx) => {
      const consultation = await tx.consultation.create({
        data: {
          patientId: user.id,
          specialist,
          transcript: transcriptMessages,
          presentingComplaint: intake.presentingComplaint,
          symptomSummary: intake.symptomSummary,
          durationContext: intake.durationContext,
          aiStructuredReport: intake,
          aiDraftReport,
          confidenceBand: intake.confidenceBand,
          urgency: intake.urgency,
          riskFlags: intake.riskFlags,
          suggestedNextSteps: intake.suggestedNextSteps,
          draftMedications: intake.draftMedications,
          requiresDoctorReview: shouldEscalate,
          doctorReviewReason: intake.doctorReviewReason,
          status: consultationStatus,
        },
      });

      const report = await tx.report.create({
        data: {
          userId: user.id,
          consultationId: consultation.id,
          specialist,
          title: shouldEscalate
            ? "AI draft created and escalated for doctor review"
            : "AI draft consultation summary",
          content: aiDraftReport,
          kind: ReportKind.AI_DRAFT,
        },
      });

      const ticket = shouldEscalate
        ? await tx.doctorTicket.create({
            data: {
              consultationId: consultation.id,
              patientId: user.id,
              specialty: specialist,
              urgency: intake.urgency,
              summary: intake.symptomSummary,
              aiDraftReport,
              aiStructuredReport: intake,
            },
          })
        : null;

      return {
        consultation,
        report,
        ticket,
      };
    });

    return NextResponse.json({
      ...result,
      ticketCreated: Boolean(result.ticket),
      urgency: result.consultation.urgency as UrgencyLevel,
    });
  } catch (err) {
    console.error("Error generating or saving report:", err);
    return new NextResponse("Failed to generate report", { status: 500 });
  }
}
