import { PageHeader } from "@/src/components/layout/page-header";
import { HistoryList } from "@/src/modules/home/ui/components/history-list";

export default function ConsultationsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Consultations"
        description="Review and manage your past MEDIVA AI consultations, understand clinical reasoning, and quickly jump into detailed reports."
      />
      <section className="space-y-3">
        <HistoryList />
      </section>
      <section className="grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border bg-background p-4 md:p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-muted-foreground">
            How consultations work
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Each consultation captures your conversation with MEDIVA AI,
            structured clinical questions, and generated differentials. Use this
            view to quickly revisit past reasoning before making new decisions.
          </p>
        </div>
        <div className="rounded-xl border bg-background p-4 md:p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-muted-foreground">
            What you can review
          </h2>
          <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
            <li>• Presenting complaint and clinical context</li>
            <li>• Key positives and negatives from the history</li>
            <li>• Differential diagnoses suggested by MEDIVA AI</li>
            <li>• Recommended next steps and investigations</li>
          </ul>
        </div>
        <div className="rounded-xl border bg-background p-4 md:p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-muted-foreground">
            Safety & privacy
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Consultations are designed to support, not replace, clinical
            judgment. All data is handled according to your workspace privacy
            configuration and should be validated against local guidelines.
          </p>
        </div>
      </section>
    </div>
  );
}

