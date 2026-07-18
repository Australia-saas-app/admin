"use client";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Spinner } from "@/src/components/ui/Spinner";
import { isValidVerificationCode } from "@/src/constants/demo-verification";
import { ShieldCheck } from "lucide-react";
import type React from "react";
import { useState, useEffect } from "react";
import { AuthShell } from "./auth-shell";

interface VerificationPageProps {
  email?: string;
  onSuccess: () => void | Promise<void>;
}

export function VerificationPage({ email = "", onSuccess }: VerificationPageProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(119);
  const [isVerifying, setIsVerifying] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
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

    setIsVerifying(true);
    try {
      await onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setCode(value);
  };

  return (
    <AuthShell
      title="Almost there"
      subtitle="Verify your email or phone, then complete your profile. Work features unlock after profile submission and admin review."
      badge="Verification"
    >
      {isVerifying && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
          <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-card px-8 py-6 shadow-lg">
            <Spinner size={40} label="Creating your account" />
            <p className="text-sm font-medium text-foreground">Creating your account...</p>
          </div>
        </div>
      )}

      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-foreground">Enter verification code</h3>
          <p className="text-sm text-muted-foreground">
            {email ? `Code sent to ${email}` : "Enter the code sent to your contact"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            placeholder="000000"
            value={code}
            onChange={handleCodeChange}
            maxLength={6}
            inputMode="numeric"
            autoComplete="one-time-code"
            disabled={isVerifying}
            className="text-center text-2xl tracking-[0.3em]"
          />
          {error && <p className="mt-2 text-center text-sm text-red-600">{error}</p>}
        </div>

        <div className="text-center">
          <button
            type="button"
            disabled={timeLeft > 0 || isVerifying}
            onClick={() => setTimeLeft(119)}
            className="text-sm font-medium text-primary hover:underline disabled:cursor-not-allowed disabled:text-muted-foreground"
          >
            {timeLeft > 0 ? `Resend code in ${formatTime(timeLeft)}` : "Resend code"}
          </button>
        </div>

        <Button
          type="submit"
          disabled={code.length !== 6 || isVerifying}
          className="w-full bg-primary hover:bg-primary/90"
          size="lg"
        >
          {isVerifying ? "Creating account..." : "Verify & create account"}
        </Button>
      </form>
    </AuthShell>
  );
}
