import { Button } from "@/src/components/ui/button";
import { AIDoctorAgents } from "@/src/lib/agents";
import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { ConsultDialog } from "./consult-dialog";
import { cn } from "@/src/lib/utils";

export const AgentList = () => {
  const [selectedDoctor, setSelectedDoctor] = useState<
    (typeof AIDoctorAgents)[number] | null
  >(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleConsult = (doctor: (typeof AIDoctorAgents)[number]) => {
    if (doctor.assistantId === null) {
      return;
    }

    setSelectedDoctor(doctor);
    setIsDialogOpen(true);
  };

  const handleClose = () => {
    setSelectedDoctor(null);
    setIsDialogOpen(false);
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
      <div className="mt-4 space-y-4">
        <h2 className="font-bold text-2xl">AI Specialist Doctors</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-5">
          {AIDoctorAgents.map((d) => (
            <div key={d.id} className="relative">
              <div
                className={cn(
                  "flex flex-col items-start justify-center gap-2",
                  !d.isAvailable && "pointer-events-none "
                )}
              >
                <Image
                  src={d.image}
                  alt={d.specialist}
                  width={200}
                  height={300}
                  className={cn(
                    "object-cover w-full h-[250px] rounded-2xl",
                    !d.isAvailable && "blur"
                  )}
                />
                <h2 className="font-semibold text-lg">{d.specialist}</h2>
                <p className="text-sm line-clamp-2 text-muted-foreground">
                  {d.description}
                </p>
                {d.isAvailable && (
                  <Button
                    className="rounded shadow w-full cursor-pointer"
                    variant="outline"
                    onClick={() => {
                      if (!d.isAvailable || !d.assistantId) {
                        return;
                      }
                      handleConsult(d);
                    }}
                  >
                    Consult
                    <ArrowRightIcon />
                  </Button>
                )}
                {!d.isAvailable && (
                  <div className="absolute bg-black/50 w-full text-center text-white text-xl p-2 top-[30%] z-10 backdrop-blur-sm rounded-xl">
                    Available soon
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
