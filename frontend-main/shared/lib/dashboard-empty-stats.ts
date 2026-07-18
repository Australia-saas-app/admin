import { AFFILIATE_STATS } from "@/src/modules/dashboard/affiliate/data/affiliate-demo-data"
import { BUSINESS_STATS } from "@/src/modules/dashboard/business/data/business-demo-data"

export const EMPTY_AFFILIATE_STATS = {
  totalReferrals: 0,
  activeReferrals: 0,
  conversionRate: "0%",
  totalCommission: "$0",
  totalWithdrawn: "$0",
  currentBalance: "$0",
  pendingPayout: "$0",
  currentRank: 0,
  commissionRate: "0%",
  levelProgress: 0,
  currentLevel: 0,
  unreadNotices: 0,
  unreadMessages: 0,
} as unknown as typeof AFFILIATE_STATS

export const EMPTY_BUSINESS_STATS = {
  totalProjects: 0,
  pendingProjects: 0,
  successfulProjects: 0,
  totalCommission: "$0",
  totalWithdrawn: "$0",
  currentBalance: "$0",
  activeServices: 0,
  monthlyRevenue: "$0",
  unreadNotices: 0,
  unreadMessages: 0,
  activeClients: 0,
} as unknown as typeof BUSINESS_STATS

export function affiliateStatsForDemo(isDemo: boolean) {
  return isDemo ? AFFILIATE_STATS : EMPTY_AFFILIATE_STATS
}

export function businessStatsForDemo(isDemo: boolean) {
  return isDemo ? BUSINESS_STATS : EMPTY_BUSINESS_STATS
}
