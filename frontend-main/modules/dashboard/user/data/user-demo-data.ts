export const USER_STATS = {
  totalProjects: 12,
  activeProjects: 3,
  completedProjects: 8,
  totalEarnings: "$310",
  totalWithdrawn: "$100",
  currentBalance: "$50",
  pendingPayments: 2,
  unreadNotices: 3,
  unreadMessages: 5,
} as const

export interface UserActivityItem {
  action: string
  category: string
  date: string
}

export const USER_RECENT_ACTIVITY: UserActivityItem[] = [
  { action: "Withdrawal processed — $50 USD", category: "Wallet", date: "03 Feb 2025" },
  { action: "Commission earned — Web dev project", category: "Earnings", date: "01 Feb 2025" },
  { action: "Technical project assigned — E-commerce rebuild", category: "Technical", date: "30 Jan 2025" },
  { action: "Course enrollment confirmed — React Mastery", category: "Courses", date: "28 Jan 2025" },
  { action: "Marketplace order shipped — iPhone 16 Pro", category: "Marketplace", date: "25 Jan 2025" },
  { action: "Profile updated", category: "Account", date: "22 Jan 2025" },
]

export interface UserOrder {
  id: string
  service: string
  title: string
  amount: string
  status: string
  date: string
}

export const USER_ORDERS: UserOrder[] = [
  { id: "ORD-1024", service: "Marketplace", title: "Apple iPhone 16 Pro", amount: "$899", status: "Shipped", date: "2025/02/01" },
  { id: "ORD-1023", service: "Courses", title: "International Online Course Platform", amount: "$4,652", status: "Active", date: "2025/01/28" },
  { id: "ORD-1022", service: "Transport", title: "Airport Transfer — Toronto", amount: "$45", status: "Completed", date: "2025/01/25" },
  { id: "ORD-1021", service: "Real Estate", title: "Property viewing — Downtown Condo", amount: "$0", status: "Scheduled", date: "2025/01/22" },
  { id: "ORD-1020", service: "Visa", title: "Tourist Visa Application", amount: "$120", status: "Processing", date: "2025/01/18" },
  { id: "ORD-1019", service: "Healthcare", title: "Telehealth Consultation", amount: "$35", status: "Completed", date: "2025/01/15" },
  { id: "ORD-1018", service: "Marketplace", title: "MacBook Air M3", amount: "$1,199", status: "Delivered", date: "2025/01/10" },
  { id: "ORD-1017", service: "Courses", title: "Machine Learning & AI", amount: "$2,100", status: "Active", date: "2025/01/05" },
]

export interface UserNotice {
  id: string
  title: string
  category: string
  read: boolean
  date: string
}

export const USER_NOTICES: UserNotice[] = [
  { id: "N-001", title: "Platform maintenance scheduled for Feb 10", category: "System", read: false, date: "2025/02/03" },
  { id: "N-002", title: "New technical projects available in your region", category: "Technical", read: false, date: "2025/02/01" },
  { id: "N-003", title: "Your withdrawal has been processed", category: "Wallet", read: true, date: "2025/01/30" },
  { id: "N-004", title: "Course enrollment deadline reminder", category: "Courses", read: false, date: "2025/01/28" },
  { id: "N-005", title: "Holiday support hours update", category: "Support", read: true, date: "2025/01/25" },
  { id: "N-006", title: "Security: Enable two-factor authentication", category: "Security", read: true, date: "2025/01/20" },
]

export interface UserMarketplaceItem {
  id: string
  title: string
  type: string
  price: string
  status: string
  date: string
}

export const USER_MARKETPLACE: UserMarketplaceItem[] = [
  { id: "MP-501", title: "Apple iPhone 16 Pro", type: "Purchase", price: "$899", status: "Shipped", date: "2025/02/01" },
  { id: "MP-502", title: "Sony WH-1000XM5 Headphones", type: "Saved", price: "$349", status: "Watching", date: "2025/01/29" },
  { id: "MP-503", title: "Vintage Camera Lens 50mm", type: "Bid", price: "$180", status: "Outbid", date: "2025/01/27" },
  { id: "MP-504", title: "MacBook Air M3", type: "Purchase", price: "$1,199", status: "Delivered", date: "2025/01/10" },
  { id: "MP-505", title: "Ergonomic Office Chair", type: "Saved", price: "$299", status: "Watching", date: "2025/01/08" },
]

export interface UserMessage {
  id: string
  from: string
  subject: string
  body: string
  project: string
  unread: boolean
  date: string
}

export const USER_MESSAGES: UserMessage[] = [
  { id: "MSG-01", from: "Project Manager", subject: "Milestone review for E-commerce rebuild", body: "Thank you for your continued work on this project. Please review the latest milestone requirements and confirm your availability for the upcoming sprint review meeting.", project: "E-commerce Platform", unread: true, date: "2025/02/03" },
  { id: "MSG-02", from: "Support Team", subject: "Your withdrawal request update", body: "Your withdrawal request WD-48291 has been approved and is being processed. Funds should arrive within 1–3 business days depending on your payout method.", project: "—", unread: true, date: "2025/02/02" },
  { id: "MSG-03", from: "Client — RetailCorp", subject: "Additional requirements for mobile app", body: "We would like to add biometric login and push notification support to the mobile banking scope. Please review the updated requirements document attached to this thread.", project: "Mobile Banking App", unread: false, date: "2025/01/30" },
  { id: "MSG-04", from: "Course Instructor", subject: "Welcome to React Mastery module 3", body: "Module 3 covers advanced hooks, context patterns, and performance optimization. Complete the pre-module quiz before starting the video lessons.", project: "—", unread: true, date: "2025/01/28" },
  { id: "MSG-05", from: "Marketplace Seller", subject: "Your order has been shipped", body: "Order MP-504 has shipped via express delivery. Tracking number: TRK-8849201. Estimated delivery is within 2 business days.", project: "—", unread: false, date: "2025/01/25" },
  { id: "MSG-06", from: "Technical Lead", subject: "DevOps pipeline setup — kickoff meeting", body: "The DevOps pipeline kickoff is scheduled for Thursday at 10:00 AM EST. Please confirm attendance and review the CI/CD architecture draft shared in the project workspace.", project: "DevOps Pipeline", unread: true, date: "2025/01/22" },
]

export const USER_LOG_ENTRIES = [
  { action: "Profile updated — contact information", date: "2025/02/03 10:15" },
  { action: "Password changed successfully", date: "2025/01/30 14:22" },
  { action: "Document uploaded — ID verification", date: "2025/01/28 09:45" },
  { action: "Withdrawal requested — $50 USD via PayPal", date: "2025/01/25 16:30" },
  { action: "Technical project accepted — E-commerce rebuild", date: "2025/01/22 11:00" },
  { action: "Login from web session — Chrome / Windows", date: "2025/01/20 08:15" },
  { action: "Two-factor authentication enabled", date: "2025/01/18 13:40" },
  { action: "Course enrolled — React Mastery", date: "2025/01/15 17:55" },
]

export const USER_SERVICE_SHORTCUTS = [
  { label: "Technical", href: "/technical", desc: "Browse & manage projects" },
  { label: "Marketplace", href: "/marketplace", desc: "Shop products & deals" },
  { label: "Courses", href: "/courses", desc: "Online learning" },
  { label: "Careers", href: "/careers", desc: "Job opportunities" },
  { label: "Real Estate", href: "/real-estate", desc: "Property listings" },
  { label: "Gallery", href: "/gallery", desc: "Media & events" },
] as const
