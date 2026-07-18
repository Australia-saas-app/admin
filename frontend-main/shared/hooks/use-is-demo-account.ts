"use client"

import { useUser } from "@/src/context/user.provider"
import {
  demoOrEmpty,
  getUserIdFromAuthUser,
  isDemoAuthUser,
} from "@/src/shared/lib/demo-user"

export function useIsDemoAccount() {
  const { user, isLoading } = useUser()
  const userId = getUserIdFromAuthUser(user)
  const isDemo = !isLoading && isDemoAuthUser(user)

  return {
    userId,
    user,
    isDemo,
    isLoading,
    isReady: !isLoading,
    demoOrEmpty: <T,>(demoValue: T, emptyValue: T) =>
      isLoading ? emptyValue : demoOrEmpty(user, demoValue, emptyValue),
  }
}
