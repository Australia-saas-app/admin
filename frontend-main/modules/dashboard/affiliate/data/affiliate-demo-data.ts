export const AFFILIATE_STATS = {
  totalReferrals: 48,
  activeReferrals: 12,
  conversionRate: "24.5%",
  totalCommission: "$1,250",
  totalWithdrawn: "$980",
  currentBalance: "$270",
  pendingPayout: "$45",
  currentRank: 654,
  commissionRate: "1.5%",
  levelProgress: 85.71,
  currentLevel: 5,
  unreadNotices: 2,
  unreadMessages: 4,
} as const

export const AFFILIATE_LEVELS = ["Level 1", "Level 2", "Level 3", "Level 4", "Level 5", "Level 6"] as const

export interface AffiliateActivityItem {
  action: string
  category: string
  date: string
}

export const AFFILIATE_RECENT_ACTIVITY: AffiliateActivityItem[] = [
  { action: "New referral signup — Priya Sharma", category: "Referrals", date: "03 Feb 2025" },
  { action: "Commission earned — Real Estate referral", category: "Earnings", date: "02 Feb 2025" },
  { action: "Withdrawal processed — $50 USD", category: "Wallet", date: "01 Feb 2025" },
  { action: "Level 5 milestone reached", category: "Rank", date: "30 Jan 2025" },
  { action: "Referral link clicked 142 times", category: "Promotions", date: "28 Jan 2025" },
  { action: "Technical project commission — $8 USD", category: "Technical", date: "25 Jan 2025" },
]

export interface AffiliateReferral {
  id: string
  name: string
  email: string
  service: string
  commission: string
  status: string
  date: string
}

export const AFFILIATE_REFERRALS: AffiliateReferral[] = [
  { id: "REF-048", name: "Priya Sharma", email: "priya@demo.com", service: "Courses", commission: "$12", status: "Active", date: "2025/02/03" },
  { id: "REF-047", name: "Alex Rivera", email: "alex@demo.com", service: "Marketplace", commission: "$8", status: "Converted", date: "2025/01/28" },
  { id: "REF-046", name: "Global Tech Ltd", email: "business@demo.com", service: "Business", commission: "$45", status: "Active", date: "2025/01/25" },
  { id: "REF-045", name: "Maria Santos", email: "maria@demo.com", service: "Real Estate", commission: "$22", status: "Converted", date: "2025/01/22" },
  { id: "REF-044", name: "James Wilson", email: "james@demo.com", service: "Technical", commission: "$15", status: "Pending", date: "2025/01/18" },
  { id: "REF-043", name: "Yuki Tanaka", email: "yuki@demo.com", service: "Courses", commission: "$10", status: "Active", date: "2025/01/15" },
  { id: "REF-042", name: "Emma Brown", email: "emma@demo.com", service: "Transport", commission: "$5", status: "Converted", date: "2025/01/10" },
  { id: "REF-041", name: "Carlos Mendez", email: "carlos@demo.com", service: "Visa", commission: "$18", status: "Active", date: "2025/01/05" },
]

export interface AffiliateNotice {
  id: string
  title: string
  category: string
  read: boolean
  date: string
}

export const AFFILIATE_NOTICES: AffiliateNotice[] = [
  { id: "AN-001", title: "New commission structure effective March 1", category: "Policy", read: false, date: "2025/02/03" },
  { id: "AN-002", title: "Level 6 requirements updated", category: "Rank", read: false, date: "2025/02/01" },
  { id: "AN-003", title: "Your withdrawal has been processed", category: "Wallet", read: true, date: "2025/01/30" },
  { id: "AN-004", title: "Top affiliate bonus program — Q1 2025", category: "Promotions", read: true, date: "2025/01/25" },
  { id: "AN-005", title: "Referral link analytics now available", category: "Feature", read: true, date: "2025/01/20" },
]

export interface AffiliatePromotion {
  id: string
  title: string
  link: string
  clicks: number
  conversions: number
  commission: string
  status: string
}

export const AFFILIATE_PROMOTIONS: AffiliatePromotion[] = [
  { id: "PROMO-01", title: "Courses — React Mastery", link: "/courses?ref=AFF001", clicks: 342, conversions: 18, commission: "$180", status: "Active" },
  { id: "PROMO-02", title: "Marketplace — Electronics", link: "/marketplace?ref=AFF001", clicks: 218, conversions: 12, commission: "$96", status: "Active" },
  { id: "PROMO-03", title: "Real Estate — Premium Listings", link: "/real-estate?ref=AFF001", clicks: 156, conversions: 5, commission: "$110", status: "Active" },
  { id: "PROMO-04", title: "Technical Projects", link: "/technical?ref=AFF001", clicks: 89, conversions: 3, commission: "$24", status: "Active" },
  { id: "PROMO-05", title: "Visa Processing Services", link: "/visa?ref=AFF001", clicks: 64, conversions: 2, commission: "$36", status: "Paused" },
]

