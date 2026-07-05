"use client"

import { useRouter } from "next/navigation"
import { ForgotPasswordPage } from "@/src/modules/account/components/forgot-password-page"



export default function ForgotPasswordPageRoute() {
  const router = useRouter()


  const handleNext = (email: string) => {
    const encodedEmail = btoa(email)
    router.push(`/account/forgot-password-verify?email=${encodedEmail}`)
  }

  const handleBackToLogin = () => {
    router.push(`/account/login`)
  }

  return <ForgotPasswordPage onNext={handleNext} onBackToLogin={handleBackToLogin} />
}
