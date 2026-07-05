"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"

import { FormTextInput } from "@/src/components/form/form-text-input"
import { FormActions } from "@/src/components/form/FormActions"
import { Form } from "@/src/components/form/form"


const forgotPasswordSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .or(z.string().regex(/^\d{10,}$/, "Invalid phone number")),
})

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

interface ForgotPasswordPageProps {
  onNext: (email: string) => void
  onBackToLogin: () => void
}

export function ForgotPasswordPage({ onNext, onBackToLogin }: ForgotPasswordPageProps) {
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  })

  const onSubmit = (data: ForgotPasswordFormValues) => {
    onNext(data.email)
  }

  return (
    <Card className="w-full shadow-none bg-base-100 md:w-1/3 py-20 mx-auto border-2 border-border/50">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Forgot password</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="text-sm font-medium">Email or phone</label>
                <FormTextInput control={form.control} name="email" placeholder="Email or phone" />
              </div>

              <FormActions submitLabel="Reset" showCancel={false} />

              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <button onClick={onBackToLogin} className="text-primary hover:underline font-medium">
                  LOGIN
                </button>
              </p>
            </form>
          </Form>
        </CardContent>
      </Card>
  )
}
