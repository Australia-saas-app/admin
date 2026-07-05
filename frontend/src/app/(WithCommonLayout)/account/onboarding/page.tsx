"use client"

import { useRouter } from "next/navigation"
import { OnboardingFlow } from "@/src/modules/account/components/onboarding-flow"


export default function OnboardingPageRoute() {
  const router = useRouter()

  const handleNext = () => {
    router.push(`/account/verification`)
  }

  return <OnboardingFlow  initialData={{}} onNext={handleNext} />
}
