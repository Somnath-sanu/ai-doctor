import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { useVapi } from "../../hooks/use-vapi";
import { AIDoctorAgents } from "@/src/lib/agents";
import {
  CircleDotIcon,
  FileDownIcon,
  Loader2Icon,
  PhoneCallIcon,
  PhoneOffIcon,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type AIDoctorAgent = (typeof AIDoctorAgents)[number];

interface ConsultDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  doctor: AIDoctorAgent;
}

export function ConsultDialog({
  isOpen,
  onOpenChange,
  doctor,
}: ConsultDialogProps) {
  // this cause issues as we cann't render hook conditionaly
  // if (!doctor.assistantId) {
  //   return null;
  // }

  const {
    isConnected,
    isSpeaking,
    isLoading,
    transcript,
    startCall,
    endCall,
    createReport,
  } = useVapi(doctor.assistantId as string);

  const scrollToBottomRef = useRef<HTMLDivElement>(null);

  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  useEffect(() => {
    if (scrollToBottomRef.current) {
      scrollToBottomRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [transcript]);

  const handleCreateReport = async () => {
    setIsGeneratingReport(true);
    const { success } = await createReport(doctor.specialist);
    setIsGeneratingReport(false);
    if (success) {
      onOpenChange(false);
    }
  };

  const handleEndCall = () => {
    endCall();
    handleCreateReport();
  };

  // I don't want clicking outside close the dialog when call is connected
  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        if (!isConnected) {
          onOpenChange(false);
        }
      }}
    >
      <DialogContent className="sm:max-w-md w-full max-h-[85vh] overflow-hidden border bg-card/95">
        <DialogHeader>
          <DialogTitle>Consultation with {doctor.specialist}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-2">
          <div className="flex flex-col items-center gap-3">
            <Image
              src={doctor.image}
              alt={doctor.specialist}
              width={200}
              height={200}
              className="rounded-full object-cover w-32 h-32"
            />
            <div className="flex items-center gap-2 rounded-full bg-muted/70 px-3 py-1 text-xs text-muted-foreground">
              <CircleDotIcon
                className={`size-3 ${
                  isConnected ? "text-emerald-500" : "text-amber-400"
                }`}
              />
              <span className="font-medium text-foreground">
                {isConnected ? "In call" : "Ready to connect"}
              </span>
              {isSpeaking && (
                <span className="text-xs text-muted-foreground">
                  (Assistant is speaking)
                </span>
              )}
            </div>
          </div>

          <div className="flex-1 min-h-[160px] max-h-[260px] overflow-y-auto rounded-lg border bg-muted/40 p-3 space-y-1.5 text-sm">
            {transcript.map((message, index) => (
              <div
                key={index}
                className={`${
                  message.role === "assistant"
                    ? "text-primary"
                    : "text-foreground"
                }`}
              >
                <span className="mr-1 font-semibold">
                  {message.role === "assistant" ? "Doctor: " : "You: "}
                </span>
                {message.text}
              </div>
            ))}
            <div ref={scrollToBottomRef} />
          </div>

          <div className="flex flex-col items-center gap-3 pt-1">
            {!isConnected && transcript.length === 0 ? (
              <Button
                onClick={startCall}
                className="w-full cursor-pointer rounded-xl"
              >
                {isLoading ? (
                  <Loader2Icon className="h-4 w-4 animate-spin" />
                ) : (
                  <PhoneCallIcon className="h-4 w-4" />
                )}
                {isLoading ? "Starting..." : "Start Call"}
              </Button>
            ) : transcript.length > 0 && !isConnected ? (
              <Button
                variant="destructive"
                className="w-full cursor-pointer rounded-xl"
                onClick={handleCreateReport}
              >
                {isGeneratingReport ? (
                  <Loader2Icon className="h-4 w-4 animate-spin" />
                ) : (
                  <FileDownIcon className="h-4 w-4" />
                )}
                {isGeneratingReport ? "generating..." : "Generate Report"}
              </Button>
            ) : (
              <Button
                onClick={handleEndCall}
                variant="destructive"
                className="w-full cursor-pointer rounded-xl"
              >
                <PhoneOffIcon className="h-4 w-4" />
                End Call
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
