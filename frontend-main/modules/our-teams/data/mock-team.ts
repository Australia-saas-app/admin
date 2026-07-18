import type { OurTeam } from "../types/ourTeam.type"

type TeamSeed = {
  firstName: string
  lastName: string
  position: string
  department: string
  bio: string
  photoId: number
}

const TEAM_SEEDS: TeamSeed[] = [
  {
    firstName: "Amelia",
    lastName: "Chen",
    position: "Chief Executive Officer",
    department: "Head Office — Singapore",
    bio: "Leads global strategy and partnerships across maritime services.",
    photoId: 1,
  },
  {
    firstName: "Marcus",
    lastName: "Okeke",
    position: "Chief Operating Officer",
    department: "Head Office — Lagos",
    bio: "Oversees day-to-day operations and regional delivery standards.",
    photoId: 3,
  },
  {
    firstName: "Sofia",
    lastName: "Reyes",
    position: "Head of Product",
    department: "Product — Remote",
    bio: "Owns the platform roadmap for users, affiliates, and businesses.",
    photoId: 5,
  },
  {
    firstName: "James",
    lastName: "Whitaker",
    position: "Engineering Lead",
    department: "Technology — London",
    bio: "Builds reliable APIs, dashboards, and integration tooling.",
    photoId: 8,
  },
  {
    firstName: "Priya",
    lastName: "Nair",
    position: "Customer Success Manager",
    department: "Support — Mumbai",
    bio: "Helps onboard clients and resolve account verification flows.",
    photoId: 9,
  },
  {
    firstName: "Luca",
    lastName: "Bianchi",
    position: "Regional Director",
    department: "EU Operations — Genoa",
    bio: "Coordinates European branches and associate networks.",
    photoId: 12,
  },
  {
    firstName: "Aisha",
    lastName: "Haddad",
    position: "Visa & Travel Lead",
    department: "Services — Dubai",
    bio: "Specializes in maritime crew travel and visa processing.",
    photoId: 16,
  },
  {
    firstName: "Daniel",
    lastName: "Nguyen",
    position: "Marketplace Manager",
    department: "Commerce — Ho Chi Minh",
    bio: "Curates listings and seller quality across the marketplace.",
    photoId: 14,
  },
  {
    firstName: "Elena",
    lastName: "Popov",
    position: "Compliance Officer",
    department: "Legal — Amsterdam",
    bio: "Ensures verification and platform policies stay audit-ready.",
    photoId: 20,
  },
  {
    firstName: "Omar",
    lastName: "Farouk",
    position: "Affiliate Program Lead",
    department: "Growth — Cairo",
    bio: "Runs referral programs and partner enablement.",
    photoId: 11,
  },
  {
    firstName: "Hannah",
    lastName: "Brooks",
    position: "People Operations",
    department: "HR — Toronto",
    bio: "Supports hiring, culture, and internal team programs.",
    photoId: 25,
  },
  {
    firstName: "Kenji",
    lastName: "Sato",
    position: "Technical Projects Lead",
    department: "Engineering Services — Tokyo",
    bio: "Coordinates technical project assignments and delivery.",
    photoId: 33,
  },
  {
    firstName: "Camila",
    lastName: "Silva",
    position: "Real Estate Advisor",
    department: "Property — São Paulo",
    bio: "Advises on commercial maritime-adjacent real estate listings.",
    photoId: 26,
  },
  {
    firstName: "Noah",
    lastName: "Andersen",
    position: "Finance Controller",
    department: "Finance — Oslo",
    bio: "Owns reporting, payouts, and transaction oversight.",
    photoId: 52,
  },
  {
    firstName: "Fatima",
    lastName: "Al-Rashid",
    position: "Branch Coordinator",
    department: "Branches — Jeddah",
    bio: "Connects regional offices with headquarters operations.",
    photoId: 44,
  },
  {
    firstName: "Ethan",
    lastName: "Park",
    position: "Content & Communications",
    department: "Marketing — Seoul",
    bio: "Produces notices, blogs, and public-facing campaigns.",
    photoId: 60,
  },
]

/** Demo team used when `/platform-service/team` returns no data. */
export const MOCK_TEAM_MEMBERS: OurTeam[] = TEAM_SEEDS.map((seed, index) => {
  const now = new Date().toISOString()
  return {
    id: `team-${index + 1}`,
    firstName: seed.firstName,
    lastName: seed.lastName,
    position: seed.position,
    department: seed.department,
    branchId: null,
    employeeId: `EMP-${2100 + index}`,
    salary: "",
    hireDate: null,
    bio: seed.bio,
    photoUrl: `https://i.pravatar.cc/300?img=${seed.photoId}`,
    linkedinUrl: "https://www.linkedin.com",
    isVisible: true,
    displayOrder: index,
    managerId: null,
    createdBy: "system",
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
    branch: null,
    manager: null,
  }
})
