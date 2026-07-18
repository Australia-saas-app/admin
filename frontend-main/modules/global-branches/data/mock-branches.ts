import type { GlobalBranch } from "../types/global.type"

const BRANCH_NAMES = [
  "Tunisia",
  "Dubai",
  "London",
  "Toronto",
  "Tokyo",
  "Paris",
  "New York",
  "Sydney",
  "Berlin",
  "Mumbai",
  "Singapore",
  "Cairo",
]

const ADDRESSES = [
  "12 Avenue Habib Bourguiba, Tunis 1000, Tunisia",
  "Nadd Al Hamar, Dubai, United Arab Emirates",
  "221B Baker Street, London, UK",
  "100 King Street West, Toronto, ON, Canada",
  "2-1-1 Marunouchi, Chiyoda, Tokyo, Japan",
  "8 Rue de Rivoli, Paris, France",
  "350 Fifth Avenue, New York, NY, USA",
  "200 George Street, Sydney, Australia",
  "Unter den Linden 77, Berlin, Germany",
  "Bandra Kurla Complex, Mumbai, India",
  "1 Raffles Place, Singapore",
  "15 Nile Corniche, Cairo, Egypt",
]

export const TOTAL_BRANCH_RESULTS = 97

export const MOCK_BRANCHES: GlobalBranch[] = Array.from({ length: 12 }).map((_, i) => ({
  id: String(i + 1),
  branchName: BRANCH_NAMES[i],
  address: ADDRESSES[i],
  phone: `+1 (555) ${String(100 + i).padStart(3, "0")}-${String(2000 + i * 11).slice(-4)}`,
  emailAddress: `branch.${BRANCH_NAMES[i].toLowerCase().replace(/\s/g, "")}@demo.com`,
  workingHours: "Mon–Fri 9:00 AM – 6:00 PM",
  services: ["Visa Support", "Consultation", "Documentation"],
  isVisible: true,
  displayOrder: i + 1,
  createdBy: "system",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  deletedAt: null,
}))
