export type ProjectStatus = "payment" | "PAYMENT" | "WAITING" | "Working" | "Completed"

export interface ProjectItem {
  id: string
  name: string
  projectType: string
  subCategory: string
  budget: string
  durationStart: string
  durationEnd: string
  messageCount: number
  status: ProjectStatus
}

export type SkipStatus = "PendingHold" | "Paid" | "Cancel"

export interface SkipProjectItem {
  id: string
  subCategory: string
  earnings: string
  dateTime: string
  status: SkipStatus
}

export type PenaltyStatus = "Complete" | "Deactive" | "Pending" | "Review"

export interface PenaltyItem {
  id: string
  title: string
  subCategory: string
  amount: string
  status: PenaltyStatus
  recordedAt: string
}

export const TOTAL_RESULTS = 97
export const PAGE_SIZE = 5

const PROJECT_STATUSES: ProjectStatus[] = [
  "payment",
  "PAYMENT",
  "WAITING",
  "Working",
  "Completed",
]

const PROJECT_TYPES = ["New Build", "Upgrade", "Maintenance", "Bug Fix", "Consulting"] as const

const SUB_CATEGORIES = [
  "web dev...",
  "app dev...",
  "fintech...",
  "devops...",
  "data sci...",
  "security...",
  "backend...",
  "ui/ux...",
  "blockchain...",
  "ai/ml...",
  "qa/test...",
  "cloud...",
] as const

const CURRENCIES = ["usd", "gdc", "eur", "inr", "pkg"] as const

const PROJECT_TITLES = [
  "Frontend & Backend Module Sriptcode Documents",
  "E-commerce Payment Gateway Integration",
  "Mobile App UI/UX Redesign Sprint",
  "Cloud Infrastructure Migration Plan",
  "CRM Dashboard Analytics Module",
  "API Security Audit & Hardening",
  "Multi-language CMS Localization",
  "Real-time Chat Socket Service",
  "Inventory Management System Overhaul",
  "Healthcare Patient Portal v2",
  "Logistics Route Optimizer API",
  "NFT Marketplace Smart Contracts",
  "IoT Device Fleet Monitoring Dashboard",
  "Banking KYC Automation Workflow",
  "EdTech Video Streaming Platform",
  "HR Payroll & Attendance Suite",
  "Restaurant POS & Kitchen Display",
  "Legal Document e-Signature Portal",
  "Travel Booking Engine Refactor",
  "Social Media Analytics Dashboard",
] as const

const SKIP_SUB_CATEGORIES = [
  "web dev...",
  "app dev...",
  "fintech...",
  "devops...",
  "security...",
  "data sci...",
  "backend...",
  "ui/ux...",
  "blockchain...",
  "ai/ml...",
  "qa/test...",
  "cloud...",
  "e-commerce...",
  "healthcare...",
  "logistics...",
] as const

const SKIP_STATUSES: SkipStatus[] = ["PendingHold", "Paid", "Cancel"]

const SKIP_DATES = [
  "03 Feb 2025, 2:05 PM (UTC)",
  "12 Feb 2025, 9:30 AM (UTC)",
  "18 Feb 2025, 4:15 PM (UTC)",
  "25 Feb 2025, 11:00 AM (UTC)",
  "01 Mar 2025, 6:45 PM (UTC)",
  "07 Mar 2025, 1:20 PM (UTC)",
  "14 Mar 2025, 8:10 AM (UTC)",
  "21 Mar 2025, 3:55 PM (UTC)",
  "28 Mar 2025, 10:40 AM (UTC)",
  "04 Apr 2025, 5:25 PM (UTC)",
  "11 Apr 2025, 7:15 AM (UTC)",
  "18 Apr 2025, 2:50 PM (UTC)",
  "25 Apr 2025, 9:05 AM (UTC)",
  "02 May 2025, 4:30 PM (UTC)",
  "09 May 2025, 11:45 AM (UTC)",
] as const

const PENALTY_STATUSES: PenaltyStatus[] = ["Complete", "Deactive", "Pending", "Review"]

