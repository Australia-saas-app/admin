"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { KeyRound, CheckCircle2, XCircle } from "lucide-react";
import { Form } from "@/src/components/form/form";
import { FormTextInput } from "@/src/components/form/form-text-input";
import { FormActions } from "@/src/components/form/FormActions";
import { AuthShell } from "./auth-shell";

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

interface ResetPasswordPageProps {
  onSuccess: (password: string) => void;
}

export function ResetPasswordPage({ onSuccess }: ResetPasswordPageProps) {
  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: ResetPasswordFormValues) => {
    onSuccess(data.password);
  };

  const passwordValue = form.watch("password") || "";

  const passwordRequirements = [
    { label: "At least 8 characters", met: passwordValue.length >= 8 },
    { label: "Contains a number", met: /[0-9]/.test(passwordValue) },
    { label: "Contains an uppercase letter", met: /[A-Z]/.test(passwordValue) },
    { label: "Contains a special character", met: /[^A-Za-z0-9]/.test(passwordValue) },
  ];

  return (
    <AuthShell
      title="Set a new password"
      subtitle="Choose a strong password to secure your account. Use at least 8 characters with letters and numbers."
      badge="Password reset"
    >
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <KeyRound className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-foreground">Create new password</h3>
          <p className="text-sm text-muted-foreground">
            Enter and confirm your new password below.
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">New password</label>
            <FormTextInput
              control={form.control}
              name="password"
              type="password"
              placeholder="Enter new password"
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

          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Confirm password
            </label>
            <FormTextInput
              control={form.control}
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
            />
          </div>
          <FormActions submitLabel="Update password" showCancel={false} />
        </form>
      </Form>
    </AuthShell>
  );
}
