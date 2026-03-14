"use client";

import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { AIDoctorAgents } from "@/src/lib/agents";
import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { ConsultDialog } from "./consult-dialog";
import { cn } from "@/src/lib/utils";

interface AgentListProps {
  limit?: number;
  showViewAllLink?: boolean;
}

export const AgentList = ({ limit, showViewAllLink }: AgentListProps) => {
  const [selectedDoctor, setSelectedDoctor] = useState<
    (typeof AIDoctorAgents)[number] | null
  >(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const visibleAgents =
    typeof limit === "number" ? AIDoctorAgents.slice(0, limit) : AIDoctorAgents;

  const handleConsult = (doctor: (typeof AIDoctorAgents)[number]) => {
    if (doctor.assistantId === null) {
      return;
    }

    setSelectedDoctor(doctor);
    setIsDialogOpen(true);
  };

  const handleClose = (val: boolean) => {
    setSelectedDoctor(null);
    setIsDialogOpen(val);
  };

  return (
    <>
      {selectedDoctor && (
        <ConsultDialog
          isOpen={isDialogOpen}
          onOpenChange={handleClose}
          doctor={selectedDoctor}
        />
      )}
      <div className="mt-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleAgents.map((d) => (
            <Card
              key={d.id}
              className="relative flex flex-col overflow-hidden border bg-card/80 shadow-sm"
            >
              <div className="relative">
                <Image
                  src={d.image}
                  alt={d.specialist}
                  width={100}
                  height={50}
                  className={cn(
                    "w-full object-cover h-30",
                    !d.isAvailable && "blur-sm"
                  )}
                />
                {!d.isAvailable && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-sm font-medium text-white backdrop-blur-sm">
                    Available soon
                  </div>
                )}
              </div>

              <div className="flex flex-1 flex-col gap-2 px-4 py-3">
                <h3 className="text-sm font-semibold">{d.specialist}</h3>
                <p className="line-clamp-2 text-xs text-muted-foreground font-medium">
                  {d.description}
                </p>

                {d.isAvailable && d.assistantId && (
                  <Button
                    className="mt-2 w-full cursor-pointer"
                    variant="outline"
                    onClick={() => handleConsult(d)}
                  >
                    <span className="mr-1">Consult now</span>
                    <ArrowRightIcon className="size-4" />
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
        {showViewAllLink && AIDoctorAgents.length > (limit ?? 0) && (
          <div className="mt-4 flex justify-end">
            <Button
              asChild
              variant="ghost"
              className="cursor-pointer text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              <Link href="/doctors">
                View all doctors
                <ArrowRightIcon className="ml-1 size-3.5" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </>
  );
};
