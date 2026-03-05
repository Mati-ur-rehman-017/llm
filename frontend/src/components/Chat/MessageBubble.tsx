import { useState } from "react";
import type { Message } from "../../types";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const [showSources, setShowSources] = useState(false);
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isUser
            ? "bg-emerald-600 text-white rounded-br-md"
            : "bg-gray-100 text-gray-800 rounded-bl-md"
        }`}
      >
        <p className="whitespace-pre-wrap break-words">{message.content}</p>

        {message.isStreaming && (
          <span className="mt-1 inline-block h-4 w-1.5 animate-pulse rounded-sm bg-current opacity-60" />
        )}

        {!isUser &&
          message.sources &&
          message.sources.length > 0 &&
          !message.isStreaming && (
            <div className="mt-2 border-t border-gray-200 pt-2">
              <button
                onClick={() => setShowSources(!showSources)}
                className="text-xs font-medium text-emerald-700 hover:text-emerald-900"
              >
                {showSources
                  ? "Hide sources"
                  : `View sources (${message.sources.length})`}
              </button>

              {showSources && (
                <ul className="mt-1.5 space-y-1">
                  {message.sources.map((source) => (
                    <li
                      key={source.doc_id}
                      className="rounded bg-gray-50 p-2 text-xs text-gray-600"
                    >
                      <span className="font-medium text-gray-700">
                        {source.doc_id}
                      </span>
                      <span className="ml-2 text-gray-400">
                        ({(source.score * 100).toFixed(0)}% match)
                      </span>
                      <p className="mt-0.5 line-clamp-2">{source.text}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
      </div>
    </div>
  );
}
