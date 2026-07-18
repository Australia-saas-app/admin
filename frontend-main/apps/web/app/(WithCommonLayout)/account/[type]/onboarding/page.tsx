"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"

type AccountType = "user" | "affiliate" | "business"

/**
 * Pre-OTP onboarding is no longer part of signup.
 * Details are collected after verification via /{type}/complete-profile.
 */
export default function OnboardingPageRoute() {
  const params = useParams()
  const router = useRouter()
  const accountType = (params.type as AccountType) || "user"

  useEffect(() => {
    router.replace(`/account/${accountType}/registration`)
  }, [accountType, router])

  return (
    <div className="flex min-h-[40vh] items-center justify-center text-sm text-muted-foreground">
      Redirecting to registration…
    </div>
  )
}
