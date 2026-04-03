"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/src/components/ui/button";

type DoctorTicketActionsProps = {
  ticketId: string;
  canClaim: boolean;
  canStartReview: boolean;
};

export function DoctorTicketActions({
  ticketId,
  canClaim,
  canStartReview,
}: DoctorTicketActionsProps) {
  const router = useRouter();
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  async function handleAction(action: "claim" | "in-review") {
    setLoadingAction(action);

    try {
      const response = await fetch(`/api/doctor/tickets/${ticketId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      toast.success(action === "claim" ? "Ticket claimed" : "Ticket moved to in review");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Could not update ticket");
    } finally {
      setLoadingAction(null);
    }
  }

  return (
    <div className="flex flex-wrap gap-3">
      {canClaim ? (
        <Button
          type="button"
          onClick={() => handleAction("claim")}
          disabled={loadingAction !== null}
        >
          {loadingAction === "claim" ? (
            <Loader2 className="size-4 animate-spin" />
          ) : null}
          Claim ticket
        </Button>
      ) : null}
      {canStartReview ? (
        <Button
          type="button"
          variant="outline"
          onClick={() => handleAction("in-review")}
          disabled={loadingAction !== null}
        >
          {loadingAction === "in-review" ? (
            <Loader2 className="size-4 animate-spin" />
          ) : null}
          Mark in review
        </Button>
      ) : null}
    </div>
  );
}
