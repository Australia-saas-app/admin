const SIGNUP_DRAFT_KEY = "signup-draft"

export function saveSignupDraft(data: Record<string, unknown>) {
  if (typeof window === "undefined") return
  const existing = loadSignupDraft()
  sessionStorage.setItem(SIGNUP_DRAFT_KEY, JSON.stringify({ ...existing, ...data }))
}

export function loadSignupDraft(): Record<string, unknown> {
  if (typeof window === "undefined") return {}
  try {
    const raw = sessionStorage.getItem(SIGNUP_DRAFT_KEY)
    return raw ? (JSON.parse(raw) as Record<string, unknown>) : {}
  } catch {
    return {}
  }
}

export function clearSignupDraft() {
  if (typeof window === "undefined") return
  sessionStorage.removeItem(SIGNUP_DRAFT_KEY)
}

export function getSignupContactEmail(draft: Record<string, unknown>): string {
  const contact = draft.contact
  if (typeof contact === "string" && contact.trim()) return contact
  return ""
}
