"use client";

import { Form } from "@/src/components/form/form";
import { FormCheckbox } from "@/src/components/form/form-checkbox";
import { FormTextInput } from "@/src/components/form/form-text-input";
import { ValidationSummary } from "@/src/components/form/ValidationSummary";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Resolver } from "react-hook-form";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Spinner } from "@/src/components/ui/Spinner";
import { loadSignupDraft, saveSignupDraft, clearSignupDraft } from "@/src/shared/constants/signup-session";
import { AuthShell } from "./auth-shell";
import { AccountTypeTabs } from "./account-type-tabs";
import { OtpInput } from "./OtpInput";
import { useSendRegistrationOtp, useVerifyRegistrationOtp } from "@/src/shared/hooks/auth.hook";
import { CheckCircle2, Copy, Check, XCircle } from "lucide-react";
import { Button } from "@/src/components/ui/button";

const createSignupSchema = (accountType: "user" | "affiliate" | "business") => {
  const email = z.string()
    .min(1, "Email is required")
    .refine((val) => val.includes("@"), "Not an email format, @ missing")
    .refine((val) => z.string().email().safeParse(val).success, "Invalid email format");

  const base = {
    fullName: z.string().min(2, "Full name is required"),
    email,
    password: z.string().min(8, "Password must be at least 8 characters long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    agreeToTerms: z.boolean().refine((val) => val, "You must agree to the terms"),
  };

  if (accountType === "user") {
    return z.object({
      currency: z.string().optional().default("USD"),
      ...base,
    });
  }

  return z.object(base);
};

interface SignupPageProps {
  accountType: "user" | "affiliate" | "business";
  onNext: (data: Record<string, unknown>) => void | Promise<void>;
  onAccountTypeChange?: (type: "user" | "affiliate" | "business") => void;
}

const SIGNUP_TITLES: Record<SignupPageProps["accountType"], string> = {
  user: "Create your account",
  affiliate: "Join as an affiliate",
  business: "Register your business",
};

const SIGNUP_HINTS: Record<SignupPageProps["accountType"], string> = {
  user: "Start with email, verify with OTP, then finish your profile to unlock the dashboard.",
  affiliate: "Open your affiliate account with email. After OTP, complete your affiliate profile before promoting offers.",
  business: "Register with email. After OTP, add business details in your profile before operating on the platform.",
};

export function SignupPage({ accountType, onNext, onAccountTypeChange }: SignupPageProps) {
  const [submitErrors, setSubmitErrors] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(179);
  const [otpVerified, setOtpVerified] = useState(false);
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const { mutateAsync: sendOtp, isPending: isSendingOtp } = useSendRegistrationOtp();
  const { mutateAsync: verifyOtp, isPending: isVerifyingOtp } = useVerifyRegistrationOtp();

  const schema = useMemo(() => createSignupSchema(accountType), [accountType]);
  const form = useForm<Record<string, unknown>>({
    resolver: zodResolver(schema) as unknown as Resolver<Record<string, unknown>>,
    defaultValues: {
      fullName: "",
      currency: "USD",
      email: "",
      password: "",
      agreeToTerms: false,
    },
  });

  // Load draft when accountType changes
  useEffect(() => {
    const draft = loadSignupDraft(accountType);
    form.reset({
      fullName: typeof draft.fullName === "string" ? draft.fullName : "",
      currency: typeof draft.currency === "string" ? draft.currency : "USD",
      email: typeof draft.email === "string" ? draft.email : (typeof draft.contact === "string" ? draft.contact : ""),
      password: "",
      agreeToTerms: false,
    });
    setStep(1);
    setOtp("");
    setOtpVerified(false);
    setGeneratedKey(null);
  }, [accountType, form]);

  // Continuous draft autosave
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const subscription = form.watch((values) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        saveSignupDraft(accountType, {
          fullName: values.fullName ?? "",
          currency: values.currency ?? "USD",
          email: values.email ?? "",
        });
      }, 500);
    });
    return () => {
      subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, [form, accountType]);

  // OTP Timer
  useEffect(() => {
    if (step === 2 && !otpVerified) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [step, otpVerified]);

  const handleContinueToOtp = async () => {
    const isValid = await form.trigger(["fullName", "currency", "email"]);
    if (!isValid) return;
    
    setSubmitErrors(null);
    try {
      await sendOtp({ email: form.getValues("email") as string, type: "registration" });
      setStep(2);
      setTimeLeft(179);
    } catch (err) {
      setSubmitErrors(err instanceof Error ? err.message : "Failed to send OTP.");
    }
  };

  const handleVerifyOtp = async (code: string) => {
    if (code.length !== 6) return;
    setSubmitErrors(null);
    try {
      await verifyOtp({ email: form.getValues("email") as string, otp: code, type: "registration" });
      setOtpVerified(true);
      setTimeout(() => setStep(3), 1000); // Small delay to show green tick before moving to step 3
    } catch (err) {
      setSubmitErrors(err instanceof Error ? err.message : "Invalid OTP.");
    }
  };

  const handleResendOtp = async () => {
    setSubmitErrors(null);
    try {
      await sendOtp({ email: form.getValues("email") as string, type: "registration" });
      setTimeLeft(179);
    } catch (err) {
      setSubmitErrors(err instanceof Error ? err.message : "Failed to resend OTP.");
    }
  };

  const handleCreate = async () => {
    const isValid = await form.trigger(["password", "agreeToTerms"]);
    if (!isValid) return;
    setStep(4);
  };

  const handleGenerateKey = () => {
    const key = Array.from(crypto.getRandomValues(new Uint8Array(16)))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    setGeneratedKey(key);
  };

  const handleCopy = () => {
    if (generatedKey) {
      navigator.clipboard.writeText(generatedKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSubmitFinal = async () => {
    setSubmitErrors(null);
    setIsSubmitting(true);
    try {
      const data = form.getValues();
      const payload = { ...data, otp, recoveryKey: generatedKey };
      await Promise.resolve(onNext(payload));
      clearSignupDraft(accountType);
    } catch (err) {
      setSubmitErrors(err instanceof Error ? err.message : "Sign up failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const passwordValue = (form.watch("password") as string) || "";
  const passwordRequirements = [
    { label: "At least 8 characters", met: passwordValue.length >= 8 },
    { label: "Contains a number", met: /[0-9]/.test(passwordValue) },
    { label: "Contains an uppercase letter", met: /[A-Z]/.test(passwordValue) },
    { label: "Contains a special character", met: /[^A-Za-z0-9]/.test(passwordValue) },
  ];

  const agreeValue = form.watch("agreeToTerms");

  return (
    <AuthShell
      title="Start your journey"
      subtitle="Create an account in minutes. Verify your email, then complete the role-specific profile required to unlock work features."
      badge="New account"
    >
      {isSubmitting && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60">
          <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-card px-8 py-6 shadow-lg">
            <Spinner size={40} label="Creating your account" />
            <p className="text-sm font-medium text-foreground">Preparing your account...</p>
          </div>
        </div>
      )}

      <div className="mb-2">
        <h3 className="hidden text-xl font-bold tracking-tight text-foreground lg:block">
          {SIGNUP_TITLES[accountType]}
        </h3>
        <p className="hidden text-sm text-muted-foreground lg:block">{SIGNUP_HINTS[accountType]}</p>
      </div>

      {onAccountTypeChange && step === 1 && (
        <AccountTypeTabs value={accountType} onChange={onAccountTypeChange} />
      )}

      <Form {...form}>
        {submitErrors && (
          <div
            role="alert"
            className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400"
          >
            {submitErrors}
          </div>
        )}

        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          
          {/* STEP 1 & ONWARDS: Info */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Full name</label>
            <FormTextInput control={form.control} name="fullName" placeholder="John Smith" />
          </div>

          {accountType === "user" && (
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Preferred currency
              </label>
              <select
                {...form.register("currency")}
                disabled={step > 1}
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all disabled:opacity-50"
              >
                <option value="USD">USD — US Dollar</option>
                <option value="INR">INR — Indian Rupee</option>
                <option value="EUR">EUR — Euro</option>
                <option value="GBP">GBP — British Pound</option>
              </select>
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Email
            </label>
            <FormTextInput control={form.control} name="email" placeholder="you@company.com" />
          </div>

          {step === 1 && (
            <Button
              type="button"
              onClick={handleContinueToOtp}
              disabled={isSendingOtp}
              className="w-full bg-primary hover:bg-primary/90 mt-6"
              size="lg"
            >
              {isSendingOtp ? "Sending OTP..." : "Continue"}
            </Button>
          )}

          {/* STEP 2 & ONWARDS: OTP Verification */}
          {step >= 2 && (
            <div className="pt-2 relative animate-in fade-in slide-in-from-top-2 duration-500">
              <label className="mb-1.5 block text-sm font-medium text-foreground text-center sm:text-left">Verification Code</label>
              
              <div className="relative">
                <OtpInput
                  value={otp}
                  onChange={(val) => {
                    setOtp(val);
                    if (val.length === 6) handleVerifyOtp(val);
                  }}
                  length={6}
                  disabled={isVerifyingOtp || otpVerified || step > 2}
                />
                
                {otpVerified && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50 backdrop-blur-[2px] rounded-xl overflow-hidden">
                    <div className="flex items-center gap-2 px-4 py-2 border-[3px] border-emerald-600 dark:border-emerald-500 rounded-lg text-emerald-600 dark:text-emerald-500 font-black tracking-widest uppercase transform -rotate-[12deg] animate-in zoom-in duration-500 bg-white/95 dark:bg-[#1c1c1e]/95 shadow-xl backdrop-blur-sm">
                      <CheckCircle2 className="w-5 h-5" strokeWidth={3} />
                      <span className="text-lg mt-0.5">Verified</span>
                    </div>
                  </div>
                )}
              </div>

              {step === 2 && !otpVerified && (
                <div className="mt-3 text-center">
                  <button
                    type="button"
                    disabled={timeLeft > 0 || isSendingOtp || isVerifyingOtp}
                    onClick={handleResendOtp}
                    className="text-sm font-medium text-primary hover:underline disabled:cursor-not-allowed disabled:text-muted-foreground transition-colors"
                  >
                    {timeLeft > 0 ? `Resend code in ${formatTime(timeLeft)}` : "Resend code"}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* STEP 3 & ONWARDS: Password and Terms */}
          {step >= 3 && (
            <div className="animate-in fade-in slide-in-from-top-4 duration-500 space-y-4 pt-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Password</label>
                <FormTextInput
                  control={form.control}
                  name="password"
                  type="password"
                  placeholder="Minimum 8 characters"
                />
              </div>

              <div className="rounded-lg bg-muted/50 p-4 space-y-2">
                <p className="text-sm font-medium text-foreground mb-3">Password requirements:</p>
                {passwordRequirements.map((req, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    {req.met ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-muted-foreground" />
                    )}
                    <span className={req.met ? "text-emerald-600 dark:text-emerald-500 font-medium" : "text-muted-foreground"}>
                      {req.label}
                    </span>
                  </div>
                ))}
              </div>

              <FormCheckbox
                control={form.control}
                name="agreeToTerms"
                label="I agree to the Terms of Service, Privacy Policy, and Cookies Policy"
              />

              {step === 3 && (
                <Button
                  type="button"
                  onClick={handleCreate}
                  disabled={!agreeValue || !passwordRequirements.every(r => r.met)}
                  className="w-full bg-primary hover:bg-primary/90 mt-6"
                  size="lg"
                >
                  Create
                </Button>
              )}
            </div>
          )}

          {/* STEP 4: Generate Key */}
          {step === 4 && (
            <div className="animate-in fade-in zoom-in-95 duration-500 mt-6">
              <div className="rounded-xl border border-border bg-card p-6 text-center space-y-4 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/40 via-primary to-primary/40" />
                
                <h4 className="text-lg font-bold text-foreground">Account Ready</h4>
                <p className="text-sm text-muted-foreground">
                  Your account is ready. You may optionally generate a recovery key to restore your account if you lose access.
                </p>

                {!generatedKey ? (
                  <Button type="button" variant="outline" onClick={handleGenerateKey} className="w-full border-primary/20 hover:bg-primary/5">
                    Generate Recovery Key
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-foreground block text-left">Your Recovery Key</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="text" 
                        readOnly 
                        value={generatedKey} 
                        className="flex-1 rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-foreground font-mono focus:outline-none"
                      />
                      <Button type="button" size="icon" variant="outline" onClick={handleCopy} className="shrink-0">
                        {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
                      </Button>
                    </div>
                    <p className="text-xs text-amber-600 dark:text-amber-500 font-medium text-left">
                      Copy this key and store it securely. It will not be shown again!
                    </p>
                  </div>
                )}

                <Button
                  type="button"
                  onClick={handleSubmitFinal}
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-primary/90 mt-4"
                  size="lg"
                >
                  {isSubmitting ? "Saving..." : "Submit"}
                </Button>
              </div>
            </div>
          )}

          {step < 4 && (
            <p className="text-center text-sm text-muted-foreground mt-6">
              Already have an account?{" "}
              <Link
                href={`/account/${accountType}/login`}
                className="font-semibold text-primary hover:underline"
              >
                Sign in
              </Link>
            </p>
          )}
        </form>
      </Form>
    </AuthShell>
  );
}
