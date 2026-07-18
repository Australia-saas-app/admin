import { scopedStorageKey } from "@/src/shared/lib/storage-scope"

const BASE_KEY = "account_deletion_request"

export interface AccountDeletionRequest {
  userId: string
  email: string
  requestedAt: string
  status: "pending" | "completed"
}

function key(): string {
  return scopedStorageKey(BASE_KEY)
}

export function getDeletionRequest(): AccountDeletionRequest | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(key())
    if (!raw) return null
    return JSON.parse(raw) as AccountDeletionRequest
  } catch {
    return null
  }
}

export function scheduleAccountDeletion(input: { userId: string; email: string }): AccountDeletionRequest {
  const request: AccountDeletionRequest = {
    userId: input.userId,
    email: input.email,
    requestedAt: new Date().toISOString(),
    status: "pending",
  }
  if (typeof window !== "undefined") {
    localStorage.setItem(key(), JSON.stringify(request))
  }
  return request
}
