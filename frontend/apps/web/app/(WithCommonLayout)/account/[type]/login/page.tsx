"use client"
import { useParams, useRouter } from "next/navigation"
import { LoginPage } from "@/src/modules/account/components/login-page"

type AccountType = "user" | "affiliate" | "business"

export default function LoginPageRoute() {
  const params = useParams()
  const router = useRouter()
  const accountType = (params.type as AccountType) || "user"

  const handleAccountTypeChange = (newType: AccountType) => {
    router.push(`/account/${newType}/login`)
  }

  return (
    <LoginPage
      accountType={accountType}
      onSignup={() => router.push(`/account/${accountType}/registration`)}
      onAccountTypeChange={handleAccountTypeChange}
      onForgotPassword={() => router.push(`/account/${accountType}/forgot-password`)}
    />
  )
}
