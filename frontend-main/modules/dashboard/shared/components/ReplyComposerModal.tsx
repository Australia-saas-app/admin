"use client";

import { useEffect, useState } from "react";
import { Send } from "lucide-react";
import { toast } from "sonner";
import AppModal from "./AppModal";

interface ReplyComposerModalProps {
  open: boolean;
  onClose: () => void;
  to: string;
  subject: string;
  onSend: (body: string) => void;
}

export default function ReplyComposerModal({
  open,
  onClose,
  to,
  subject,
  onSend,
}: ReplyComposerModalProps) {
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!open) {
      setBody("");
      setSending(false);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) {
      toast.error("Please enter a message.");
      return;
    }
    setSending(true);
    await new Promise((r) => setTimeout(r, 500));
    onSend(body.trim());
    toast.success("Reply sent successfully.");
    setSending(false);
    onClose();
  };

  return (
    <AppModal
      open={open}
      onClose={onClose}
      title="Reply to Message"
      description={`To: ${to}`}
      size="md"
      icon={<Send className="h-5 w-5" />}
      footer={
        <button
          type="submit"
          form="reply-form"
          disabled={sending}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-60"
        >
          <Send className="h-4 w-4" />
          {sending ? "Sending..." : "Send Reply"}
        </button>
      }
    >
      <form id="reply-form" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Subject</label>
          <input
            type="text"
            readOnly
            value={`Re: ${subject}`}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-600"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Message</label>
          <textarea
            rows={5}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write your reply..."
            className="w-full resize-none rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
            required
          />
        </div>
      </form>
    </AppModal>
  );
}
