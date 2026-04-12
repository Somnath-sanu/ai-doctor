import { NextRequest, NextResponse } from "next/server";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";

import { syncCurrentUser } from "@/src/lib/auth";
import { PATIENT_CHAT_SYSTEM_PROMPT } from "@/src/prompts/chat-prompt";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

function normalizeMessages(input: unknown): ChatMessage[] {
  if (!Array.isArray(input)) {
    return [];
  }

  return input
    .map((item) => {
      if (
        item &&
        typeof item === "object" &&
        "role" in item &&
        "content" in item
      ) {
        const role = String(item.role);

        if (role === "user" || role === "assistant") {
          return {
            role,
            content: String(item.content),
          } satisfies ChatMessage;
        }
      }

      return null;
    })
    .filter((message): message is ChatMessage => Boolean(message));
}

export async function POST(req: NextRequest) {
  const user = await syncCurrentUser();

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { messages } = await req.json();
    const normalizedMessages = normalizeMessages(messages);

    const { text } = await generateText({
      model: google("gemini-2.5-flash"),
      system: PATIENT_CHAT_SYSTEM_PROMPT,
      messages: normalizedMessages.map((message) => ({
        role: message.role,
        content: message.content,
      })),
      temperature: 0.3,
    });

    return NextResponse.json({
      text,
    });
  } catch (error) {
    console.error("Failed to generate patient chat response", error);
    return new NextResponse("Failed to generate response", { status: 500 });
  }
}
