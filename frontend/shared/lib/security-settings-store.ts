import { scopedStorageKey } from "@/src/shared/lib/storage-scope"

const BASE_KEY = "account_security_settings"

export interface SecuritySettings {
  twoFactorEnabled: boolean
  twoFactorMethod: string
  updatedAt: string
}

const DEFAULT: SecuritySettings = {
  twoFactorEnabled: false,
  twoFactorMethod: "",
  updatedAt: "",
}

function key(): string {
  return scopedStorageKey(BASE_KEY)
}

export function getSecuritySettings(): SecuritySettings {
  if (typeof window === "undefined") return DEFAULT
  try {
    const raw = localStorage.getItem(key())
    if (!raw) return DEFAULT
    return { ...DEFAULT, ...(JSON.parse(raw) as SecuritySettings) }
  } catch {
    return DEFAULT
  }
}

export function saveSecuritySettings(patch: Partial<SecuritySettings>): SecuritySettings {
  const next = {
    ...getSecuritySettings(),
    ...patch,
    updatedAt: new Date().toISOString(),
  }
  if (typeof window !== "undefined") {
    localStorage.setItem(key(), JSON.stringify(next))
  }
  return next
}
