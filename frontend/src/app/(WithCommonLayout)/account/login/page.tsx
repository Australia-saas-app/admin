"use client"
import { useParams, useRouter } from "next/navigation"
import { LoginPage } from "@/src/modules/account/components/login-page"

type AccountType = "admin" | "sub-admin" | "super-admin"

export default function LoginPageRoute() {
  const params = useParams()
  const router = useRouter()
  const accountType = (params.type as AccountType) || "admin"

  const handleAccountTypeChange = (newType: AccountType) => {
    router.push(`/account/${newType}/login`)
  }

  return (
    <LoginPage
      onSignup={() => router.push(`/account/registration`)}
      onForgotPassword={() => router.push(`/account/${accountType}/forgot-password`)}
      onSuccess={(email) => {
        const query = email ? `?email=${encodeURIComponent(email)}` : ""
        router.push(`/account/verification${query}`)
      }}
    />
  )
}
