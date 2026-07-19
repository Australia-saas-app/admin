"use client";

import { Spinner } from "@/src/components/ui/Spinner";

interface RegistrationLoadingOverlayProps {
  label?: string;
}

export function RegistrationLoadingOverlay({
  label = "Creating your account...",
}: RegistrationLoadingOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
      <div className="flex flex-col items-center gap-4 rounded-xl bg-card px-8 py-6 shadow-lg border border-border">
        <Spinner size={40} label={label} />
        <p className="text-sm font-medium text-foreground">{label}</p>
      </div>
    </div>
  );
}
