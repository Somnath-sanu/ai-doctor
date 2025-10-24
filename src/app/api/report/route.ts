import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { REPORT_PROMPT } from "@/src/prompts/report-prompt";
import prisma from "@/src/lib/db";

export async function GET() {
  const { isAuthenticated, userId } = await auth();

  if (!isAuthenticated || !userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const reports = await prisma.report.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return NextResponse.json(reports);
}

export async function POST(req: NextRequest) {
  const { isAuthenticated, userId } = await auth();

  if (!isAuthenticated || !userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { specialist, transcript } = await req.json();

    // Step 1: Generate the report text first
    const { text } = await generateText({
      model: google("gemini-2.5-flash"),
      system: REPORT_PROMPT(specialist),
      prompt: `Here is the conversation transcript:\n${transcript.join("\n")}`,
      temperature: 0.3,
      // maxOutputTokens: 1000,
    });

    // Step 2: Save only if generation succeeded
    const report = await prisma.report.create({
      data: {
        userId,
        specialist,
        content: text,
      },
    });

    return NextResponse.json(report);
  } catch (err) {
    console.error("Error generating or saving report:", err);
    return new NextResponse("Failed to generate report", { status: 500 });
  }
}
