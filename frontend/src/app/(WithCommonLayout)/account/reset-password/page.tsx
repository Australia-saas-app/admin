"use client"

import { useRouter } from "next/navigation"
import { ResetPasswordPage } from "@/src/modules/account/components/reset-password-page"


export default function ResetPasswordPageRoute() {
  const router = useRouter()

  const handleSuccess = () => {
    router.push(`/account/success`)
  }

  return <ResetPasswordPage onSuccess={handleSuccess} />
}
