import { MessageCircle } from "lucide-react";

export const WelcomeHeader = () => (
  <div className="relative overflow-hidden rounded-t-2xl bg-gradient-to-br from-[#0A4F44] via-[#0F6B5C] to-[#1AA88A] px-6 pt-8 pb-7 text-white dark:from-primary dark:via-primary dark:to-primary/85">
    <div
      className="pointer-events-none absolute -top-10 -right-8 h-40 w-40 rounded-full bg-white/10 blur-2xl"
      aria-hidden
    />
    <div className="relative">
      <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur-sm">
        <MessageCircle className="h-3.5 w-3.5" />
        Live support · 24/7
      </div>
      <h2 className="text-xl font-semibold tracking-tight">Hello there</h2>
      <p className="mt-2 max-w-[28ch] text-sm leading-relaxed text-white/90">
        Pick a topic below and chat with our team. Fast, secure, and always here when you need us.
      </p>
    </div>
  </div>
);
