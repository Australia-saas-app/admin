"use client"

import { Form } from "@/src/components/form/form"
import { FormInput } from "@/src/components/form/form-input"
import { Button } from "@/src/components/ui/button"
import { useForm } from "react-hook-form"

type PasswordFormValues = {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

const SettingLayout = () => {
  const form = useForm<PasswordFormValues>({
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  const onSubmit = (values: PasswordFormValues) => {
    if (values.newPassword !== values.confirmPassword) {
      form.setError("confirmPassword", { type: "validate", message: "Passwords do not match" })
      return
    }
    // Replace with API call
    alert("Password updated")
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center ">
      <div className="w-full md:w-2/3 lg:w-1/2 bg-[#e8e6f8] rounded-lg shadow-lg p-6 md:p-8 space-y-6">
        <h1 className="text-2xl font-semibold text-gray-900">Password change</h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <FormInput
              control={form.control}
              name="oldPassword"
              placeholder="old password"
              type="password"
              className="h-12"
            />
            <FormInput
              control={form.control}
              name="newPassword"
              placeholder="new Password"
              type="password"
              showPasswordToggle
              className="h-12"
            />
            <FormInput
              control={form.control}
              name="confirmPassword"
              placeholder="confirm Password"
              type="password"
              showPasswordToggle
              className="h-12"
            />

            <Button
              type="submit"
            >
              Continue
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default SettingLayout