export interface AffiliateMessage {
  id: string
  from: string
  subject: string
  body: string
  category: string
  unread: boolean
  date: string
}

export const AFFILIATE_MESSAGES: AffiliateMessage[] = [
  { id: "AMSG-01", from: "Affiliate Manager", subject: "Congratulations on reaching Level 5!", body: "Congratulations on your recent performance! Your commission rate may be eligible for an upgrade at the next review cycle. Keep promoting high-converting services to maximize earnings.", category: "Rank", unread: true, date: "2025/02/03" },
  { id: "AMSG-02", from: "Payout Team", subject: "Withdrawal request approved — $50", body: "Your withdrawal of $50 USD has been approved and will be sent to your registered PayPal account within 1–3 business days.", category: "Wallet", unread: true, date: "2025/02/02" },
  { id: "AMSG-03", from: "Marketing Team", subject: "New promotional banners available", body: "Fresh banner creatives for Q1 campaigns are now available in the Promotions section. Download sizes optimized for social, email, and web placements.", category: "Promotions", unread: false, date: "2025/01/30" },
  { id: "AMSG-04", from: "Support", subject: "Referral tracking issue resolved", body: "The referral attribution delay affecting signups from January 20–22 has been resolved. Commissions for affected referrals will be credited automatically.", category: "Support", unread: true, date: "2025/01/28" },
  { id: "AMSG-05", from: "System", subject: "Monthly commission report ready", body: "Your January commission report is ready for download. Total earned: $142.50 across 8 converted referrals.", category: "Earnings", unread: false, date: "2025/01/25" },
  { id: "AMSG-06", from: "Affiliate Manager", subject: "Q1 bonus program details", body: "Earn an extra 0.5% commission on all Real Estate referrals through March 31. See the promotions page for terms and qualifying services.", category: "Promotions", unread: true, date: "2025/01/22" },
]

export const AFFILIATE_LOG_ENTRIES = [
  { action: "Referral link created — Courses / React Mastery", date: "2025/02/03 10:15" },
  { action: "Commission earned — Real Estate ($22)", date: "2025/02/02 14:30" },
  { action: "Level 5 milestone reached", date: "2025/01/30 09:00" },
  { action: "Withdrawal completed — $50 USD", date: "2025/01/28 16:45" },
  { action: "New referral signup — Priya Sharma", date: "2025/01/25 11:20" },
  { action: "Promotion link clicked 142 times", date: "2025/01/22 08:30" },
  { action: "Rank updated to #654", date: "2025/01/18 13:40" },
  { action: "Commission earned — Technical project ($8)", date: "2025/01/15 17:55" },
]

export const AFFILIATE_SERVICE_SHORTCUTS = [
  { label: "Technical", href: "/technical", desc: "Refer tech projects" },
  { label: "Marketplace", href: "/marketplace", desc: "Product referrals" },
  { label: "Courses", href: "/courses", desc: "Course commissions" },
  { label: "Real Estate", href: "/real-estate", desc: "Property referrals" },
  { label: "Careers", href: "/careers", desc: "Job referrals" },
  { label: "Gallery", href: "/gallery", desc: "Media & events" },
] as const

/** AffiliaPro affiliate dashboard metrics & widgets */
export type AffiliateKpiIcon = "clicks" | "referrals" | "conversions" | "earnings" | "pending"
export type AffiliateActivityTone = "emerald" | "sky" | "amber" | "violet"
export type AffiliateQuickIcon = "link" | "banners" | "reports" | "payments"

export interface AffiliateKpiItem {
  id: string
  label: string
  value: string
  change: string
  positive: boolean
  pending?: boolean
  icon: AffiliateKpiIcon
  iconBg: string
}

export const AFFILIATE_KPI: AffiliateKpiItem[] = [
  {
    id: "clicks",
    label: "Clicks",
    value: "12,456",
    change: "+12.5%",
    positive: true,
    icon: "clicks",
    iconBg: "bg-violet-100 text-violet-600",
  },
  {
    id: "referrals",
    label: "Referrals",
    value: "1,234",
    change: "+8.7%",
    positive: true,
    icon: "referrals",
    iconBg: "bg-sky-100 text-sky-600",
  },
  {
    id: "conversions",
    label: "Conversions",
    value: "567",
    change: "+15.3%",
    positive: true,
    icon: "conversions",
    iconBg: "bg-emerald-100 text-emerald-600",
  },
  {
    id: "earnings",
    label: "Earnings",
    value: "$2,456.78",
    change: "+18.6%",
    positive: true,
    icon: "earnings",
    iconBg: "bg-amber-100 text-amber-600",
  },
  {
    id: "pending",
    label: "Pending Payout",
    value: "$345.60",
    change: "In review",
    positive: false,
    pending: true,
    icon: "pending",
    iconBg: "bg-rose-100 text-rose-600",
  },
]

