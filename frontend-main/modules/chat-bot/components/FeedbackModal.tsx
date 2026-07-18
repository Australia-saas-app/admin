import { Button } from "@/src/components/ui/button";
import { MessageCircleHeart } from "lucide-react";
import { IoChevronBack } from "react-icons/io5";

export const FeedbackModal = ({
  onClose,
  onFeedback,
}: {
  onClose: () => void;
  onFeedback: (positive: boolean) => void;
}) => (
  <div className="relative flex h-full w-full flex-col items-center justify-center px-6 text-center">
    <button
      type="button"
      onClick={onClose}
      className="absolute top-3 left-3 rounded-full p-2 text-[#0F6B5C] transition hover:bg-slate-100 dark:text-emerald-300 dark:hover:bg-slate-800"
      aria-label="Back to chat"
    >
      <IoChevronBack size={22} />
    </button>

    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#0F6B5C]/10 text-[#0F6B5C] dark:bg-primary/20 dark:text-emerald-300">
      <MessageCircleHeart className="h-8 w-8" />
    </div>
    <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Did we help you?</h2>
    <p className="mt-2 max-w-[26ch] text-sm leading-relaxed text-slate-500 dark:text-slate-400">
      Your feedback helps us improve support for everyone.
    </p>
    <div className="mt-6 flex gap-3">
      <Button
        onClick={() => onFeedback(true)}
        className="min-w-[88px] rounded-full bg-[#0F6B5C] px-6 hover:bg-[#0C584B] dark:bg-primary"
      >
        Yes
      </Button>
      <Button
        variant="outline"
        onClick={() => onFeedback(false)}
        className="min-w-[88px] rounded-full px-6"
      >
        No
      </Button>
    </div>
  </div>
);
