"use client";

import { Button } from "@/src/components/ui/button";
import { PlusIcon } from "lucide-react";
import { HistoryList } from "./components/history-list";
import { AgentList } from "./components/agent-list";

export const HomeView = () => {
  return (
    <div className="flex flex-1 items-center justify-center max-w-5xl py-16 w-full mx-auto">
      <div className="w-full space-y-8">
        <div className="flex justify-between flex-1 items-center">
          <h2 className="font-bold text-2xl">My Dashboard</h2>

          <Button variant={"outline"} className="cursor-pointer">
            <PlusIcon />
            Consult with Doctor
          </Button>
        </div>
        <HistoryList />
        <AgentList />
      </div>
    </div>
  );
};
