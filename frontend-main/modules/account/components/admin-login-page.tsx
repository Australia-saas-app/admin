"use client"

import { useForm } from "react-hook-form"
import type { Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { FormTextInput } from "@/src/components/form/form-text-input"
import { FormCheckbox } from "@/src/components/form/form-checkbox"
import { FormActions } from "@/src/components/form/FormActions"
import { Form } from "@/src/components/form/form"
import { useUserLogin } from "@/src/hooks/auth.hook"
import { getLoginErrorMessage } from "@/src/lib/api-error"
import { AuthShell } from "./auth-shell"
import { Shield } from "lucide-react"

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().default(false),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function AdminLoginPage() {
  const loginMutation = useUserLogin()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema) as unknown as Resolver<LoginFormValues, unknown>,
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  })

  const onSubmit = (data: LoginFormValues) => {
    loginMutation.reset()
    loginMutation.mutate(data)
  }

  const loginError = loginMutation.isError
    ? getLoginErrorMessage(loginMutation.error)
    : null

  const isSubmitting = loginMutation.isPending

  return (
    <AuthShell
      title="Admin Console"
      subtitle="Secure access to platform management, user accounts, content moderation, transactions, and system settings."
      badge="Administration"
    >
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1e3a5f]/10 text-[#1e3a5f]">
          <Shield className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Administrator sign in</h3>
          <p className="text-sm text-gray-500">Restricted access for authorized personnel only.</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Email</label>
            <FormTextInput control={form.control} name="email" placeholder="admin@company.com" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Password</label>
            <FormTextInput
              control={form.control}
              name="password"
              type="password"
              placeholder="Enter your password"
            />
          </div>
          <FormCheckbox control={form.control} name="rememberMe" label="Remember this device" />

          {loginError && (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
              {loginError}
            </p>
          )}

          <FormActions
            submitLabel={isSubmitting ? "Signing in..." : "Sign in to console"}
            showCancel={false}
            isSubmitting={isSubmitting}
          />
        </form>
      </Form>
    </AuthShell>
  )
}
