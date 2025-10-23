import { Button } from "@/components/ui/button";
import { AIDoctorAgents } from "@/lib/agents";
import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";

export const AgentList = () => {
  return (
    <div className="mt-4 space-y-4">
      <h2 className="font-bold text-2xl">AI Specialist Doctors</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-5">
        {AIDoctorAgents.map((d) => (
          <div key={d.id} className="">
            <div className="flex flex-col items-start justify-center gap-2">
              <Image
                src={d.image}
                alt={d.specialist}
                width={200}
                height={300}
                className="object-cover w-full h-[250px] rounded-2xl"
              />
              <h2 className="font-semibold text-lg">{d.specialist}</h2>
              <p className="text-sm line-clamp-2 text-muted-foreground">
                {d.description}
              </p>
              <Button className="rounded shadow w-full cursor-pointer" variant={"outline"}>
                Consult
                <ArrowRightIcon/>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
