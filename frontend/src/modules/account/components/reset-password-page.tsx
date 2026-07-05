"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Form } from "@/src/components/form/form"
import { FormTextInput } from "@/src/components/form/form-text-input"
import { FormActions } from "@/src/components/form/FormActions"

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>

interface ResetPasswordPageProps {
  onSuccess: () => void
}

export function ResetPasswordPage({ onSuccess }: ResetPasswordPageProps) {
  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  const onSubmit = (data: ResetPasswordFormValues) => {
    onSuccess()
  }

  return (
  <Card className="w-full shadow-none bg-base-100 md:w-1/3 py-20 mx-auto border-2 border-border/50">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Enter new Password</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label className="text-sm font-medium">Password</label>
                  <FormTextInput control={form.control} name="password" type="password" placeholder="Enter new password" />
                </div>

                <div>
                  <label className="text-sm font-medium">Confirm Password</label>
                  <FormTextInput control={form.control} name="confirmPassword" type="password" placeholder="Confirm your password" />
                </div>

                <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded">
                  Password should be at least 8 characters long, your can use password *@#$%& to increase account security
                </div>

                <FormActions submitLabel="Continue" showCancel={false} />
            </form>
          </Form>
        </CardContent>
      </Card>
  )
}
