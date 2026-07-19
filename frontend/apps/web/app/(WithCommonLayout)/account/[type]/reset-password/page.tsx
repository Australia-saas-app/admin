"use client"

import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import { ResetPasswordPage } from "@/src/modules/account/components/reset-password-page"

type AccountType = "user" | "affiliate" | "business"

export default function ResetPasswordPageRoute() {
  const params = useParams()
  const router = useRouter()
  const accountType = (params.type as AccountType) || "user"

  const handleSuccess = (password: string) => {
    void password
    toast.success("Password updated successfully.")
    router.push(`/account/${accountType}/success?flow=reset`)
  }

  return <ResetPasswordPage onSuccess={handleSuccess} />
}
