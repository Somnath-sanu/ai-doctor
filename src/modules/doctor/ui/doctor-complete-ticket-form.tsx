"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";

type DoctorCompleteTicketFormProps = {
  ticketId: string;
  disabled?: boolean;
};

function splitLines(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function DoctorCompleteTicketForm({
  ticketId,
  disabled,
}: DoctorCompleteTicketFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const diagnosis = String(formData.get("diagnosis") || "").trim();
    const advice = String(formData.get("advice") || "").trim();
    const followUp = String(formData.get("followUp") || "").trim();
    const medications = splitLines(String(formData.get("medications") || ""));
    const tests = splitLines(String(formData.get("tests") || ""));

    if (!diagnosis || !advice) {
      toast.error("Diagnosis and advice are required");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/doctor/tickets/${ticketId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "complete",
          diagnosis,
          advice,
          medications,
          tests,
          followUp: followUp || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      toast.success("Doctor care plan completed");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Could not complete this ticket");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="diagnosis">Diagnosis / Impression</Label>
        <Input
          id="diagnosis"
          name="diagnosis"
          placeholder="Likely diagnosis or clinical impression"
          disabled={disabled || isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="advice">Advice</Label>
        <Textarea
          id="advice"
          name="advice"
          placeholder="Doctor advice for the patient"
          className="min-h-28"
          disabled={disabled || isSubmitting}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="medications">Medications</Label>
          <Textarea
            id="medications"
            name="medications"
            placeholder="One medicine per line"
            className="min-h-28"
            disabled={disabled || isSubmitting}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tests">Tests / Follow-Up Items</Label>
          <Textarea
            id="tests"
            name="tests"
            placeholder="One test or follow-up item per line"
            className="min-h-28"
            disabled={disabled || isSubmitting}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="followUp">Follow-Up Notes</Label>
        <Textarea
          id="followUp"
          name="followUp"
          placeholder="Follow-up timing, precautions, or escalation advice"
          className="min-h-24"
          disabled={disabled || isSubmitting}
        />
      </div>

      <Button type="submit" disabled={disabled || isSubmitting}>
        {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
        Publish final care plan
      </Button>
    </form>
  );
}
