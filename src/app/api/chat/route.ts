import { NextRequest, NextResponse } from "next/server";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";

import { syncCurrentUser } from "@/src/lib/auth";
import { getPinataGatewayUrl } from "@/src/lib/pinata";
import { PATIENT_CHAT_SYSTEM_PROMPT } from "@/src/prompts/chat-prompt";

type ChatAttachment = {
  cid: string;
  name: string;
  mimeType: string;
  gatewayUrl: string;
};

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  attachments?: ChatAttachment[];
};

function normalizeMessages(input: unknown): ChatMessage[] {
  if (!Array.isArray(input)) {
    return [];
  }

  const messages = input
    .map((item): ChatMessage | null => {
      if (
        item &&
        typeof item === "object" &&
        "role" in item &&
        "content" in item
      ) {
        const role = String(item.role);

        if (role === "user" || role === "assistant") {
          const attachments = Array.isArray((item as { attachments?: unknown[] }).attachments)
            ? (item as { attachments?: unknown[] }).attachments
                ?.map((attachment) => {
                  if (
                    attachment &&
                    typeof attachment === "object" &&
                    "cid" in attachment &&
                    "name" in attachment &&
                    "mimeType" in attachment &&
                    "gatewayUrl" in attachment
                  ) {
                  return {
                      cid: String(attachment.cid),
                      name: String(attachment.name),
                      mimeType: String(attachment.mimeType),
                      gatewayUrl: String(attachment.gatewayUrl),
                    } satisfies ChatAttachment;
                  }

                  return null;
                })
                .filter((attachment): attachment is ChatAttachment => Boolean(attachment))
            : [];

          const safeAttachments = attachments ?? [];

          return {
            role,
            content: String(item.content),
            ...(safeAttachments.length > 0 ? { attachments: safeAttachments } : {}),
          } satisfies ChatMessage;
        }
      }

      return null;
    });

  return messages.filter((message): message is ChatMessage => message !== null);
}

function isProbablyTextMimeType(mimeType: string) {
  return (
    mimeType.startsWith("text/") ||
    mimeType === "application/json" ||
    mimeType === "application/xml"
  );
}

async function buildUserContent(message: ChatMessage) {
  const content: Array<
    | { type: "text"; text: string }
    | { type: "file"; data: string; mediaType: string; filename: string }
  > = [];

  const attachmentContext: string[] = [];

  if (message.content.trim()) {
    content.push({
      type: "text",
      text: message.content,
    });
  }

  for (const attachment of message.attachments ?? []) {
    const gatewayUrl = getPinataGatewayUrl(attachment.cid);

    attachmentContext.push(
      `Attached file: ${attachment.name} (CID: ${attachment.cid}, type: ${attachment.mimeType}).`
    );

    if (isProbablyTextMimeType(attachment.mimeType)) {
      try {
        const fileResponse = await fetch(gatewayUrl, {
          cache: "no-store",
        });

        if (!fileResponse.ok) {
          throw new Error(`Failed to fetch attachment ${attachment.cid}`);
        }

        const textValue = await fileResponse.text();

        attachmentContext.push(
          `Retrieved text content from ${attachment.name}:\n${textValue.slice(0, 8000)}`
        );
      } catch (error) {
        console.error("Failed to retrieve text attachment from Pinata", error);
      }
    } else {
      content.push({
        type: "file",
        data: gatewayUrl,
        mediaType: attachment.mimeType,
        filename: attachment.name,
      });
    }
  }

  if (attachmentContext.length > 0) {
    content.unshift({
      type: "text",
      text: attachmentContext.join("\n\n"),
    });
  }

  if (content.length === 0) {
    content.push({
      type: "text",
      text: "No message content provided.",
    });
  }

  return content;
}

export async function POST(req: NextRequest) {
  const user = await syncCurrentUser();

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { messages } = await req.json();
    const normalizedMessages = normalizeMessages(messages);

    const modelMessages = await Promise.all(
      normalizedMessages.map(async (message) => {
        if (message.role === "assistant") {
          return {
            role: "assistant" as const,
            content: message.content,
          };
        }

        return {
          role: "user" as const,
          content: await buildUserContent(message),
        };
      })
    );

    const { text } = await generateText({
      model: google("gemini-2.5-flash"),
      system: PATIENT_CHAT_SYSTEM_PROMPT,
      messages: modelMessages,
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
