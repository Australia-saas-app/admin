export interface AssociateDemo {
  id: string
  name: string
  fullName?: string
  email: string
  company: string
  nationality?: string
  logo?: string
  category: string
  subcategory?: string
  propertyType?: string
  workType?: string
  services?: string[]
  serviceArea?: string
  employee?: string
  completedProjects?: number
  supportedLanguages?: string[]
  rank?: string
  establishment?: string
  officeAddress?: string
  aim?: string
  requiredSkills?: string
  description?: string
  status?: "Active" | "Inactive"
  rating?: number
}

const categories = [
  "Technical",
  "Construction",
  "Real Estate",
  "Import & Export",
  "Visa & Travel",
  "Courses",
  "Jobs",
  "Healthcare",
  "Shopping",
  "Donate",
] as const

const COMPANIES = [
  "Apple Global Services",
  "Skyline Builders",
  "Pacific Realty Group",
  "Horizon Import Co.",
  "Global Visa Partners",
  "LearnPath Academy",
  "Talent Bridge HR",
  "MedCare Associates",
  "Urban Retail Hub",
  "Hope Foundation",
  "Nova Tech Labs",
  "Summit Construction",
]

const DISPLAY_NAMES = [
  "Mr. Jack",
  "Tarzan",
  "Sarah Chen",
  "James Wilson",
  "Maria Lopez",
  "David Kim",
  "Emma Brown",
  "Omar Hassan",
  "Lisa Park",
  "Ryan Miller",
  "Aisha Khan",
  "Noah Taylor",
]

const SERVICE_DESCRIPTIONS: Record<string, string> = {
  Technical:
    "Provides software development, cloud integration, and IT consulting for businesses across North America and Europe.",
  Construction:
    "Specializes in commercial and residential construction, renovation, and project management with 14+ years of experience.",
  "Real Estate":
    "Offers property sales, rentals, and buyer advisory services with coverage across major metropolitan markets.",
  "Import & Export":
    "Handles import, export, and domestic distribution for manufacturing and retail clients worldwide.",
  "Visa & Travel":
    "Assists with visa processing, tour packages, and travel documentation for international clients.",
  Courses:
    "Delivers professional training programs in technology, business, and language skills through online and in-person formats.",
  Jobs:
    "Connects employers with qualified candidates and provides workforce placement across multiple industries.",
  Healthcare:
    "Partners with clinics and health providers to deliver patient support, staffing, and administrative services.",
  Shopping:
    "Operates e-commerce and retail channels with logistics support for consumer and B2B product lines.",
  Donate:
    "Coordinates charitable programs, fundraising campaigns, and community outreach initiatives globally.",
}

export const associatesDemo: AssociateDemo[] = Array.from({ length: 12 }).map((_, i) => {
  const category = categories[i % categories.length]

  return {
    id: String(i + 1),
    name: DISPLAY_NAMES[i],
    fullName: DISPLAY_NAMES[i],
    email: `${DISPLAY_NAMES[i].toLowerCase().replace(/[^a-z]/g, "")}${i + 1}@associate.demo`,
    company: COMPANIES[i],
    nationality: ["Japan", "Canada", "India", "UK", "USA", "UAE"][i % 6],
    logo: "/newLogo.png",
    category,
    subcategory:
      category === "Real Estate"
        ? "Property Buyer, Property Sales, Property Rental"
        : "Residential, Commercial, Industrial, Agricultural",
    propertyType:
      category === "Real Estate" ? "Houses, Flats, Apartments, Townhouses" : undefined,
    workType:
      category === "Technical" || category === "Construction"
        ? "New Build, Renovation, Repair, Maintenance, Installation"
        : category === "Import & Export"
          ? "Import, Export, Manufacturing, Domestic Sales"
          : undefined,
    services: ["Software Development", "Web Design & UI/UX", "Mobile App Development"],
    serviceArea: "Toronto, Quebec, Nova Scotia, New Brunswick, Canada",
    employee: "01 - 30",
    completedProjects: 1200 + i * 340,
    supportedLanguages: ["English", "Hindi", "Portuguese", "Russian", "Japanese"],
    rank: `C${(i % 6) + 1}`,
    establishment: `${5 + (i % 10)} Years, ${(i % 12) + 1} Months`,
    officeAddress: "Nadd Al Hamar, Dubai, United Arab Emirates",
    aim: "Deliver reliable partner services with transparent communication and measurable results.",
    requiredSkills: "JavaScript | Website Design | Graphic Design | CSS | HTML | Project Management",
    description: SERVICE_DESCRIPTIONS[category],
    status: "Active",
    rating: 4 + (i % 2),
  }
})

export default associatesDemo
