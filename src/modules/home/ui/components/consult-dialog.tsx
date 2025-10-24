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
      <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Consultation with {doctor.specialist}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col items-center gap-4">
            <Image
              src={doctor.image}
              alt={doctor.specialist}
              width={200}
              height={200}
              className="rounded-full object-cover w-32 h-32"
            />
            <div className="flex items-center gap-2">
              <span
                className={`h-2 w-2 rounded-full ${
                  isConnected ? "bg-green-500" : "bg-yellow-500"
                }`}
              />
              <span className="text-sm text-muted-foreground">
                {isConnected ? "Connected" : "Connect by clicking start"}
              </span>
              {isSpeaking && (
                <span className="text-sm text-muted-foreground">
                  (Speaking...)
                </span>
              )}
            </div>
          </div>

          <div className="h-[200px] overflow-y-auto border rounded-lg p-4 space-y-2">
            {transcript.map((message, index) => (
              <div
                key={index}
                className={`text-sm ${
                  message.role === "assistant"
                    ? "text-blue-600"
                    : "text-gray-700"
                }`}
              >
                <span className="font-semibold">
                  {message.role === "assistant" ? "Doctor: " : "You: "}
                </span>
                {message.text}
              </div>
            ))}
            <div ref={scrollToBottomRef} />
          </div>

          <div className="flex justify-center gap-4">
            {!isConnected && transcript.length === 0 ? (
              <Button
                onClick={startCall}
                className="cursor-pointer rounded-xl"
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
                className="cursor-pointer rounded-xl"
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
                className="cursor-pointer rounded-xl"
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
