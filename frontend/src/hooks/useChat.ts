import { useCallback, useRef, useState } from "react";
import { sendChatStream } from "../services/api";
import type { Message, Source } from "../types";

let nextId = 0;
function genId(): string {
  nextId += 1;
  return `msg-${nextId}-${Date.now()}`;
}

const WELCOME_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  content:
    "Hello! I'm the NUST Bank Assistant. How can I help you today? You can ask me about account services, funds transfer, mobile banking, and more.",
};

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [isStreaming, setIsStreaming] = useState(false);
  const abortRef = useRef(false);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isStreaming) return;

      const userMsg: Message = { id: genId(), role: "user", content: text };
      const botId = genId();
      const botMsg: Message = {
        id: botId,
        role: "assistant",
        content: "",
        isStreaming: true,
      };

      setMessages((prev) => [...prev, userMsg, botMsg]);
      setIsStreaming(true);
      abortRef.current = false;

      const sourcesForMsg: Source[] = [];

      try {
        await sendChatStream(
          text,
          (token) => {
            if (abortRef.current) return;
            setMessages((prev) =>
              prev.map((m) =>
                m.id === botId ? { ...m, content: m.content + token } : m,
              ),
            );
          },
          () => {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === botId
                  ? { ...m, isStreaming: false, sources: sourcesForMsg }
                  : m,
              ),
            );
            setIsStreaming(false);
          },
          (error) => {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === botId
                  ? {
                      ...m,
                      content: `Sorry, something went wrong: ${error}`,
                      isStreaming: false,
                    }
                  : m,
              ),
            );
            setIsStreaming(false);
          },
        );
      } catch {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === botId
              ? {
                  ...m,
                  content:
                    "Sorry, I couldn't connect to the server. Please try again later.",
                  isStreaming: false,
                }
              : m,
          ),
        );
        setIsStreaming(false);
      }
    },
    [isStreaming],
  );

  return { messages, isStreaming, sendMessage };
}
