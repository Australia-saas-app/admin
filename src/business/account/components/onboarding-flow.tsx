"use client"

import { useState } from "react"
import { PersonalInfoStep } from "@/src/business/account/components/personal-info-step"
import { AffiliateInfoStep } from "@/src/business/account/components/affiliate-info-step"
import { IdentityVerificationStep } from "@/src/business/account/components/identity-verification-step"
import { StepIndicator } from "@/src/business/account/components/step-indicator"

interface OnboardingFlowProps {
  initialData?: any
  onNext: (data: any) => void
}

export function OnboardingFlow({ initialData = {}, onNext }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState(initialData)

  const steps = [
    {
      title: "Personal Information",
      component: PersonalInfoStep,
    },
    {
      title: "Affiliate Information",
      component: AffiliateInfoStep,
    },
    {
      title: "Identity verification",
      component: IdentityVerificationStep,
    },
  ]

  const CurrentStep = steps[currentStep].component

  const handleNext = (stepData: any) => {
    const newData = { ...formData, ...stepData }
    setFormData(newData)

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onNext(newData)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
     <div className="w-full space-y-6">
        <StepIndicator steps={steps.map((s) => s.title)} currentStep={currentStep} />
        <CurrentStep
          onNext={handleNext}
          onBack={handleBack}
          initialData={formData}
          accountType={formData.accountType || ""}
          isLastStep={currentStep === steps.length - 1}
        />
      </div>
  )
}
