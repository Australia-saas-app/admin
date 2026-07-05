"use client"

import {  useRouter } from "next/navigation"
import { VerificationPage } from "@/src/modules/account/components/verification-page"


export default function VerificationPageRoute() {
  const router = useRouter()

  const handleSuccess = () => {
    router.push(`/account/success`)
  }

  return <VerificationPage onSuccess={handleSuccess} />
}
