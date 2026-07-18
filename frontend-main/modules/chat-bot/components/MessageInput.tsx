"use client";

import { useRef, useState } from "react";
import { ImagePlus, SendHorizontal, X } from "lucide-react";

const MAX_IMAGE_BYTES = 2.5 * 1024 * 1024;

export type PendingImage = {
  dataUrl: string;
  name: string;
};

export const MessageInput = ({
  message,
  setMessage,
  onSend,
  pendingImage,
  onPendingImage,
  disabled,
}: {
  message: string;
  setMessage: (value: string) => void;
  onSend: () => void;
  pendingImage?: PendingImage | null;
  onPendingImage?: (image: PendingImage | null) => void;
  disabled?: boolean;
}) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");

  const canSend = Boolean(message.trim() || pendingImage) && !disabled;

  const handleFile = (file: File | undefined) => {
    if (!file || !onPendingImage) return;
    setError("");

    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setError("Image must be under 2.5 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onPendingImage({ dataUrl: reader.result, name: file.name });
      }
    };
    reader.onerror = () => setError("Could not read that image.");
    reader.readAsDataURL(file);
  };

  return (
    <div className="border-t border-slate-200/80 bg-white px-3 pt-2.5 pb-3 dark:border-slate-700 dark:bg-slate-900">
      {pendingImage && (
        <div className="mb-2 flex items-start gap-2 rounded-xl bg-slate-50 p-2 dark:bg-slate-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={pendingImage.dataUrl}
            alt="Attachment preview"
            className="h-16 w-16 rounded-lg object-cover"
          />
          <div className="min-w-0 flex-1 pt-0.5">
            <p className="truncate text-xs font-medium text-slate-700 dark:text-slate-200">
              {pendingImage.name}
            </p>
            <p className="text-[11px] text-slate-500">Ready to send</p>
          </div>
          <button
            type="button"
            onClick={() => onPendingImage?.(null)}
            className="rounded-full p-1 text-slate-400 transition hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-700"
            aria-label="Remove attachment"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {error && <p className="mb-1.5 text-[11px] text-red-500">{error}</p>}

      <div className="flex items-end gap-2">
        {onPendingImage && (
          <>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                handleFile(e.target.files?.[0]);
                e.target.value = "";
              }}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={disabled}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-[#0F6B5C] disabled:opacity-40 dark:hover:bg-slate-800 dark:hover:text-emerald-400"
              aria-label="Attach image"
            >
              <ImagePlus className="h-5 w-5" />
            </button>
          </>
        )}

        <div className="relative min-w-0 flex-1">
          <textarea
            rows={1}
            placeholder="Type a message…"
            disabled={disabled}
            className="max-h-28 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 pr-12 text-sm text-slate-800 outline-none transition focus:border-[#0F6B5C]/40 focus:bg-white focus:ring-2 focus:ring-[#0F6B5C]/15 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-primary/50 dark:focus:bg-slate-900 dark:focus:ring-primary/20"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (canSend) onSend();
              }
            }}
          />
          <button
            type="button"
            onClick={onSend}
            disabled={!canSend}
            className="absolute top-1/2 right-1.5 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-[#0F6B5C] text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-35 dark:bg-primary"
            aria-label="Send message"
          >
            <SendHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
