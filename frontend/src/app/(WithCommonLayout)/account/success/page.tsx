"use client"

import { useRouter } from "next/navigation"
import { SuccessPage } from "@/src/modules/account/components/success-page"


export default function SuccessPageRoute() {
  const router = useRouter()

  const handleDone = () => {
    router.push(`/account/login`)
  }

  return <SuccessPage onDone={handleDone} />
}
