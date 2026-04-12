"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import {
  Loader2Icon,
  MessageSquareTextIcon,
  MicIcon,
  SendHorizonalIcon,
  SparklesIcon,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Textarea } from "@/src/components/ui/textarea";
import { ScrollablePane } from "@/src/components/layout/scrollable-pane";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const starterPrompts = [
  "I have had fever and body pain since yesterday.",
  "I have stomach pain after eating.",
  "I feel tired all the time and get headaches.",
];

export function PatientChatSidebar() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hello, I’m your MEDIVA AI general physician assistant. Tell me what symptoms or concern you want to discuss, and I’ll help you think through it step by step.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const canSubmit = useMemo(
    () => input.trim().length > 0 && !isLoading,
    [input, isLoading]
  );

  async function sendMessage(messageText: string) {
    const content = messageText.trim();

    if (!content || isLoading) {
      return;
    }

    const userMessage: ChatMessage = {
      id: `${Date.now()}-user`,
      role: "user",
      content,
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
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
              Type your symptoms if you do not want to start a voice
              consultation. MEDIVA AI will respond with calm, structured
              guidance.
            </p>
          </div>
        </div>
      </div>

      <div className="surface-subtle flex items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <SparklesIcon className="size-4 text-primary" />
          Voice is optional. Chat works here.
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
              disabled={isLoading}
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
              className={`max-w-[88%] rounded-[1.15rem] px-4 py-3 text-sm leading-6 shadow-xs ${
                message.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "border border-border/70 bg-background/80 text-foreground"
              }`}
            >
              {message.content}
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
        <Textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Describe your symptoms, duration, and what worries you..."
          className="min-h-24 rounded-[1.2rem] border-border/70 bg-background/80"
          disabled={isLoading}
        />
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
