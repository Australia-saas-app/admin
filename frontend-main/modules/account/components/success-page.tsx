"use client";

import { Button } from "@/src/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { AuthShell } from "./auth-shell";

interface SuccessPageProps {
  onDone: () => void;
  variant?: "registration" | "password-reset";
}

export function SuccessPage({ onDone, variant = "registration" }: SuccessPageProps) {
  const isReset = variant === "password-reset";

  return (
    <AuthShell
      title={isReset ? "Password updated" : "Welcome aboard"}
      subtitle={
        isReset
          ? "Your password has been changed. Sign in with your new credentials."
          : "Your account is ready. Sign in to access your dashboard and start using the platform."
      }
      badge={isReset ? "Security" : "Complete"}
    >
      <div className="flex flex-col items-center space-y-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#DCFCE7] dark:bg-green-950">
          <CheckCircle2 className="h-10 w-10 text-[#16A34A]" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-foreground">
            {isReset ? "Password reset successful" : "Registration complete"}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {isReset
              ? "You can now sign in with your new password."
              : "Thank you for registering. Log in with the email or phone and password you created."}
          </p>
        </div>
        <Button
          onClick={onDone}
          className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] dark:bg-primary dark:hover:brightness-110"
          size="lg"
        >
          {isReset ? "Back to sign in" : "Go to sign in"}
        </Button>
      </div>
    </AuthShell>
  );
}
