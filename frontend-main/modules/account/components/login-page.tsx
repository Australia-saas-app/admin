"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FormTextInput } from "@/src/components/form/form-text-input";
import { FormCheckbox } from "@/src/components/form/form-checkbox";
import { FormActions } from "@/src/components/form/FormActions";
import { Form } from "@/src/components/form/form";
import { ValidationSummary } from "@/src/components/form/ValidationSummary";
import { Alert } from "@/src/components/ui/alert";
import { useUserLogin } from "@/src/hooks/auth.hook";
import { getLoginErrorMessage } from "@/src/lib/api-error";
import type { DashboardDemoAccountType } from "@/src/constants/demo-accounts";
import { AuthShell } from "./auth-shell";
import { AccountTypeTabs } from "./account-type-tabs";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email or phone is required")
    .refine((val) => {
      const isEmail = z.string().email().safeParse(val).success;
      const isPhone = val.replace(/\D/g, "").length >= 10;
      return isEmail || isPhone;
    }, "Provide a valid email or phone number"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().default(false),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginPageProps {
  accountType?: DashboardDemoAccountType;
  onSignup: () => void;
  onAccountTypeChange: (type: DashboardDemoAccountType) => void;
  onForgotPassword?: () => void;
}

const LOGIN_TITLES: Record<DashboardDemoAccountType, string> = {
  user: "Welcome back",
  affiliate: "Affiliate sign in",
  business: "Business sign in",
};

export function LoginPage({
  accountType = "user",
  onSignup,
  onAccountTypeChange,
  onForgotPassword,
}: LoginPageProps) {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const loginMutation = useUserLogin(redirect);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema) as unknown as Resolver<LoginFormValues, unknown>,
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    loginMutation.reset();
    loginMutation.mutate(data);
  };

  const loginError = loginMutation.isError ? getLoginErrorMessage(loginMutation.error) : null;

  const handleAccountTypeChange = (type: DashboardDemoAccountType) => {
    onAccountTypeChange(type);
  };

  const isSubmitting = loginMutation.isPending;

  return (
    <AuthShell
      title="Your platform for growth"
      subtitle="Sign in to manage projects, earnings, wallet activity, and your professional profile from one secure dashboard."
      badge="Secure access"
    >
      <div className="mb-2">
        <h3 className="hidden text-xl font-bold tracking-tight text-foreground lg:block">
          {LOGIN_TITLES[accountType]}
        </h3>
        <p className="hidden text-sm text-muted-foreground lg:block">
          Choose your account type and sign in to continue.
        </p>
      </div>

      <AccountTypeTabs value={accountType} onChange={handleAccountTypeChange} />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <ValidationSummary
            errors={form.formState.errors}
            labels={{ email: "Email or phone", password: "Password" }}
          />

          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Email or phone
            </label>
            <FormTextInput control={form.control} name="email" placeholder="you@company.com" />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Password</label>
            <FormTextInput
              control={form.control}
              name="password"
              type="password"
              placeholder="Enter your password"
            />
          </div>

          <div className="flex items-center justify-between gap-3">
            <FormCheckbox control={form.control} name="rememberMe" label="Remember me" />
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-sm font-medium text-[#2563EB] hover:underline dark:text-primary"
            >
              Forgot password?
            </button>
          </div>

          {loginError && (
            <Alert tone="danger" title="Sign-in failed">
              {loginError}
            </Alert>
          )}

          <FormActions
            submitLabel={isSubmitting ? "Signing in..." : "Sign in"}
            showCancel={false}
            isSubmitting={isSubmitting}
          />

          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <button
              type="button"
              onClick={onSignup}
              className="font-semibold text-[#2563EB] hover:underline dark:text-primary"
            >
              Create account
            </button>
          </p>
        </form>
      </Form>
    </AuthShell>
  );
}
