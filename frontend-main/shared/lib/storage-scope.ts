let activeUserId = "anonymous"

export function setStorageUserScope(userId?: string | null) {
  activeUserId = userId?.trim() || "anonymous"
}

export function getStorageUserScope(): string {
  return activeUserId
}

export function scopedStorageKey(baseKey: string): string {
  return `${baseKey}:${activeUserId}`
}
