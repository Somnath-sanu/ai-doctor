import { useState, useEffect, useRef } from "react";
import Vapi from "@vapi-ai/web";

export const useVapi = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
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
    });
    return () => {
      vapi.removeAllListeners();
      vapi.stop();
    };
  }, []);

  const startCall = () => {
    if (vapiInstance.current) {
      vapiInstance.current.start(process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID!);
    }
  };
  const endCall = () => {
    if (vapiInstance.current) {
      vapiInstance.current.stop();
      vapiInstance.current.removeAllListeners();
    }
  };

  return {
    isConnected,
    isSpeaking,
    transcript,
    startCall,
    endCall,
  };
};
