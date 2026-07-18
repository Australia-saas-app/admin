"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { KeyRound } from "lucide-react";
import { Form } from "@/src/components/form/form";
import { FormTextInput } from "@/src/components/form/form-text-input";
import { FormActions } from "@/src/components/form/FormActions";
import { AuthShell } from "./auth-shell";

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters long"),
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
          <p className="rounded-lg bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
            Use at least 8 characters. Mix letters, numbers, and symbols for stronger security.
          </p>
          <FormActions submitLabel="Update password" showCancel={false} />
        </form>
      </Form>
    </AuthShell>
  );
}
