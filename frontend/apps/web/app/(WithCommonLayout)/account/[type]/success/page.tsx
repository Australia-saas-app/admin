"use client"

import { useParams, useRouter, useSearchParams } from "next/navigation"
import { SuccessPage } from "@/src/modules/account/components/success-page"

type AccountType = "user" | "affiliate" | "business"

export default function SuccessPageRoute() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const accountType = (params.type as AccountType) || "user"
  const variant = searchParams.get("flow") === "reset" ? "password-reset" : "registration"

  const handleDone = () => {
    router.push(`/account/${accountType}/login`)
  }

  return <SuccessPage onDone={handleDone} variant={variant} />
}
