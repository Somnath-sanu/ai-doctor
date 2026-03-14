import { PageHeader } from "@/src/components/layout/page-header";
import { HistoryList } from "@/src/modules/home/ui/components/history-list";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="Browse all generated visit summaries and drill into the full markdown report."
      />
      <section className="space-y-3">
        <HistoryList />
      </section>
    </div>
  );
}