export const EMPTY_AFFILIATE_KPI: AffiliateKpiItem[] = AFFILIATE_KPI.map((k) => ({
  ...k,
  value: k.id === "earnings" || k.id === "pending" ? "$0.00" : "0",
  change: k.pending ? "—" : "0%",
}))

export interface AffiliateEarningsPoint {
  day: string
  Earnings: number
}

export const AFFILIATE_EARNINGS_CHART: AffiliateEarningsPoint[] = [
  { day: "May 1", Earnings: 120 },
  { day: "May 5", Earnings: 210 },
  { day: "May 10", Earnings: 180 },
  { day: "May 15", Earnings: 340 },
  { day: "May 20", Earnings: 290 },
  { day: "May 25", Earnings: 480 },
  { day: "May 28", Earnings: 520 },
  { day: "May 31", Earnings: 652.45 },
]

export interface TopLinkRow {
  campaign: string
  clicks: string
  conversions: string
  earnings: string
}

export const TOP_PERFORMING_LINKS: TopLinkRow[] = [
  { campaign: "Summer Mega Sale", clicks: "4,820", conversions: "186", earnings: "$842.50" },
  { campaign: "Tech Gadgets Promo", clicks: "3,410", conversions: "142", earnings: "$654.20" },
  { campaign: "Hosting Annual Deal", clicks: "2,190", conversions: "98", earnings: "$412.00" },
  { campaign: "Software Tools Bundle", clicks: "1,560", conversions: "74", earnings: "$298.80" },
  { campaign: "New User Welcome", clicks: "980", conversions: "41", earnings: "$149.28" },
]

export interface AffiliateDashActivityItem {
  title: string
  detail: string
  time: string
  tone: AffiliateActivityTone
}

export const AFFILIATE_DASH_ACTIVITY: AffiliateDashActivityItem[] = [
  {
    title: "Commission Approved",
    detail: "Summer Mega Sale — $124.50",
    time: "2 mins ago",
    tone: "emerald",
  },
  {
    title: "Referral Joined",
    detail: "Priya Sharma signed up via your link",
    time: "1 hour ago",
    tone: "sky",
  },
  {
    title: "Payout Requested",
    detail: "$345.60 withdrawal in review",
    time: "3 hours ago",
    tone: "amber",
  },
  {
    title: "Link Performance Spike",
    detail: "Tech Gadgets Promo +42% clicks",
    time: "Yesterday",
    tone: "violet",
  },
]

export interface AffiliateAccountSummary {
  name: string
  title: string
  status: string
  memberSince: string
  accountType: string
  referralCode: string
  rank: string
  balance: string
}

export const AFFILIATE_ACCOUNT_SUMMARY: AffiliateAccountSummary = {
  name: "Kazol Hossain",
  title: "Affiliate Marketer",
  status: "Active",
  memberSince: "Mar 12, 2023",
  accountType: "Affiliate",
  referralCode: "KAZOL123",
  rank: "Silver Partner",
  balance: "$2,111.18",
}

export const EMPTY_AFFILIATE_ACCOUNT_SUMMARY: AffiliateAccountSummary = {
  ...AFFILIATE_ACCOUNT_SUMMARY,
  referralCode: "—",
  rank: "—",
  balance: "$0.00",
}

export interface AffiliateQuickLink {
  label: string
  href: string
  icon: AffiliateQuickIcon
}

export const AFFILIATE_QUICK_LINKS: AffiliateQuickLink[] = [
  { label: "Create Link", href: "/affiliate/promotions", icon: "link" },
  { label: "Banners", href: "/affiliate/promotions", icon: "banners" },
  { label: "Reports", href: "/affiliate/earnings", icon: "reports" },
  { label: "Payments", href: "/affiliate/wallet", icon: "payments" },
]

export interface AffiliateSideNotification {
  text: string
  time: string
  tone: "emerald" | "sky" | "amber"
}

export const AFFILIATE_SIDE_NOTIFICATIONS: AffiliateSideNotification[] = [
  { text: "Your commission of $124.50 was approved", time: "2 mins ago", tone: "emerald" },
  { text: "New referral joined your network", time: "1 hour ago", tone: "sky" },
  { text: "Payout of $345.60 is processing", time: "3 hours ago", tone: "amber" },
]
