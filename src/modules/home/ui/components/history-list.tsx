import { Button } from "@/src/components/ui/button";
import { PlusIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { AgentList } from "./agent-list";
import { AddNewSession } from "./add-new-session";

export const HistoryList = () => {
  const [history, setHistory] = useState([]);
  return (
    <div>
      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-5 border p-7 border-border border-dashed shadow rounded-2xl">
          <Image
            src={"/medical-assistance.png"}
            alt="empty"
            width={150}
            height={150}
          />
          <h2 className="text-xl font-bold">No Recent Consultations</h2>
          <p>
            It&apos; looks like you haven&apos;t consulted with any doctors yet!
          </p>

          <AddNewSession />
        </div>
      ) : (
        <AgentList />
      )}
    </div>
  );
};
