"use client"

import { useState } from "react"
import { PersonalInfoStep } from "@/src/modules/account/components/personal-info-step"
import { AffiliateInfoStep } from "@/src/modules/account/components/affiliate-info-step"
import { IdentityVerificationStep } from "@/src/modules/account/components/identity-verification-step"
import { BusinessInfoStep1 } from "@/src/modules/account/components/business-info-step-1"
import { BusinessInfoStep2 } from "@/src/modules/account/components/business-info-step-2"
import { BusinessInfoStep3 } from "@/src/modules/account/components/business-info-step-3"
import { StepIndicator } from "@/src/modules/account/components/step-indicator"
import { RegistrationLoadingOverlay } from "@/src/modules/account/components/registration-loading-overlay"
import { AuthShell } from "@/src/modules/account/components/auth-shell"

interface OnboardingFlowProps {
  accountType: "user" | "affiliate" | "business"
  initialData?: Record<string, unknown>
  onNext: (data: Record<string, unknown>) => void | Promise<void>
  /** Post-login mandatory profile wizard vs legacy pre-OTP path */
  mode?: "signup" | "complete-profile"
  /** Render inside dashboard without the auth marketing shell */
  embedded?: boolean
}

const SHELL_COPY: Record<
  OnboardingFlowProps["accountType"],
  { title: string; subtitle: string; completeTitle: string; completeSubtitle: string }
> = {
  user: {
    title: "Complete your profile",
    subtitle: "Tell us about yourself so we can personalize your dashboard and verify your identity.",
    completeTitle: "Finish your profile",
    completeSubtitle:
      "Add the required personal details and identity documents. Work features stay locked until this is done.",
  },
  affiliate: {
    title: "Affiliate onboarding",
    subtitle: "Share your details and affiliate information to activate your partner account.",
    completeTitle: "Complete your affiliate profile",
    completeSubtitle:
      "Add personal and affiliate defaults required to promote offers. You can refine these anytime from Profile.",
  },
  business: {
    title: "Business onboarding",
    subtitle: "Register your company profile, services, and verification documents.",
    completeTitle: "Complete your business profile",
    completeSubtitle:
      "Add company, contact, and document details. Operations unlock after your profile is submitted for review.",
  },
}

export function OnboardingFlow({
  accountType,
  initialData = {},
  onNext,
  mode = "complete-profile",
  embedded = false,
}: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState(initialData)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const steps =
    accountType === "business"
      ? [
          { title: "Personal Information", component: PersonalInfoStep },
          { title: "Business Details", component: BusinessInfoStep1 },
          { title: "Contact & Location", component: BusinessInfoStep2 },
          { title: "Services & Docs", component: BusinessInfoStep3 },
          { title: "Identity Verification", component: IdentityVerificationStep },
        ]
      : accountType === "affiliate"
        ? [
            { title: "Personal Information", component: PersonalInfoStep },
            { title: "Affiliate Information", component: AffiliateInfoStep },
            { title: "Identity Verification", component: IdentityVerificationStep },
          ]
        : [
            { title: "Personal Information", component: PersonalInfoStep },
            { title: "Identity Verification", component: IdentityVerificationStep },
          ]

  const CurrentStep = steps[currentStep].component
  const shellSource = SHELL_COPY[accountType]
  const shell =
    mode === "complete-profile"
      ? { title: shellSource.completeTitle, subtitle: shellSource.completeSubtitle }
      : { title: shellSource.title, subtitle: shellSource.subtitle }
  const badge = mode === "complete-profile" ? "Profile required" : "Registration"

  const handleNext = async (stepData: Record<string, unknown>) => {
    const newData = { ...formData, ...stepData }
    setFormData(newData)

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
      return
    }

    setIsSubmitting(true)
    try {
      await Promise.resolve(onNext(newData))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1)
  }

  const body = (
    <div className="relative space-y-6">
      {isSubmitting && <RegistrationLoadingOverlay label="Saving your details..." />}
      {embedded && (
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-foreground">{shell.title}</h2>
          <p className="text-sm text-muted-foreground">{shell.subtitle}</p>
        </div>
      )}
      <StepIndicator steps={steps.map((s) => s.title)} currentStep={currentStep} />
      <CurrentStep
        onNext={handleNext}
        onBack={handleBack}
        initialData={formData}
        accountType={accountType}
        isLastStep={currentStep === steps.length - 1}
        showBack={currentStep > 0}
      />
    </div>
  )

  if (embedded) {
    return (
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm md:p-6">{body}</div>
    )
  }

  return (
    <AuthShell title={shell.title} subtitle={shell.subtitle} badge={badge} wide>
      {body}
    </AuthShell>
  )
}
