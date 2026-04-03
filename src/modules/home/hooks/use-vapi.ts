import { useState, useEffect, useRef } from "react";
import Vapi from "@vapi-ai/web";
import { generateReport } from "../report";
import { toast } from "sonner";
import { useSetAtom } from "jotai";
import { reportAtom } from "../store/atom";

export const useVapi = (assistantId: string) => {
  const setReport = useSetAtom(reportAtom);
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [transcript, setTranscript] = useState<
    Array<{ role: string; text: string }>
  >([]);
  const vapiInstance = useRef<Vapi>(null);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_VAPI_API_KEY) {
      throw new Error("No Voice API key configured");
    }

    const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY);
    vapiInstance.current = vapi;
    // Event listeners

    vapi.on("call-start", () => {
      console.log("Call started");
      setIsConnected(true);
    });
    vapi.on("call-end", () => {
      console.log("Call ended");
      setIsConnected(false);
      setIsSpeaking(false);
    });
    vapi.on("speech-start", () => {
      console.log("Assistant started speaking");
      setIsSpeaking(true);
      setLoading(false);
    });
    vapi.on("speech-end", () => {
      console.log("Assistant stopped speaking");
      setIsSpeaking(false);
    });
    vapi.on("message", (message) => {
      if (message.type === "transcript") {
        setTranscript((prev) => [
          ...prev,
          {
            role: message.role,
            text: message.transcript,
          },
        ]);
      }
    });
    vapi.on("error", (error) => {
      console.error("Vapi error:", error);
      setIsConnected(false);
      setIsSpeaking(false);
      setLoading(false);
    });
    return () => {
      vapi.removeAllListeners();
      vapi.stop();
    };
  }, [assistantId]);

  const startCall = () => {
    if (vapiInstance.current) {
      setLoading(true);
      vapiInstance.current.start(assistantId);
    }
  };
  const endCall = () => {
    if (vapiInstance.current) {
      vapiInstance.current.stop();
      vapiInstance.current.removeAllListeners();
    }
  };

  const createReport = async (
    specialist: string
  ): Promise<{ success: boolean; escalated: boolean }> => {
    const result = await generateReport(
      specialist,
      transcript
    );

    if (!result) {
      toast.error("Failed to generate report");

      return {
        success: false,
        escalated: false,
      };
    }
    if (result.ticketCreated) {
      toast.success("Draft report created and escalated to the doctor queue");
    } else {
      toast.success("Medical report generated successfully");
    }

    setReport((prev) => [
      {
        id: result.report.id,
        consultationId: result.report.consultationId,
        finalCarePlanId: result.report.finalCarePlanId,
        specialist: result.report.specialist,
        title: result.report.title,
        content: result.report.content,
        kind: result.report.kind,
        createdAt: result.report.createdAt,
        updatedAt: result.report.updatedAt,
      },
      ...(prev ?? []),
    ]);
    setTranscript([]);
    return {
      success: true,
      escalated: result.ticketCreated,
    };
  };

  return {
    isConnected,
    isSpeaking,
    isLoading,
    transcript,
    startCall,
    endCall,
    createReport,
  };
};
