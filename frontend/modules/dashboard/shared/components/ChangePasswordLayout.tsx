"use client"

import React, { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Form } from "@/src/components/form/form"
import { FormInput } from "@/src/components/form/form-input"
import { FormActions } from "@/src/components/form/FormActions"
import { useUser } from "@/src/context/user.provider"
import { changeRegisteredPassword } from "@/src/server/AuthService"
import { isDemoAuthUser, getUserEmailFromAuthUser } from "@/src/shared/lib/demo-user"

type PasswordForm = {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export default function ChangePasswordLayout() {
  const { user } = useUser()
  const isDemo = isDemoAuthUser(user)
  const email = getUserEmailFromAuthUser(user) ?? ""
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const form = useForm<PasswordForm>({
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  })

  const onSubmit = async (data: PasswordForm) => {
    setMessage(null)
    if (isDemo) {
      setMessage({ type: "error", text: "Demo account passwords are fixed for testing." })
      return
    }
    if (!email) {
      setMessage({ type: "error", text: "Unable to resolve your account email." })
      return
    }
    if (data.newPassword.length < 8) {
      setMessage({ type: "error", text: "New password must be at least 8 characters." })
      return
    }
    if (data.newPassword !== data.confirmPassword) {
      setMessage({ type: "error", text: "New password and confirmation do not match." })
      return
    }

    setSaving(true)
    try {
      const result = await changeRegisteredPassword({
        email,
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      })
      form.reset()
      setMessage({ type: "success", text: result.message ?? "Password changed successfully." })
      toast.success("Password updated")
    } catch (error) {
      const text = error instanceof Error ? error.message : "Failed to change password"
      setMessage({ type: "error", text })
      toast.error(text)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex justify-center px-4 py-6">
      <div className="w-full max-w-lg rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
        <h3 className="text-lg font-semibold text-gray-900">Change Password</h3>
        <p className="mt-1 text-sm text-gray-500">
          Use at least 8 characters with a mix of letters and numbers.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <FormInput
              control={form.control}
              name="currentPassword"
              placeholder="Current password"
              type="password"
              showPasswordToggle
            />
            <FormInput
              control={form.control}
              name="newPassword"
              placeholder="New password"
              type="password"
              showPasswordToggle
            />
            <FormInput
              control={form.control}
              name="confirmPassword"
              placeholder="Confirm new password"
              type="password"
              showPasswordToggle
            />
            <div className="flex justify-end">
              <FormActions
                onCancel={() => {
                  form.reset()
                  setMessage(null)
                }}
                submitLabel="Change password"
                isSubmitting={saving}
              />
            </div>
          </form>
        </Form>

        {message && (
          <p
            className={`mt-4 rounded-lg px-3 py-2 text-sm ${
              message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
            }`}
          >
            {message.text}
          </p>
        )}
      </div>
    </div>
  )
}
