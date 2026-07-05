"use client"

import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import type { Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { FormTextInput } from "@/src/components/form/form-text-input"
// import { FormCheckbox } from "@/src/components/form/form-checkbox"
import { FormActions } from "@/src/components/form/FormActions"
import { Card, CardContent } from "@/src/components/ui/card"
import { Form } from "@/src/components/form/form"


import { useAppDispatch, useAppSelector } from "@/src/redux/hooks"
import { loginUser, clearError } from "@/src/redux/slices/authSlice"
import { useEffect } from "react"
import { toast } from "sonner"
import FormCheckbox from "@/src/components/form/form-checkbox"


const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().default(false),
})

type LoginFormValues = z.infer<typeof loginSchema>



interface LoginPageProps {
  onForgotPassword?: () => void
  onSignup?: () => void
  onSuccess?: (email?: string) => void
}

export function LoginPage({ onForgotPassword, onSuccess }: LoginPageProps) {
  const dispatch = useAppDispatch()
  const { loading, error, isAuthenticated, token } = useAppSelector((state) => state.auth)
  const router = useRouter()

  const form = useForm<LoginFormValues>({
    // Cast resolver to the expected Resolver type to avoid type incompatibilities
    resolver: zodResolver(loginSchema) as unknown as Resolver<LoginFormValues, any>,
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  })

  useEffect(() => {
    if (error) {
      toast.error(error)
      dispatch(clearError())
    }
  }, [error, dispatch])

  useEffect(() => {
    if (isAuthenticated || token) {
      router.replace("/")
    }
  }, [isAuthenticated, token, router])

  const onSubmit = async (data: LoginFormValues) => {
    dispatch(loginUser({ email: data.email, password: data.password }))
  }

  if (isAuthenticated || token) {
    return null; // Or a loading spinner
  }


  return (
    <Card className="w-full shadow-none bg-base-100 md:w-1/3 py-20 mx-auto border-2 border-border/50">

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Email Or Phone</label>
              <FormTextInput control={form.control} name="email" placeholder="abc@gmail.com" />
            </div>

            <div>
              <label className="text-sm font-medium">Password</label>
              <FormTextInput control={form.control} name="password" type="password" placeholder="Enter your password" />
            </div>

            <div className="flex items-center justify-between">
              <FormCheckbox control={form.control} name="rememberMe" label={"Remember me"} />
              <button type="button" onClick={onForgotPassword} className="text-sm text-primary hover:underline">
                Forgot Password?
              </button>
            </div>

            <FormActions submitLabel={loading ? "Logging In..." : "Log In"} showCancel={false} />

          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