const PENALTY_SUB_CATEGORIES = [
  "web dev",
  "app dev",
  "fintech",
  "devops",
  "data sci",
  "security",
  "backend",
  "ui/ux",
  "blockchain",
  "ai/ml",
  "qa/test",
  "cloud",
  "e-commerce",
  "healthcare",
  "logistics",
] as const

export const PENALTY_STATS = [
  { label: "Total Clicks", value: "248" },
  { label: "Total Customer", value: "67" },
  { label: "Total Earnings", value: "1,420$" },
  { label: "paid amount", value: "980$" },
  { label: "Hold amount", value: "440$" },
  { label: "Total Referrals", value: "34" },
  { label: "Total Referrals Earnings", value: "186$" },
  { label: "Total Technical project", value: "97" },
] as const

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const

function padDate(day: number, monthIdx: number, year: number) {
  const month = MONTHS[monthIdx % MONTHS.length]
  return `${String(day).padStart(2, "0")} ${month} ${year}`
}

function buildProjectItem(index: number): Omit<ProjectItem, "id"> {
  const title = PROJECT_TITLES[index % PROJECT_TITLES.length]
  const type = PROJECT_TYPES[index % PROJECT_TYPES.length]
  const subCategory = SUB_CATEGORIES[index % SUB_CATEGORIES.length]
  const status = PROJECT_STATUSES[index % PROJECT_STATUSES.length]
  const currency = CURRENCIES[index % CURRENCIES.length]
  const amount = ((index * 17 + 11) % 240) + (index % 3 === 0 ? 0 : index % 10)
  const budget =
    status === "payment" && index % 5 === 0
      ? "0.00"
      : `${amount} ${currency}`

  const startDay = (index % 27) + 1
  const startMonth = (index + 2) % 12
  const endMonth = (startMonth + 6 + (index % 4)) % 12

  return {
    name: title,
    projectType: type,
    subCategory,
    budget,
    durationStart: padDate(startDay, startMonth, 2026),
    durationEnd: padDate(startDay, endMonth, 2027),
    messageCount: index % 9,
    status,
  }
}

function buildSkipItem(index: number): Omit<SkipProjectItem, "id"> {
  const subCategory = SKIP_SUB_CATEGORIES[index % SKIP_SUB_CATEGORIES.length]
  const status = SKIP_STATUSES[index % SKIP_STATUSES.length]
  const currency = CURRENCIES[index % CURRENCIES.length]
  const amount = ((index * 13 + 7) % 180) + (index % 4)
  const earnings = index % 6 === 0 ? "0.00" : `${amount} ${currency}`

  return {
    subCategory,
    earnings,
    dateTime: SKIP_DATES[index % SKIP_DATES.length],
    status,
  }
}

function buildPenaltyItem(index: number): Omit<PenaltyItem, "id"> {
  const title = PROJECT_TITLES[index % PROJECT_TITLES.length]
  const subCategory = PENALTY_SUB_CATEGORIES[index % PENALTY_SUB_CATEGORIES.length]
  const status = PENALTY_STATUSES[index % PENALTY_STATUSES.length]
  const amount = ((index * 3 + 1) % 50) + (index % 10) / 10
  const daysAgo = index % 120

  return {
    title,
    subCategory,
    amount: `${amount.toFixed(2)} USD`,
    status,
    recordedAt: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString(),
  }
}

function buildList<T extends { id: string }>(
  prefix: string,
  total: number,
  builder: (index: number) => Omit<T, "id">
): T[] {
  return Array.from({ length: total }, (_, i) => ({
    id: `${prefix}-${1001 + i}`,
    ...builder(i),
  })) as T[]
}

export const DEMO_PROJECTS: ProjectItem[] = buildList("TP", TOTAL_RESULTS, buildProjectItem)
export const DEMO_SKIP_PROJECTS: SkipProjectItem[] = buildList("SP", TOTAL_RESULTS, buildSkipItem)
export const DEMO_PENALTY_ITEMS: PenaltyItem[] = buildList("PN", TOTAL_RESULTS, buildPenaltyItem)
