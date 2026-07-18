"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { KeyRound } from "lucide-react";
import { FormTextInput } from "@/src/components/form/form-text-input";
import { FormActions } from "@/src/components/form/FormActions";
import { Form } from "@/src/components/form/form";
import { AuthShell } from "./auth-shell";

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email or phone is required")
    .refine((val) => {
      const isEmail = z.string().email().safeParse(val).success;
      const isPhone = val.replace(/\D/g, "").length >= 10;
      return isEmail || isPhone;
    }, "Provide a valid email or phone number"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

interface ForgotPasswordPageProps {
  onNext: (email: string) => void;
  onBackToLogin: () => void;
}

export function ForgotPasswordPage({ onNext, onBackToLogin }: ForgotPasswordPageProps) {
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: ForgotPasswordFormValues) => {
    onNext(data.email);
  };

  return (
    <AuthShell
      title="Account recovery"
      subtitle="Reset your password securely. We'll send a verification code to your registered email or phone number."
      badge="Password reset"
    >
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <KeyRound className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-foreground">Forgot password</h3>
          <p className="text-sm text-muted-foreground">
            Enter your account email or phone to receive a reset code.
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Email or phone
            </label>
            <FormTextInput control={form.control} name="email" placeholder="you@company.com" />
          </div>

          <FormActions submitLabel="Send reset code" showCancel={false} />

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
      </Form>
    </AuthShell>
  );
}
