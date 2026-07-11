import type { Employee } from "@/src/business/dashboard/menu/types/employee"

// Demo/mock data. Replace with real API calls when backend is available.
const demoEmployees: Employee[] = [
  {
    id: "1",
    name: "Mr Jack",
    title: "m.d.",
    officeAddress: "Canada, Belleville",
    photoUrl: "/image/placeholder-1.jpg",
    socialLinks: [
      { platform: "facebook", url: "https://facebook.com/jack" },
      { platform: "twitter", url: "https://twitter.com/jack" },
    ],
    active: true,
  },
  {
    id: "2",
    name: "Ms Jane",
    title: "p.m.",
    officeAddress: "USA, New York",
    photoUrl: "/image/placeholder-2.jpg",
    socialLinks: [{ platform: "linkedin", url: "https://linkedin.com/jane" }],
    active: true,
  },
  {
    id: "3",
    name: "Dr Alex",
    title: "f.m.",
    officeAddress: "UK, London",
    photoUrl: "/image/placeholder-3.jpg",
    socialLinks: [],
    active: false,
  },
]

export const fetchEmployees = async (): Promise<Employee[]> => {
  await new Promise((r) => setTimeout(r, 0))
  return demoEmployees
}
