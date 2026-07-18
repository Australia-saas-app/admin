"use client"

import { useEffect, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import { VerificationPage } from "@/src/modules/account/components/verification-page"
import { completeDemoRegistration } from "@/src/server/AuthService"
import {
  clearSignupDraft,
  getSignupContactEmail,
  loadSignupDraft,
} from "@/src/constants/signup-session"

type AccountType = "user" | "affiliate" | "business"

export default function VerificationPageRoute() {
  const params = useParams()
  const router = useRouter()
  const accountType = (params.type as AccountType) || "user"
  const draft = useMemo(() => loadSignupDraft(), [])
  const email = getSignupContactEmail(draft)

  useEffect(() => {
    if (!draft.contact || !draft.password) {
      router.replace(`/account/${accountType}/registration`)
    }
  }, [accountType, draft.contact, draft.password, router])

  const handleSuccess = async () => {
    const signupData = loadSignupDraft()
    if (!signupData.contact || !signupData.password) {
      throw new Error("Signup data is missing. Please start registration again.")
    }

    await completeDemoRegistration({
      ...signupData,
      accountType: signupData.accountType ?? accountType,
    })

    clearSignupDraft()
    toast.success("Account verified. Complete your profile to unlock work features.")
    router.push(`/${accountType}/complete-profile`)
  }

  return <VerificationPage email={email} onSuccess={handleSuccess} />
}
