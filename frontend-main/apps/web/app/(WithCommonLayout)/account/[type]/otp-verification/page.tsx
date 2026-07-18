"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"

type AccountType = "user" | "affiliate" | "business"

export default function OtpVerificationRedirectPage() {
  const params = useParams()
  const router = useRouter()
  const accountType = (params.type as AccountType) || "user"

  useEffect(() => {
    router.replace(`/account/${accountType}/verification`)
  }, [accountType, router])

  return null
}
