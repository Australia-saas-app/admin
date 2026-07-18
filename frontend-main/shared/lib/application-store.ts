export type ApplicationType = "job" | "technical" | "service"

export type ApplicationStatus = "submitted" | "reviewing" | "approved" | "rejected"

export interface ApplicationRecord {
  id: string
  type: ApplicationType
  itemId: string
  itemTitle: string
  coverLetter: string
  userId: string
  userEmail: string
  status: ApplicationStatus
  createdAt: string
  updatedAt?: string
  adminNote?: string
}

const STORAGE_KEY = "platform_applications"

function readAll(): ApplicationRecord[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as ApplicationRecord[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeAll(records: ApplicationRecord[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
}

export function getAllApplications(): ApplicationRecord[] {
  return readAll()
}

export function getApplicationsForUser(userId: string): ApplicationRecord[] {
  return readAll().filter((r) => r.userId === userId)
}

export function hasApplied(userId: string, type: ApplicationType, itemId: string): boolean {
  return readAll().some((r) => r.userId === userId && r.type === type && r.itemId === itemId)
}

export function submitApplication(input: {
  type: ApplicationType
  itemId: string
  itemTitle: string
  coverLetter: string
  userId: string
  userEmail: string
}): ApplicationRecord {
  const record: ApplicationRecord = {
    id: `APP-${Date.now().toString(36).toUpperCase()}`,
    type: input.type,
    itemId: input.itemId,
    itemTitle: input.itemTitle,
    coverLetter: input.coverLetter,
    userId: input.userId,
    userEmail: input.userEmail,
    status: "submitted",
    createdAt: new Date().toISOString(),
  }
  writeAll([record, ...readAll()])
  return record
}

export function updateApplicationStatus(
  id: string,
  status: ApplicationStatus,
  adminNote?: string
): ApplicationRecord | undefined {
  let updated: ApplicationRecord | undefined
  const next = readAll().map((record) => {
    if (record.id !== id) return record
    updated = {
      ...record,
      status,
      adminNote: adminNote ?? record.adminNote,
      updatedAt: new Date().toISOString(),
    }
    return updated
  })
  if (!updated) return undefined
  writeAll(next)
  return updated
}
