import { IoClose } from "react-icons/io5";
import { VscChromeMinimize } from "react-icons/vsc";
import { AgentAvatar } from "./AgentAvatar";

const AGENT_NAME = "Support Team";

export const ChatHeader = ({
  category,
  onMinimize,
  onClose,
}: {
  category?: string;
  onMinimize: () => void;
  onClose: () => void;
}) => (
  <div className="flex items-center justify-between rounded-t-2xl bg-gradient-to-r from-[#0A4F44] via-[#0F6B5C] to-[#148F7A] px-4 py-3.5 dark:from-primary dark:via-primary dark:to-primary/90">
    <div className="flex min-w-0 items-center gap-3">
      <div className="relative">
        <AgentAvatar name={AGENT_NAME} size={42} />
        <span className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-[#0F6B5C] bg-emerald-400 dark:border-primary" />
      </div>
      <div className="min-w-0">
        <p className="truncate text-[15px] font-semibold text-white">{AGENT_NAME}</p>
        <p className="truncate text-xs text-white/80">
          {category ? `${category} · Online` : "Online · Typically replies instantly"}
        </p>
      </div>
    </div>
    <div className="flex shrink-0 items-center gap-0.5">
      <button
        type="button"
        onClick={onMinimize}
        className="rounded-full p-2 text-white/90 transition hover:bg-white/15"
        aria-label="Minimize chat"
      >
        <VscChromeMinimize className="text-xl" />
      </button>
      <button
        type="button"
        onClick={onClose}
        className="rounded-full p-2 text-white/90 transition hover:bg-white/15"
        aria-label="Close chat"
      >
        <IoClose size={22} />
      </button>
    </div>
  </div>
);
