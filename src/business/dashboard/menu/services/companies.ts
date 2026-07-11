import type { Company } from "@/src/business/dashboard/menu/types/company"

// Demo/mock companies. Replace with real API calls when backend is available.
const demoCompanies: Company[] = [
  {
    id: "1",

    contentName: "Privacy Policy",
    contentDescription: "How we collect, use, and protect your data.",
    contentDate: "2025-12-01",
    active: true,
  },
  {
    id: "2",
    contentName: "Terms & Conditions",
    contentDescription: "Rules for using the platform and services.",
    contentDate: "2025-11-15",
    active: true,
  },
  {
    id: "3",
    contentName: "Refund Policy",
    contentDescription: "Guidelines for refunds and cancellations.",
    contentDate: "2025-10-20",
    active: false,
  },
]

export const fetchCompanies = async (): Promise<Company[]> => {
  await new Promise((r) => setTimeout(r, 0))
  return demoCompanies
}
