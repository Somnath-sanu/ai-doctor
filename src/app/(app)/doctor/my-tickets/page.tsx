import { Card } from "@/src/components/ui/card";
import { PageHeader } from "@/src/components/layout/page-header";
import { getDoctorMyTickets } from "@/src/modules/doctor/server";
import { DoctorTicketCard } from "@/src/modules/doctor/ui/doctor-ticket-card";

export default async function DoctorMyTicketsPage() {
  const tickets = await getDoctorMyTickets();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tickets"
        description="Review tickets you have claimed, moved into review, or already completed."
      />
      {tickets.length === 0 ? (
        <Card className="border bg-card/80 p-6 text-sm text-muted-foreground shadow-sm">
          You have not claimed any tickets yet.
        </Card>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {tickets.map((ticket) => (
            <DoctorTicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      )}
    </div>
  );
}
