"use client"

import { useMemo, useState } from "react"
import { useUser } from "@/src/context/user.provider"
import {
  getProfileOverrides,
  saveProfileOverrides,
  type ProfileField,
} from "@/src/shared/utils/profile-storage"
import { getUserIdFromAuthUser, isDemoAuthUser, getDisplayUserId } from "@/src/shared/lib/demo-user"

function displayName(user: { firstName?: string; lastName?: string; name?: string; email?: string } | null) {
  if (!user) return "Account"
  if ("firstName" in user && user.firstName) {
    return `${user.firstName} ${user.lastName ?? ""}`.trim()
  }
  if ("name" in user && user.name) return user.name
  return user.email?.split("@")[0] ?? "Account"
}

export function useProfileDisplay() {
  const { user } = useUser()
  const userId = getUserIdFromAuthUser(user) ?? "guest"
  const isDemo = isDemoAuthUser(user)
  const [revision, setRevision] = useState(0)

  const overrides = useMemo(() => getProfileOverrides(userId), [userId, revision])

  const accountLabel = overrides.accountLabel ?? displayName(user)
  const email =
    overrides.email ??
    (user && "email" in user && user.email ? user.email : isDemo ? "user@demo.com" : "")
  const phone =
    overrides.phone ??
    (user && "mobileNumber" in user && user.mobileNumber
      ? user.mobileNumber
      : isDemo
        ? "+1 (555) 123-4567"
        : "")

  const joiningDate =
    overrides.joiningDate ??
    (user && "createdAt" in user && user.createdAt
      ? new Date(user.createdAt).toLocaleString()
      : isDemo
        ? new Date().toLocaleString()
        : "—")

  const avatarUrl =
    overrides.avatarUrl ??
    (user && "profilePhoto" in user && user.profilePhoto
      ? user.profilePhoto
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(accountLabel)}&background=58719b&color=fff`)

  const fields: ProfileField[] = useMemo(
    () => [
      { label: "Full Name", value: overrides.fullName ?? accountLabel },
      {
        label: "Nationality",
        value:
          overrides.nationality ??
          (user && "country" in user && user.country ? user.country : isDemo ? "United States" : "—"),
      },
      { label: "Date of Birth", value: overrides.dateOfBirth ?? (isDemo ? "02 Jun 2003" : "—") },
      {
        label: "National Identity",
        value: overrides.nationalIdentity ?? (isDemo ? "••••••••••••554" : "—"),
      },
      { label: "Phone Number", value: phone || "—" },
      { label: "Secondary Email", value: overrides.secondaryEmail ?? (email || "—") },
      { label: "Email Address", value: email || "—" },
      {
        label: "Preferred Currency",
        value: overrides.currency ?? (isDemo ? "United States US Dollar" : "—"),
      },
    ],
    [accountLabel, email, isDemo, overrides, phone, user]
  )

  const updateProfile = (patch: Record<string, string>) => {
    saveProfileOverrides(userId, patch)
    setRevision((n) => n + 1)
  }

  return {
    userId: getDisplayUserId(user),
    accountLabel,
    email,
    phone,
    joiningDate,
    avatarUrl,
    fields,
    updateProfile,
    isDemo,
  }
}
