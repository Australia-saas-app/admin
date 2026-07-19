import type { Notice } from "../types/notice.type"

interface NoticeSeed {
  type: string
  title: string
  content: string
  publishAt: string
  priority?: string
}

const NOTICE_SEEDS: NoticeSeed[] = [
  {
    type: "Job",
    title:
      "How fast is your download speed? In seconds, FAST.com's simple Internet speed test will estimate your ISP speed.",
    content:
      "We are hiring network engineers to support our global infrastructure team. Applicants should have experience with ISP diagnostics and customer-facing technical support.",
    publishAt: "2024-09-09T10:00:00.000Z",
  },
  {
    type: "Announcement",
    title: "Platform maintenance scheduled for Sunday, 14 Sep 2024 from 02:00 AM to 05:00 AM (UTC).",
    content:
      "Some services may be temporarily unavailable during the maintenance window. Wallet, profile, and visa applications will resume automatically once maintenance is complete.",
    publishAt: "2024-09-12T08:30:00.000Z",
    priority: "high",
  },
  {
    type: "Policy",
    title: "Updated privacy policy for affiliate and business accounts effective 01 Oct 2024.",
    content:
      "We have revised our data retention and consent policies. Please review the updated terms in your account settings and accept the changes before the effective date.",
    publishAt: "2024-09-15T14:00:00.000Z",
  },
  {
    type: "Event",
    title: "Global partner webinar: Scaling visa and travel services across new markets.",
    content:
      "Join our product and operations teams for a live session on onboarding partners, compliance workflows, and regional launch checklists. Registration opens next week.",
    publishAt: "2024-09-18T11:15:00.000Z",
  },
  {
    type: "Alert",
    title: "Phishing attempts reported using fake payment confirmation emails.",
    content:
      "Do not click links from unknown senders claiming to be our billing team. Official payment notices are only sent from verified @demo.com addresses inside your dashboard.",
    publishAt: "2024-09-20T09:45:00.000Z",
    priority: "high",
  },
  {
    type: "Job",
    title: "Open role: Customer success specialist for the Europe and MENA regions.",
    content:
      "The role focuses on onboarding business accounts, resolving escalations, and coordinating with branch teams. Fluency in English plus one additional language is preferred.",
    publishAt: "2024-09-22T16:20:00.000Z",
  },
  {
    type: "Update",
    title: "New branch listings are now available for Tunisia, Dubai, and Toronto.",
    content:
      "Visit the Branch page to view updated office addresses, contact numbers, and support hours for recently opened locations.",
    publishAt: "2024-09-25T07:00:00.000Z",
  },
  {
    type: "Courses",
    title: "Enrollment open for the October cohort of the Technical Project Management course.",
    content:
      "Seats are limited to 40 participants. Early registrants receive access to mentor sessions and certification prep materials.",
    publishAt: "2024-09-28T13:30:00.000Z",
  },
  {
    type: "Reminder",
    title: "Complete your business profile verification before 10 Oct 2024 to avoid payout delays.",
    content:
      "Accounts missing document uploads or tax information may experience delayed withdrawals. Check the profile verification checklist in your dashboard.",
    publishAt: "2024-10-01T10:10:00.000Z",
  },
  {
    type: "General",
    title: "Holiday support hours announced for December across all global branches.",
    content:
      "Reduced staffing will be in effect from 24 Dec to 02 Jan. Emergency visa support remains available through the priority contact channel.",
    publishAt: "2024-10-04T18:00:00.000Z",
  },
  {
    type: "Marketplace",
    title: "Seller onboarding guide refreshed with new shipping and refund policy templates.",
    content:
      "Marketplace vendors should review the updated seller handbook and migrate listings to the new category structure by the end of the month.",
    publishAt: "2024-10-07T12:40:00.000Z",
  },
  {
    type: "Travel",
    title: "Visa processing times updated for UK, Canada, and Schengen applications.",
    content:
      "Average turnaround times have changed due to seasonal demand. Refer to the Visa & Travel listings page for country-specific estimates.",
    publishAt: "2024-10-10T15:25:00.000Z",
  },
]

export const MOCK_NOTICES: Notice[] = NOTICE_SEEDS.map((seed, i) => ({
  id: String(i + 1),
  title: seed.title,
  content: seed.content,
  excerpt: seed.title,
  type: seed.type,
  priority: seed.priority ?? "normal",
  isVisible: true,
  isRead: false,
  publishAt: seed.publishAt,
  expiresAt: null,
  metadata: {},
  createdBy: "admin",
  targetAudience: ["all"],
  createdAt: seed.publishAt,
  updatedAt: seed.publishAt,
  deletedAt: null,
}))

export function formatNoticeDate(iso: string): string {
  try {
    const d = new Date(iso)
    if (isNaN(d.getTime())) return iso
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const dd = String(d.getDate()).padStart(2, "0")
    const mon = months[d.getMonth()]
    const yyyy = d.getFullYear()
    return `${dd}-${mon}-${yyyy}`
  } catch {
    return iso
  }
}
