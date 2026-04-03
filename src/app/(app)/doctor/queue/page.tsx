import { Card } from "@/src/components/ui/card";
import { PageHeader } from "@/src/components/layout/page-header";
import { getDoctorQueueTickets } from "@/src/modules/doctor/server";
import { DoctorTicketActions } from "@/src/modules/doctor/ui/doctor-ticket-actions";
import { DoctorTicketCard } from "@/src/modules/doctor/ui/doctor-ticket-card";

export default async function DoctorQueuePage() {
  const tickets = await getDoctorQueueTickets();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Specialty Queue"
        description="Claim open escalations routed to your specialty by the MEDIVA AI handoff system."
      />
      {tickets.length === 0 ? (
        <Card className="border bg-card/80 p-6 text-sm text-muted-foreground shadow-sm">
          No open specialty tickets right now.
        </Card>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {tickets.map((ticket) => (
            <DoctorTicketCard
              key={ticket.id}
              ticket={ticket}
              footer={
                <DoctorTicketActions
                  ticketId={ticket.id}
                  canClaim
                  canStartReview={false}
                />
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
