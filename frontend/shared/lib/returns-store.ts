/**
 * Order returns / refunds workflow (Figma: Return, return methods, pending returns).
 */

const RETURNS_KEY = "platform_order_returns"

export type ReturnStatus =
  | "Pending"
  | "Accepted"
  | "Ineligible"
  | "Sending"
  | "Completed"
  | "Rejected"

export type ReturnMethod = "Pickup" | "Drop-off" | "Mail" | "Wallet credit"

export interface OrderReturnRecord {
  id: string
  userId: string
  userName: string
  orderId: string
  amount: string
  method: ReturnMethod
  reason: string
  status: ReturnStatus
  date: string
}

function readAll(): OrderReturnRecord[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(RETURNS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as OrderReturnRecord[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeAll(records: OrderReturnRecord[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(RETURNS_KEY, JSON.stringify(records))
}

export function getReturnsForUser(userId: string): OrderReturnRecord[] {
  return readAll().filter((r) => r.userId === userId)
}

export function getAllReturns(): OrderReturnRecord[] {
  return readAll()
}

export function submitOrderReturn(input: {
  userId: string
  userName: string
  orderId: string
  amount: number
  method: ReturnMethod
  reason: string
}): OrderReturnRecord {
  const record: OrderReturnRecord = {
    id: `RT-${Date.now().toString().slice(-6)}`,
    userId: input.userId,
    userName: input.userName,
    orderId: input.orderId,
    amount: `$${input.amount.toFixed(2)} USD`,
    method: input.method,
    reason: input.reason,
    status: "Pending",
    date: new Date().toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }),
  }
  writeAll([record, ...readAll()])
  return record
}

export function updateReturnStatus(id: string, status: ReturnStatus) {
  writeAll(readAll().map((r) => (r.id === id ? { ...r, status } : r)))
}

export const DEMO_RETURNS: Omit<OrderReturnRecord, "userId" | "userName">[] = [
  {
    id: "RT-50401",
    orderId: "#504",
    amount: "$120.00 USD",
    method: "Pickup",
    reason: "Damaged item",
    status: "Pending",
    date: "03/10/2026, 11:00 AM",
  },
  {
    id: "RT-50388",
    orderId: "#df355",
    amount: "$45.00 USD",
    method: "Wallet credit",
    reason: "Wrong size",
    status: "Completed",
    date: "02/18/2026, 03:22 PM",
  },
  {
    id: "RT-50210",
    orderId: "#0Y0s1",
    amount: "$30.00 USD",
    method: "Mail",
    reason: "Not as described",
    status: "Ineligible",
    date: "02/01/2026, 08:10 AM",
  },
]
