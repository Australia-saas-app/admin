import { normalizeContact } from "@/src/lib/normalize-contact"

export type DemoAccountType = "user" | "affiliate" | "business" | "admin"

/** Account types shown on the public login page (admin uses a separate URL). */
export type DashboardDemoAccountType = Exclude<DemoAccountType, "admin">

export interface DemoAccount {
  type: DemoAccountType
  email: string
  password: string
  role: string
  label: string
  redirect: string
}

export const DEMO_ACCOUNTS: Record<DemoAccountType, DemoAccount> = {
  user: {
    type: "user",
    email: "user@demo.com",
    password: "demo123456",
    role: "USER",
    label: "Demo User",
    redirect: "/user/dashboard",
  },
  affiliate: {
    type: "affiliate",
    email: "affiliate@demo.com",
    password: "demo123456",
    role: "AFFILIATE",
    label: "Demo Affiliate",
    redirect: "/affiliate/dashboard",
  },
  business: {
    type: "business",
    email: "business@demo.com",
    password: "demo123456",
    role: "SELLER",
    label: "Demo Business",
    redirect: "/business/dashboard",
  },
  admin: {
    type: "admin",
    email: "admin@demo.com",
    password: "demo123456",
    role: "SUPER_ADMIN",
    label: "Super Administrator",
    redirect: "/admin/dashboard",
  },
}

export function findDemoAccount(email: string, password: string): DemoAccount | null {
  const normalizedIdentifier = normalizeContact(email)
  return (
    Object.values(DEMO_ACCOUNTS).find(
      (account) =>
        normalizeContact(account.email) === normalizedIdentifier && account.password === password
    ) ?? null
  )
}

export const DEMO_ACCOUNT_LIST = Object.values(DEMO_ACCOUNTS)

export const DASHBOARD_DEMO_ACCOUNT_LIST = DEMO_ACCOUNT_LIST.filter(
  (account): account is DemoAccount & { type: DashboardDemoAccountType } => account.type !== "admin"
)
