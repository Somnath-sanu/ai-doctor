import { PageHeader } from "@/src/components/layout/page-header";
import { AgentList } from "@/src/modules/home/ui/components/agent-list";

export default function DoctorsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Specialist Doctors"
        description="Start with an AI specialist. MEDIVA will escalate to a real doctor when review is needed."
      />
      <section className="space-y-3">
        <AgentList />
      </section>
    </div>
  );
}
