import { PageHeader } from "@/src/components/layout/page-header";
import { HistoryList } from "@/src/modules/home/ui/components/history-list";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="Browse AI draft summaries and doctor-approved final reports in one patient timeline."
      />
      <section className="space-y-3">
        <HistoryList />
      </section>
    </div>
  );
}
