import type { DetailField } from "../components/RecordDetailDrawer"
import type { WithdrawRow } from "../data/dashboard-demo-data"

export function withdrawDetailFields(row: WithdrawRow): DetailField[] {
  return [
    { label: "Transaction ID", value: row.id },
    { label: "Payout Method", value: row.method },
    { label: "Amount", value: row.amount },
    { label: "Date & Time", value: row.date },
    { label: "Status", value: row.status },
  ]
}
