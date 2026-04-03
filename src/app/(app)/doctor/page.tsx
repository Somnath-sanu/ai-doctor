import { Card } from "@/src/components/ui/card";
import { PageHeader } from "@/src/components/layout/page-header";
import { DoctorTicketCard } from "@/src/modules/doctor/ui/doctor-ticket-card";
import { getDoctorDashboardData } from "@/src/modules/doctor/server";

export default async function DoctorDashboardPage() {
  const { doctor, specialty, counts, queuePreview } =
    await getDoctorDashboardData();

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${doctor.name.split(" ")[0]}`}
        description={`You are covering the ${specialty || "doctor"} queue. Review escalations, claim new tickets, and complete validated care plans.`}
      />

      <section className="grid gap-4 md:grid-cols-3">
        <Card className="border-border/60 bg-[linear-gradient(160deg,color-mix(in_oklab,var(--primary)_14%,transparent),transparent)] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary/80">
            Open queue
          </p>
          <p className="mt-3 text-4xl font-semibold tracking-tight">{counts.open}</p>
        </Card>
        <Card className="border-border/60 bg-[linear-gradient(160deg,color-mix(in_oklab,var(--accent)_18%,transparent),transparent)] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary/80">
            My active tickets
          </p>
          <p className="mt-3 text-4xl font-semibold tracking-tight">{counts.claimed}</p>
        </Card>
        <Card className="border-border/60 bg-[linear-gradient(160deg,color-mix(in_oklab,var(--chart-2)_18%,transparent),transparent)] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary/80">
            Completed by me
          </p>
          <p className="mt-3 text-4xl font-semibold tracking-tight">{counts.completed}</p>
        </Card>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Queue preview
        </h2>
        {queuePreview.length === 0 ? (
          <Card className="p-6 text-sm text-muted-foreground">
            No tickets are waiting right now in your specialty queue.
          </Card>
        ) : (
          <div className="grid gap-4 xl:grid-cols-2">
            {queuePreview.map((ticket) => (
              <DoctorTicketCard key={ticket.id} ticket={ticket} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
