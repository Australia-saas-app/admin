export type UserRow = {
  id: string
  userId: string
  totalProject: number
  totalAmount: string
  paidAmount: string
  dueAmount: string
  refundAmount?: string
  profit?: string
  status: "ACTIVE" | "SUSPEND" | "DORMANT" | "CLOSED" | "BLOCK"
}

export const statusList = ["All", "ACTIVE", "SUSPEND", "DORMANT", "CLOSED", "BLOCK"] as const
