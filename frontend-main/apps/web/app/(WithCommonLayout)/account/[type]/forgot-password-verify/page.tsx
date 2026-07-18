"use client"

import { ForgotPasswordVerifyPage } from "@/src/modules/account/components/forgot-password-verify-page"
import { useParams, useRouter, useSearchParams } from "next/navigation"

type AccountType = "user" | "affiliate" | "business"

export default function ForgotPasswordVerifyPageRoute() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const accountType = (params.type as AccountType) || "user"

  const encodedEmail = searchParams.get("email")
  const email = encodedEmail ? atob(encodedEmail) : ""

  const handleSuccess = () => {
    router.push(`/account/${accountType}/reset-password`)
  }

  const handleBackToLogin = () => {
    router.push(`/account/${accountType}/login`)
  }

  return <ForgotPasswordVerifyPage email={email} onSuccess={handleSuccess} onBackToLogin={handleBackToLogin} />
}
