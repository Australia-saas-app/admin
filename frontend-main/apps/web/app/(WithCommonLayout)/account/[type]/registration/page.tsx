"use client"

import { useEffect } from "react"
import { SignupPage } from "@/src/modules/account/components/signup-page"
import { clearSignupDraft, saveSignupDraft } from "@/src/constants/signup-session"
import { useParams, useRouter } from "next/navigation"

type AccountType = "user" | "affiliate" | "business"

export default function RegistrationPageRoute() {
  const params = useParams()
  const router = useRouter()
  const accountType = (params.type as AccountType) || "user"

  useEffect(() => {
    clearSignupDraft()
  }, [accountType])

  const handleNext = (data: Record<string, unknown>) => {
    // Progressive signup: verify contact first; full profile happens after login.
    saveSignupDraft({ ...data, accountType })
    router.push(`/account/${accountType}/verification`)
  }

  const handleAccountTypeChange = (newType: AccountType) => {
    router.push(`/account/${newType}/registration`)
  }

  return (
    <SignupPage accountType={accountType} onNext={handleNext} onAccountTypeChange={handleAccountTypeChange} />
  )
}
