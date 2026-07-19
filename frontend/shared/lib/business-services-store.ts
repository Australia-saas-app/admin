import {
  BUSINESS_SERVICE_ROWS,
  type BusinessServiceRow,
  type ServiceStatus,
} from "@/src/modules/dashboard/business/data/business-demo-data"
import { isDemoAccountUserId } from "@/src/shared/lib/demo-user"
import { getStorageUserScope, scopedStorageKey } from "@/src/shared/lib/storage-scope"

const STORAGE_BASE = "business_service_rows"

function storageKey(): string {
  return scopedStorageKey(STORAGE_BASE)
}

function readAll(): BusinessServiceRow[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(storageKey())
    if (!raw) return []
    const parsed = JSON.parse(raw) as BusinessServiceRow[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeAll(rows: BusinessServiceRow[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(storageKey(), JSON.stringify(rows))
}

function seedDemoIfNeeded(): BusinessServiceRow[] {
  const scope = getStorageUserScope()
  if (!isDemoAccountUserId(scope)) return []
  const demoRows = [...BUSINESS_SERVICE_ROWS]
  writeAll(demoRows)
  return demoRows
}

export function getBusinessServices(): BusinessServiceRow[] {
  const existing = readAll()
  if (existing.length > 0) return existing
  return seedDemoIfNeeded()
}

export function addBusinessService(row: BusinessServiceRow) {
  writeAll([row, ...readAll()])
}

export function updateBusinessService(id: string, updates: Partial<BusinessServiceRow>) {
  writeAll(readAll().map((r) => (r.id === id ? { ...r, ...updates } : r)))
}

export function formatDeadlineDisplay(isoDate: string): string {
  if (!isoDate) return ""
  const d = new Date(isoDate)
  if (Number.isNaN(d.getTime())) return isoDate
  return d.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })
}

export function serviceStatsFromRows(rows: BusinessServiceRow[]) {
  return {
    active: rows.filter((r) => r.status === "Active").length,
    pending: rows.filter((r) => r.status === "Pending").length,
    completed: rows.filter((r) => r.status === "Completed").length,
  }
}

export type { BusinessServiceRow, ServiceStatus }
