"use client";

import Link from "next/link";
import { ChangeEvent, FormEvent, useMemo, useRef, useState } from "react";
import {
  FileImageIcon,
  FileTextIcon,
  Loader2Icon,
  MessageSquareTextIcon,
  MicIcon,
  PaperclipIcon,
  SendHorizonalIcon,
  SparklesIcon,
  XIcon,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Textarea } from "@/src/components/ui/textarea";
import { ScrollablePane } from "@/src/components/layout/scrollable-pane";

type ChatAttachment = {
  cid: string;
  name: string;
  mimeType: string;
  gatewayUrl: string;
  size?: number;
};

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  attachments?: ChatAttachment[];
};

const starterPrompts = [
  "I have had fever and body pain since yesterday.",
  "I have stomach pain after eating.",
  "I feel tired all the time and get headaches.",
];

function AttachmentIcon({ mimeType }: { mimeType: string }) {
  if (mimeType.startsWith("image/")) {
    return <FileImageIcon className="size-4" />;
  }

  return <FileTextIcon className="size-4" />;
}

function shortenCid(cid: string) {
  if (cid.length <= 16) {
    return cid;
  }

  return `${cid.slice(0, 8)}...${cid.slice(-6)}`;
}

export function PatientChatSidebar() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hello, I’m your MEDIVA AI general physician assistant. You can type your symptoms here, and you can also upload reports or medical images so I can use them as supporting context.",
    },
  ]);
  const [input, setInput] = useState("");
  const [pendingAttachments, setPendingAttachments] = useState<ChatAttachment[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const canSubmit = useMemo(
    () =>
      (input.trim().length > 0 || pendingAttachments.length > 0) &&
      !isLoading &&
      !isUploading,
    [input, pendingAttachments.length, isLoading, isUploading]
  );

  async function uploadFile(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return (await response.json()) as ChatAttachment;
  }

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);

    if (files.length === 0) {
      return;
    }

    setIsUploading(true);

    try {
      const uploads = await Promise.all(files.map((file) => uploadFile(file)));

      setPendingAttachments((current) => [...current, ...uploads]);
      toast.success("Files uploaded to Pinata and linked with IPFS hashes");
    } catch (error) {
      console.error(error);
      toast.error("Could not upload files to Pinata");
    } finally {
      setIsUploading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  function removePendingAttachment(cid: string) {
    setPendingAttachments((current) =>
      current.filter((attachment) => attachment.cid !== cid)
    );
  }

  async function sendMessage(messageText: string) {
    const content = messageText.trim();

    if ((content.length === 0 && pendingAttachments.length === 0) || isLoading) {
      return;
    }

    const outgoingAttachments = pendingAttachments;
    const userMessage: ChatMessage = {
      id: `${Date.now()}-user`,
      role: "user",
      content,
      attachments: outgoingAttachments,
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setPendingAttachments([]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: nextMessages.map((message) => ({
            role: message.role,
            content: message.content,
            attachments: message.attachments ?? [],
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = (await response.json()) as { text: string };

      setMessages((current) => [
        ...current,
        {
          id: `${Date.now()}-assistant`,
          role: "assistant",
          content: data.text,
        },
      ]);
    } catch (error) {
      console.error(error);
      toast.error("Could not get a reply from MEDIVA AI");
    } finally {
      setIsLoading(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage(input);
  }

  return (
    <Card className="surface-panel gap-4 p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
            <MessageSquareTextIcon className="size-3.5" />
            Chat with AI
          </div>
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              Typed symptom assistant
            </h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Type symptoms, upload reports or images to IPFS through Pinata,
              and let MEDIVA use that context during the chat.
            </p>
          </div>
        </div>
      </div>

      <div className="surface-subtle flex items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <SparklesIcon className="size-4 text-primary" />
          Voice is optional. Chat and uploads work here.
        </div>
        <Button asChild variant="ghost" size="sm">
          <Link href="/app/doctors">
            <MicIcon className="size-4" />
            Voice consult
          </Link>
        </Button>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Try one of these
        </p>
        <div className="flex flex-wrap gap-2">
          {starterPrompts.map((prompt) => (
            <Button
              key={prompt}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setInput(prompt)}
              disabled={isLoading || isUploading}
            >
              {prompt}
            </Button>
          ))}
        </div>
      </div>

      <ScrollablePane className="surface-subtle min-h-[280px] max-h-[420px] space-y-3 p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[88%] space-y-3 rounded-[1.15rem] px-4 py-3 text-sm leading-6 shadow-xs ${
                message.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "border border-border/70 bg-background/80 text-foreground"
              }`}
            >
              {message.content ? <p>{message.content}</p> : null}
              {message.attachments && message.attachments.length > 0 ? (
                <div className="space-y-2">
                  {message.attachments.map((attachment) => (
                    <div
                      key={attachment.cid}
                      className={`rounded-xl px-3 py-2 text-xs ${
                        message.role === "user"
                          ? "bg-primary-foreground/12 text-primary-foreground"
                          : "bg-muted/70 text-muted-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <AttachmentIcon mimeType={attachment.mimeType} />
                        <span className="font-medium">{attachment.name}</span>
                      </div>
                      <p className="mt-1 opacity-80">
                        IPFS: {shortenCid(attachment.cid)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        ))}
        {isLoading ? (
          <div className="flex justify-start">
            <div className="inline-flex items-center gap-2 rounded-[1.15rem] border border-border/70 bg-background/80 px-4 py-3 text-sm text-muted-foreground">
              <Loader2Icon className="size-4 animate-spin text-primary" />
              Thinking
            </div>
          </div>
        ) : null}
      </ScrollablePane>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="surface-subtle space-y-3 p-3">
          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,.pdf,.txt,.csv,.json,.doc,.docx"
              className="hidden"
              onChange={handleFileChange}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading || isLoading}
            >
              {isUploading ? (
                <Loader2Icon className="size-4 animate-spin" />
              ) : (
                <PaperclipIcon className="size-4" />
              )}
              Upload report/image
            </Button>
            <p className="text-xs text-muted-foreground">
              Files are uploaded to Pinata and referenced by IPFS CID.
            </p>
          </div>

          {pendingAttachments.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {pendingAttachments.map((attachment) => (
                <div
                  key={attachment.cid}
                  className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-3 py-1.5 text-xs text-foreground"
                >
                  <AttachmentIcon mimeType={attachment.mimeType} />
                  <span className="max-w-[140px] truncate">{attachment.name}</span>
                  <span className="text-muted-foreground">
                    {shortenCid(attachment.cid)}
                  </span>
                  <button
                    type="button"
                    onClick={() => removePendingAttachment(attachment.cid)}
                    className="inline-flex items-center justify-center rounded-full text-muted-foreground transition hover:text-foreground"
                    aria-label={`Remove ${attachment.name}`}
                  >
                    <XIcon className="size-3.5" />
                  </button>
                </div>
              ))}
            </div>
          ) : null}

          <Textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Describe your symptoms, duration, and what worries you..."
            className="min-h-24 rounded-[1.2rem] border-border/70 bg-background/80"
            disabled={isLoading || isUploading}
          />
        </div>

        <div className="flex items-center justify-between gap-3">
          <p className="text-xs leading-5 text-muted-foreground">
            For emergencies, seek immediate in-person or emergency care.
          </p>
          <Button type="submit" disabled={!canSubmit}>
            {isLoading ? (
              <Loader2Icon className="size-4 animate-spin" />
            ) : (
              <SendHorizonalIcon className="size-4" />
            )}
            Send
          </Button>
        </div>
      </form>
    </Card>
  );
}
