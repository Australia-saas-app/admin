"use client"

import { useCallback } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useUser } from "@/src/context/user.provider"

export function useRequireAuth() {
  const { user, isLoading } = useUser()
  const router = useRouter()
  const pathname = usePathname()

  const loginUrl = `/account/user/login?redirect=${encodeURIComponent(pathname)}`

  const requireAuth = useCallback(
    (action: () => void) => {
      if (isLoading) return false
      if (!user) {
        router.push(loginUrl)
        return false
      }
      action()
      return true
    },
    [isLoading, user, router, loginUrl]
  )

  return {
    user,
    isLoading,
    isAuthenticated: Boolean(user),
    loginUrl,
    requireAuth,
  }
}
