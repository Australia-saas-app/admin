"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { ShieldCheck } from "lucide-react";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { isValidVerificationCode } from "@/src/constants/demo-verification";
import { toast } from "sonner";
import { AuthShell } from "./auth-shell";
import { OtpInput } from "./OtpInput";

interface ForgotPasswordVerifyPageProps {
  email: string;
  onSuccess: () => void;
  onBackToLogin: () => void;
}

export function ForgotPasswordVerifyPage({
  email,
  onSuccess,
  onBackToLogin,
}: ForgotPasswordVerifyPageProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(179);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (code.length !== 6) {
      setError("Please enter the 6-digit verification code");
      return;
    }

    if (!isValidVerificationCode(code)) {
      setError("Invalid verification code. Please check the code and try again.");
      return;
    }

    toast.success("Code verified");
    onSuccess();
  };

  const handleCodeChange = (value: string) => {
    setError(null);
    setCode(value);
  };

  return (
    <AuthShell
      title="Verify your identity"
      subtitle="Enter the 6-digit code we sent to your email or phone to continue resetting your password."
      badge="Verification"
    >
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-foreground">Enter verification code</h3>
          <p className="text-sm text-muted-foreground">
            Check your inbox or messages for the reset code.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Email or phone</label>
          <Input value={email} disabled className="bg-muted/50" />
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">6-digit code</label>
            <button
              type="button"
              disabled={timeLeft > 0}
              onClick={() => {
                setTimeLeft(179);
                toast.success("OTP sent successfully", {
                  description: "Check your email or messages for the new code.",
                });
              }}
              className="text-xs font-medium text-primary hover:underline disabled:cursor-not-allowed disabled:text-muted-foreground"
            >
              {timeLeft > 0 ? `Resend in ${formatTime(timeLeft)}` : "Resend code"}
            </button>
          </div>
          <div className="pt-2">
            <OtpInput
              value={code}
              onChange={handleCodeChange}
              length={6}
            />
          </div>
          {error && <p className="mt-3 text-sm text-red-600 dark:text-red-500 text-center font-medium">{error}</p>}
        </div>

        <Button
          type="submit"
          disabled={code.length !== 6}
          className="w-full bg-primary hover:bg-primary/90"
          size="lg"
        >
          Verify &amp; continue
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Remember your password?{" "}
          <button
            type="button"
            onClick={onBackToLogin}
            className="font-semibold text-primary hover:underline"
          >
            Back to sign in
          </button>
        </p>
      </form>
    </AuthShell>
  );
}
