export type AffiliateRow = {
  id: string
  affiliateId: string
  industryType?: string
  totalCustomer: number
  referrals: number
  commissionRate: string
  earningsAmount: string
  level?: number
  status: "ACTIVE" | "SUSPEND" | "DORMANT" | "CLOSED" | "BLOCK"
}

export const affiliateStatusList = ["All", "ACTIVE", "SUSPEND", "DORMANT", "CLOSED", "BLOCK"] as const
