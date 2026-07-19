const SIGNUP_DRAFT_KEY = "signup-draft"

export function saveSignupDraft(accountType: string, data: Record<string, unknown>) {
  if (typeof window === "undefined") return
  const existing = loadSignupDraft(accountType)
  sessionStorage.setItem(`${SIGNUP_DRAFT_KEY}-${accountType}`, JSON.stringify({ ...existing, ...data }))
}

export function loadSignupDraft(accountType: string): Record<string, unknown> {
  if (typeof window === "undefined") return {}
  try {
    const raw = sessionStorage.getItem(`${SIGNUP_DRAFT_KEY}-${accountType}`)
    return raw ? (JSON.parse(raw) as Record<string, unknown>) : {}
  } catch {
    return {}
  }
}

export function clearSignupDraft(accountType: string) {
  if (typeof window === "undefined") return
  sessionStorage.removeItem(`${SIGNUP_DRAFT_KEY}-${accountType}`)
}

export function getSignupContactEmail(draft: Record<string, unknown>): string {
  const contact = draft.contact
  if (typeof contact === "string" && contact.trim()) return contact
  return ""
}
