"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

interface LoadingScreenProps {
  title?: string;
  subtitle?: string;
  destination?: string;
}

export function LoadingScreen({ 
  title = "Authenticating", 
  subtitle = "Establishing secure connection...",
  destination = "/dashboard"
}: LoadingScreenProps) {
  const router = useRouter()

  useEffect(() => {
    // Navigate immediately - no artificial delay
    if (destination) {
      router.push(destination)
    }
  }, [router, destination])

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] w-full">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 mb-6 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">{title}</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm">{subtitle}</p>
      </div>
    </div>
  )
}
