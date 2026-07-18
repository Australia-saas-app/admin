/** Normalize email or phone for consistent lookup. */
export function normalizeContact(value: string): string {
  const trimmed = value.trim()
  if (trimmed.includes("@")) {
    return trimmed.toLowerCase()
  }
  return trimmed.replace(/\D/g, "")
}

export function isEmailContact(value: string): boolean {
  return value.includes("@")
}
