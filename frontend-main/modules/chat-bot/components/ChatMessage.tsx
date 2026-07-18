import { AgentAvatar } from "./AgentAvatar";
import type { TMessage } from "../types";

type ChatMessageProps = {
  message: TMessage;
  isOwn: boolean;
};

function formatTime(value?: Date | string) {
  if (!value) return "";
  return new Date(value).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ChatMessage({ message, isOwn }: ChatMessageProps) {
  const imageSrc = message.file?.image;
  const hasText = Boolean(message.content?.trim());
  const senderLabel = message.senderName || "Support";

  return (
    <div
      className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
      aria-label={`Message from ${isOwn ? "you" : senderLabel}`}
    >
      <div className={`flex max-w-[85%] gap-2 ${isOwn ? "flex-row-reverse" : ""}`}>
        {!isOwn && <AgentAvatar name={senderLabel} size={32} className="mt-5" />}

        <div className={`flex min-w-0 flex-col ${isOwn ? "items-end" : "items-start"}`}>
          {!isOwn && (
            <span className="mb-1 px-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
              {senderLabel}
            </span>
          )}

          <div
            className={`overflow-hidden rounded-2xl ${
              isOwn
                ? "rounded-br-md bg-[#0F6B5C] text-white dark:bg-primary"
                : "rounded-bl-md bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100"
            } ${imageSrc && !hasText ? "p-1" : "px-3.5 py-2.5"}`}
          >
            {imageSrc && (
              <a
                href={imageSrc}
                target="_blank"
                rel="noopener noreferrer"
                className={`block overflow-hidden ${hasText ? "mb-2 -mx-1 -mt-1" : ""}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageSrc}
                  alt="Shared attachment"
                  className="max-h-52 w-full max-w-[240px] object-cover transition-opacity duration-200 hover:opacity-95"
                  loading="lazy"
                />
              </a>
            )}
            {hasText && (
              <p className="text-[14px] leading-relaxed break-words whitespace-pre-wrap">
                {message.content}
              </p>
            )}
          </div>

          <span
            className={`mt-1 px-1 text-[10px] ${
              isOwn ? "text-slate-400" : "text-slate-400 dark:text-slate-500"
            }`}
          >
            {formatTime(message.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
}
