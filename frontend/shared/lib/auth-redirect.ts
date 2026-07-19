/**
 * Validates post-login redirect paths (same-origin relative only).
 */
export function isSafeRedirect(path: string | null | undefined): path is string {
  if (!path || !path.startsWith("/")) return false
  if (path.startsWith("//")) return false
  if (path.includes("://")) return false
  return true
}

export function resolvePostLoginRedirect(redirectUrl: string | null | undefined, roleDashboard: string): string {
  if (isSafeRedirect(redirectUrl)) return redirectUrl
  return roleDashboard
}
