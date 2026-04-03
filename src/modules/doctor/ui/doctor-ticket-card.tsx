import Link from "next/link";
import type { ReactNode } from "react";
import { formatDistanceToNow } from "date-fns";

import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { TicketStatusBadge } from "@/src/modules/doctor/ui/ticket-status-badge";

type DoctorTicketCardProps = {
  ticket: {
    id: string;
    specialty: string;
    urgency: string;
    status: string;
    summary: string;
    createdAt: Date;
    patient: {
      name: string;
      email: string;
    };
  };
  footer?: ReactNode;
};

export function DoctorTicketCard({ ticket, footer }: DoctorTicketCardProps) {
  return (
    <Card className="border bg-card/80 p-5 shadow-sm transition hover:border-primary/40 hover:bg-accent/30">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
            {ticket.specialty}
          </p>
          <h3 className="text-lg font-semibold text-foreground">
            {ticket.patient.name}
          </h3>
          <p className="text-sm text-muted-foreground">{ticket.patient.email}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <TicketStatusBadge label={ticket.urgency} tone="urgency" />
          <TicketStatusBadge label={ticket.status} tone="status" />
        </div>
      </div>
      <p className="mt-4 line-clamp-3 text-sm leading-6 text-muted-foreground">
        {ticket.summary}
      </p>
      <p className="mt-4 text-xs text-muted-foreground">
        Created{" "}
        {formatDistanceToNow(new Date(ticket.createdAt), {
          addSuffix: true,
        })}
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        <Button asChild variant="outline">
          <Link href={`/doctor/tickets/${ticket.id}`}>Open ticket</Link>
        </Button>
        {footer}
      </div>
    </Card>
  );
}
