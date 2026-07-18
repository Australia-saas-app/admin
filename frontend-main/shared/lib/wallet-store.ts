import type { WithdrawRequestResult } from "@/src/modules/dashboard/shared/components/WithdrawRequestModal"
import { addAdminTransaction } from "./admin-transactions-store"

const WITHDRAWALS_KEY = "platform_wallet_withdrawals"

export interface WalletWithdrawalRecord extends WithdrawRequestResult {
  userId: string
  userName: string
  status: "Pending" | "Processing" | "Complete" | "Failed"
  methodType: string
}

function readWithdrawals(): WalletWithdrawalRecord[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(WITHDRAWALS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as WalletWithdrawalRecord[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeWithdrawals(records: WalletWithdrawalRecord[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(WITHDRAWALS_KEY, JSON.stringify(records))
}

export function getWithdrawalsForUser(userId: string): WalletWithdrawalRecord[] {
  return readWithdrawals().filter((r) => r.userId === userId)
}

export function submitWithdrawalRequest(input: {
  userId: string
  userName: string
  amount: number
  methodId: string
  methodLabel: string
  methodType: string
}): WalletWithdrawalRecord {
  const id = `WD-${Date.now().toString().slice(-6)}`
  const date = new Date().toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  })

  const record: WalletWithdrawalRecord = {
    id,
    amount: `$${input.amount.toFixed(2)} USD`,
    method: `${input.methodType} · ${input.methodLabel}`,
    date,
    userId: input.userId,
    userName: input.userName,
    status: "Pending",
    methodType: input.methodType,
  }

  writeWithdrawals([record, ...readWithdrawals()])

  addAdminTransaction({
    id,
    type: "Withdrawal",
    user: input.userName,
    amount: record.amount,
    method: record.method,
    status: "Pending",
    date,
  })

  return record
}

export function updateWithdrawalStatus(id: string, status: WalletWithdrawalRecord["status"]) {
  writeWithdrawals(
    readWithdrawals().map((r) => (r.id === id ? { ...r, status } : r))
  )
}
