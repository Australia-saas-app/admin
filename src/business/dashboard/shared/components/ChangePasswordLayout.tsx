"use client"

import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { Form } from "@/src/shared/ui/form/form"
import { FormInput } from "@/src/shared/ui/form/form-input"
import { FormActions } from "@/src/shared/ui/form/FormActions"

type PasswordForm = {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

const ChangePasswordLayout: React.FC = () => {
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)

  const form = useForm<PasswordForm>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  const onSubmit = async (data: PasswordForm) => {
    const { currentPassword, newPassword, confirmPassword } = data
    if (!currentPassword || !newPassword || newPassword !== confirmPassword) {
      setSuccess("")
      return
    }

    setSaving(true)
    // Simulate API call
    await new Promise((r) => setTimeout(r, 0))
    setSaving(false)
    setSuccess("Password changed successfully")
    form.reset()
  }

  return (
    <div className="flex justify-center mt-10 md:mt-20 px-4  items-center">
      <div className="md:w-1/2  w-full  mx-auto bg-white rounded shadow p-6">
        <h3 className="font-semibold mb-4">Change Password</h3>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <FormInput
                control={form.control}
                name="currentPassword"
                placeholder="Enter current password"
                type="password"
                showPasswordToggle
              />
            </div>

            <div>
              <FormInput
                control={form.control}
                name="newPassword"
                placeholder="New password"
                type="password"
                showPasswordToggle
              />
            </div>

            <div>
              <FormInput
                control={form.control}
                name="confirmPassword"
                placeholder="Confirm new password"
                type="password"
                showPasswordToggle
              />
            </div>

            <div className="flex items-center justify-end gap-3">
              <FormActions
                onCancel={() => {
                  form.reset()
                  setSuccess(null)
                }}
                submitLabel="Change My Password"
                isSubmitting={saving}
              />
            </div>

            {success !== null && (
              <div className={`p-3 rounded text-sm ${success ? "bg-green-50 text-green-700" : "bg-rose-50 text-rose-700"}`}>
                {success || "Please check fields"}
              </div>
            )}
          </form>
        </Form>
      </div>
    </div>
  )
}

export default ChangePasswordLayout