import type { GlobalBranch } from "@/src/modules/dashboard/menu/types/globalBranch"

const demoBranches: GlobalBranch[] = [
  {
    id: "g1",
    name: "Canada",
    flagUrl: "/image/flags/canada.png",
    call: "+1 416 555 0100",
    email: "canada@example.com",
    officeAddress: "123 Maple St, Toronto, ON",
    socialLinks: [
      { platform: "facebook", url: "https://facebook.com/example" },
      { platform: "twitter", url: "https://twitter.com/example" },
    ],
    active: true,
  },
  {
    id: "g2",
    name: "United States",
    flagUrl: "/image/flags/usa.png",
    call: "+1 212 555 0111",
    email: "us@example.com",
    officeAddress: "456 Liberty Ave, New York, NY",
    socialLinks: [{ platform: "linkedin", url: "https://linkedin.com/company/example" }],
    active: true,
  },
  {
    id: "g3",
    name: "United Kingdom",
    flagUrl: "/image/flags/uk.png",
    call: "+44 20 7946 0958",
    email: "uk@example.com",
    officeAddress: "789 King's Rd, London",
    socialLinks: [],
    active: false,
  },
]

export const fetchGlobalBranches = async (): Promise<GlobalBranch[]> => {
  await new Promise((r) => setTimeout(r, 150))
  return demoBranches
}

export default { fetchGlobalBranches }
