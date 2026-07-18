/**
 * Shared helpers for public/backend fetch failures when the API is offline.
 */

export class BackendOfflineError extends Error {
  readonly code = "BACKEND_OFFLINE"

  constructor(message = "Backend unavailable") {
    super(message)
    this.name = "BackendOfflineError"
  }
}

export function isBackendOfflineError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false
  const err = error as {
    name?: string
    message?: string
    code?: string
    cause?: { code?: string; errors?: Array<{ code?: string }> }
  }

  if (err.name === "BackendOfflineError" || err.code === "BACKEND_OFFLINE") return true
  if (err.name === "TimeoutError" || err.name === "AbortError") return true

  const message = String(err.message ?? "").toLowerCase()
  if (
    message.includes("timeout") ||
    message.includes("aborted") ||
    message.includes("fetch failed") ||
    message.includes("network") ||
    message.includes("econnrefused") ||
    message.includes("enotfound") ||
    message.includes("backend unavailable") ||
    message.includes("backend offline")
  ) {
    return true
  }

  const causeCode = err.cause?.code
  if (causeCode === "ECONNREFUSED" || causeCode === "ENOTFOUND" || causeCode === "ETIMEDOUT") {
    return true
  }

  const nested = err.cause?.errors
  if (Array.isArray(nested) && nested.some((e) => e?.code === "ECONNREFUSED" || e?.code === "ENOTFOUND")) {
    return true
  }

  return false
}
