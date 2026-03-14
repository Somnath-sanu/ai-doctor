"use client";

import { Button } from "@/src/components/ui/button";
import { PlusIcon } from "lucide-react";
import { HistoryList } from "./components/history-list";
import { AgentList } from "./components/agent-list";
import { PageHeader } from "@/src/components/layout/page-header";

export const HomeView = () => {
  return (
    <div className="w-full space-y-6">
      <PageHeader
        title="My Dashboard"
        description="Review your recent consultations and connect with AI specialist doctors."
        action={
          <Button variant="outline" className="cursor-pointer">
            <PlusIcon className="mr-1.5 size-4" />
            Consult with doctor
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="space-y-3">
          <h2 className="text-sm font-medium text-muted-foreground">
            Recent consultations
          </h2>
          <HistoryList />
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-medium text-muted-foreground">
            AI specialist doctors
          </h2>
          <AgentList limit={3} showViewAllLink />
        </section>
      </div>
    </div>
  );
};
