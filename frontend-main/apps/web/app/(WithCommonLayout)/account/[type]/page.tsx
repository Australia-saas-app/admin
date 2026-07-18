"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { SignupPage } from "@/src/modules/account/components/signup-page"
import { OnboardingFlow } from "@/src/modules/account/components/onboarding-flow"
import { VerificationPage } from "@/src/modules/account/components/verification-page"
import { SuccessPage } from "@/src/modules/account/components/success-page"
import { ForgotPasswordPage } from "@/src/modules/account/components/forgot-password-page"
import { ForgotPasswordVerifyPage } from "@/src/modules/account/components/forgot-password-verify-page"
import { ResetPasswordPage } from "@/src/modules/account/components/reset-password-page"
import { LoginPage } from "@/src/modules/account/components/login-page"

type PageType =
  | "login"
  | "signup"
  | "onboarding"
  | "verification"
  | "success"
  | "forgot-password"
  | "forgot-verify"
  | "reset-password"

export default function Home() {
  const [currentPage, setCurrentPage] = useState<PageType>("login")
  const [accountType, setAccountType] = useState<"user" | "affiliate" | "business">("user")
  const [formData, setFormData] = useState({})
  const [forgotEmail, setForgotEmail] = useState("")
  const router = useRouter()

  useEffect(() => {
    router.replace("/account/user/login")
  }, [router])

  const handlePageChange = (page: PageType, data?: any) => {
    if (data) setFormData((prev) => ({ ...prev, ...data }))
    setCurrentPage(page)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background">
      {currentPage === "login" && (
        <LoginPage
          onSignup={() => handlePageChange("signup")}
          onAccountTypeChange={setAccountType}
          onForgotPassword={() => handlePageChange("forgot-password")}
        />
      )}
      {currentPage === "signup" && (
        <SignupPage accountType={accountType} onNext={(data) => handlePageChange("onboarding", data)} />
      )}
      {currentPage === "onboarding" && (
        <OnboardingFlow
          accountType={accountType}
          initialData={formData}
          onNext={(data) => handlePageChange("verification", data)}
        />
      )}
      {currentPage === "verification" && <VerificationPage onSuccess={() => handlePageChange("success")} />}
      {currentPage === "success" && <SuccessPage onDone={() => handlePageChange("login")} />}
      {currentPage === "forgot-password" && (
        <ForgotPasswordPage
          onNext={(email) => {
            setForgotEmail(email)
            handlePageChange("forgot-verify")
          }}
          onBackToLogin={() => handlePageChange("login")}
        />
      )}
      {currentPage === "forgot-verify" && (
        <ForgotPasswordVerifyPage
          email={forgotEmail}
          onSuccess={() => handlePageChange("reset-password")}
          onBackToLogin={() => handlePageChange("login")}
        />
      )}
      {currentPage === "reset-password" && <ResetPasswordPage onSuccess={() => handlePageChange("success")} />}
    </div>
  )
}
