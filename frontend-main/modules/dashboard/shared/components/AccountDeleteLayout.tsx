"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AlertTriangle, ShieldAlert } from "lucide-react"
import { toast } from "sonner"
import { useUser } from "@/src/context/user.provider"
import { logout, verifyAccountPassword } from "@/src/server/AuthService"
import {
  getUserEmailFromAuthUser,
  getUserIdFromAuthUser,
  isDemoAuthUser,
} from "@/src/shared/lib/demo-user"
import { scheduleAccountDeletion } from "@/src/shared/lib/account-lifecycle-store"
import { accountTypeFromRole } from "@/src/shared/lib/verification-access"
import ConfirmActionModal from "./ConfirmActionModal"

export default function AccountDeleteLayout() {
  const router = useRouter()
  const { user } = useUser()
  const isDemo = isDemoAuthUser(user)
  const email = getUserEmailFromAuthUser(user) ?? ""
  const userId = getUserIdFromAuthUser(user) ?? ""
  const [password, setPassword] = useState("")
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [done, setDone] = useState(false)

  const onConfirm = async () => {
    if (isDemo) {
      toast.error("Demo accounts cannot be deleted.")
      setConfirmOpen(false)
      return
    }
    if (!email) {
      toast.error("Unable to verify your account.")
      return
    }

    setConfirming(true)
    try {
      await verifyAccountPassword(email, password)
      scheduleAccountDeletion({ userId, email })
      await logout()
      setDone(true)
      toast.success("Account deletion scheduled.")
      const accountType = accountTypeFromRole(user?.role)
      router.push(`/account/${accountType}/login`)
    } catch {
      toast.error("Could not process deletion request.")
    } finally {
      setConfirming(false)
      setConfirmOpen(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-red-100 bg-gradient-to-r from-red-50 to-white px-6 py-5">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Delete Account</h3>
              <p className="mt-1 text-sm text-gray-500">
                Permanently remove your account and associated dashboard data.
              </p>
            </div>
          </div>
        </div>

        {!done ? (
          <div className="space-y-5 p-6">
            <div className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              <div className="flex gap-2">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <p>
                  This schedules permanent deletion of your profile, wallet history, messages, and applications.
                </p>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Confirm your password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
                placeholder="Enter current password"
              />
            </div>

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setPassword("")}
                className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!password.trim() || isDemo}
                onClick={() => setConfirmOpen(true)}
                className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
              >
                Delete my account
              </button>
            </div>
          </div>
        ) : (
          <div className="px-6 py-10 text-center text-sm text-gray-500">
            Redirecting to login…
          </div>
        )}
      </div>

      <ConfirmActionModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={onConfirm}
        title="Permanently delete account?"
        description="You will be signed out immediately. This action cannot be undone."
        confirmLabel={confirming ? "Deleting…" : "Yes, delete account"}
        variant="danger"
      />
    </div>
  )
}
