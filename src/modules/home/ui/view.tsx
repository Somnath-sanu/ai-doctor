"use client";

import Link from "next/link";

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
        description="Review your recent consultations, track doctor escalations, and connect with AI specialist doctors."
        action={
          <Button asChild variant="outline" className="cursor-pointer">
            <Link href="/app/doctors">
              <PlusIcon className="mr-1.5 size-4" />
              Consult with doctor
            </Link>
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Recent consultations
            </h2>
          </div>
          <HistoryList />
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            AI specialist doctors
            </h2>
          </div>
          <AgentList limit={3} showViewAllLink />
        </section>
      </div>
    </div>
  );
};
