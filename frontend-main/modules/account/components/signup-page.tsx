"use client";

import { FormActions } from "@/src/components/form/FormActions";
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
import { loadSignupDraft, saveSignupDraft } from "@/src/shared/constants/signup-session";
import { AuthShell } from "./auth-shell";
import { AccountTypeTabs } from "./account-type-tabs";

const createSignupSchema = (accountType: "user" | "affiliate" | "business") => {
  const contact = z.string().refine((val) => {
    const isEmail = z.string().email().safeParse(val).success;
    const isPhone = /^\d{10,}$/.test(val);
    return isEmail || isPhone;
  }, "Provide a valid email or phone number");

  const base = {
    contact,
    password: z.string().min(8, "Password must be at least 8 characters"),
    agreeToTerms: z.boolean().refine((val) => val, "You must agree to the terms"),
  };

  if (accountType === "user") {
    return z.object({
      fullName: z.string().min(2, "Full name is required"),
      currency: z.string(),
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
  user: "Start with email or phone, verify with OTP, then finish your profile to unlock the dashboard.",
  affiliate:
    "Open your affiliate account with email or phone. After OTP, complete your affiliate profile before promoting offers.",
  business:
    "Register with email or phone. After OTP, add business details in your profile before operating on the platform.",
};

export function SignupPage({ accountType, onNext, onAccountTypeChange }: SignupPageProps) {
  const [submitErrors, setSubmitErrors] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const schema = useMemo(() => createSignupSchema(accountType), [accountType]);
  const form = useForm<Record<string, unknown>>({
    resolver: zodResolver(schema) as unknown as Resolver<Record<string, unknown>>,
    // Always start controlled with defined strings/booleans (never undefined).
    defaultValues: {
      fullName: "",
      currency: "USD",
      contact: "",
      password: "",
      agreeToTerms: false,
    },
  });

  // Restore any in-progress draft (never the password) after mount.
  useEffect(() => {
    const draft = loadSignupDraft();
    form.reset({
      fullName: typeof draft.fullName === "string" ? draft.fullName : "",
      currency: typeof draft.currency === "string" ? draft.currency : "USD",
      contact: typeof draft.contact === "string" ? draft.contact : "",
      password: "",
      agreeToTerms: false,
    });
  }, [form]);

  // Continuous draft autosave: persist non-sensitive fields while typing.
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const subscription = form.watch((values) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        saveSignupDraft({
          fullName: values.fullName ?? "",
          currency: values.currency ?? "USD",
          contact: values.contact ?? "",
        });
      }, 500);
    });
    return () => {
      subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, [form]);

  const onSubmit = async (data: Record<string, unknown>) => {
    setSubmitErrors(null);
    setIsSubmitting(true);
    try {
      await Promise.resolve(onNext(data));
    } catch (err) {
      setSubmitErrors(err instanceof Error ? err.message : "Sign up failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Start your journey"
      subtitle="Create an account in minutes. Verify your contact, then complete the role-specific profile required to unlock work features."
      badge="New account"
    >
      {isSubmitting && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40">
          <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-card px-8 py-6 shadow-lg">
            <Spinner size={40} label="Saving your details" />
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

      {onAccountTypeChange && (
        <AccountTypeTabs value={accountType} onChange={onAccountTypeChange} />
      )}

      <Form {...form}>
        {submitErrors && (
          <div
            role="alert"
            className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
          >
            {submitErrors}
          </div>
        )}
        <ValidationSummary
          errors={form.formState.errors}
          labels={{
            fullName: "Full name",
            contact: "Email or phone",
            password: "Password",
            agreeToTerms: "Terms agreement",
          }}
          className="mb-4"
        />
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {accountType === "user" && (
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Full name</label>
              <FormTextInput control={form.control} name="fullName" placeholder="John Smith" />
            </div>
          )}

          {accountType === "user" && (
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Preferred currency
              </label>
              <select
                {...form.register("currency")}
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15"
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
              Email or phone
            </label>
            <FormTextInput control={form.control} name="contact" placeholder="you@company.com" />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Password</label>
            <FormTextInput
              control={form.control}
              name="password"
              type="password"
              placeholder="Minimum 8 characters"
            />
          </div>

          <FormCheckbox
            control={form.control}
            name="agreeToTerms"
            label="I agree to the Terms of Service, Privacy Policy, and Cookies Policy"
          />

          <FormActions
            submitLabel={isSubmitting ? "Creating account..." : "Continue"}
            showCancel={false}
            isSubmitting={isSubmitting}
          />

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href={`/account/${accountType}/login`}
              className="font-semibold text-[#2563EB] hover:underline dark:text-primary"
            >
              Sign in
            </Link>
          </p>
        </form>
      </Form>
    </AuthShell>
  );
}
