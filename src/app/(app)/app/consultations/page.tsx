import { PageHeader } from "@/src/components/layout/page-header";
import { HistoryList } from "@/src/modules/home/ui/components/history-list";

export default function ConsultationsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Consultations"
        description="Review AI summaries, escalations, and doctor-reviewed outcomes from your MEDIVA care journey."
      />
      <section className="space-y-3">
        <HistoryList />
      </section>
      <section className="grid gap-6 md:grid-cols-3">
        <div className="surface-panel p-5">
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-primary/80">
            What gets captured
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Each consultation preserves transcript context, AI triage details,
            specialty inference, urgency, and whether a doctor was requested.
          </p>
        </div>
        <div className="surface-panel p-5">
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-primary/80">
            Doctor validation
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Riskier or unclear cases flow into the doctor queue. Final
            medications and diagnosis are only confirmed after doctor review.
          </p>
        </div>
        <div className="surface-panel p-5">
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-primary/80">
            Future-ready records
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            The consultation model is prepared for future uploads such as lab
            reports, prescriptions, and clinical images.
          </p>
        </div>
      </section>
    </div>
  );
}
