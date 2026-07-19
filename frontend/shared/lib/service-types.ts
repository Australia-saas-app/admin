// Define service configuration for reusability across all services
export type ServiceType =
  | "technical"
  | "import-export"
  | "construction"
  | "visa"
  | "travel"
  | "healthcare"
  | "investment"
  | "donations"
  | "other"
export type UserType = "unauthorized" | "user" | "affiliate" | "business"

export interface ServiceConfig {
  id: ServiceType
  name: string
  description: string
  icon: string
  color: string
  categories: ServiceCategory[]
}

export interface ServiceCategory {
  id: string
  name: string
  subcategories: string[]
  skills?: string[]
}

export interface Project {
  id: string
  title: string
  description: string
  category: string
  subcategory: string
  type: string
  skills: string[]
  budget?: number
  postedBy: string
  status: "open" | "in-progress" | "completed" | "approved" | "pending-approval"
  createdAt: Date
}

export const SERVICE_CONFIGS: Record<ServiceType, ServiceConfig> = {
  technical: {
    id: "technical",
    name: "Technology",
    description: "Software development, web design, IT services",
    icon: "💻",
    color: "blue",
    categories: [
      {
        id: "web",
        name: "Web Development",
        subcategories: ["Frontend", "Backend", "Full Stack"],
        skills: ["React", "Node.js", "TypeScript", "Python", "Vue.js"],
      },
      {
        id: "mobile",
        name: "Mobile Development",
        subcategories: ["iOS", "Android", "Cross-platform"],
        skills: ["Swift", "Kotlin", "Flutter", "React Native"],
      },
      {
        id: "qa",
        name: "QA & Testing",
        subcategories: ["Manual Testing", "Automation", "Performance"],
        skills: ["Selenium", "Jest", "Load Testing", "Test Management"],
      },
    ],
  },
  "import-export": {
    id: "import-export",
    name: "Import/Export",
    description: "International trade, logistics, customs clearance",
    icon: "📦",
    color: "amber",
    categories: [
      {
        id: "customs",
        name: "Customs Clearance",
        subcategories: ["Documentation", "Compliance", "Consulting"],
      },
      {
        id: "logistics",
        name: "Logistics",
        subcategories: ["Shipping", "Warehousing", "Distribution"],
      },
      {
        id: "compliance",
        name: "Compliance",
        subcategories: ["Regulations", "Certifications", "Documentation"],
      },
    ],
  },
  construction: {
    id: "construction",
    name: "Construction",
    description: "Building, contracting, project management",
    icon: "🏗️",
    color: "slate",
    categories: [
      {
        id: "residential",
        name: "Residential",
        subcategories: ["Houses", "Apartments", "Renovations"],
      },
      {
        id: "commercial",
        name: "Commercial",
        subcategories: ["Office", "Retail", "Industrial"],
      },
      {
        id: "infrastructure",
        name: "Infrastructure",
        subcategories: ["Roads", "Bridges", "Utilities"],
      },
    ],
  },
  visa: {
    id: "visa",
    name: "Visa & Immigration",
    description: "Visa processing, immigration consulting, documentation",
    icon: "🛂",
    color: "green",
    categories: [
      {
        id: "work",
        name: "Work Visa",
        subcategories: ["Application", "Consulting", "Documentation"],
      },
      {
        id: "student",
        name: "Student Visa",
        subcategories: ["Application", "University Selection", "Prep"],
      },
      {
        id: "residency",
        name: "Residency",
        subcategories: ["Permanent", "Temporary", "Renewal"],
      },
    ],
  },
  travel: {
    id: "travel",
    name: "Travel & Tourism",
    description: "Tour planning, bookings, travel consulting",
    icon: "✈️",
    color: "cyan",
    categories: [
      {
        id: "tours",
        name: "Tours",
        subcategories: ["Domestic", "International", "Custom"],
      },
      {
        id: "accommodation",
        name: "Accommodation",
        subcategories: ["Hotels", "Resorts", "Homestays"],
      },
    ],
  },
  other: {
    id: "other",
    name: "Other Services",
    description: "Miscellaneous services",
    icon: "⚙️",
    color: "gray",
    categories: [],
  },
  healthcare: {
    id: "healthcare",
    name: "Healthcare",
    description: "Medical services, telehealth, and health consulting",
    icon: "🏥",
    color: "rose",
    categories: [
      {
        id: "telehealth",
        name: "Telehealth",
        subcategories: ["Consultation", "Diagnostics", "Follow-up"],
        skills: ["Patient Care", "EMR", "HIPAA Compliance"],
      },
      {
        id: "wellness",
        name: "Wellness",
        subcategories: ["Nutrition", "Fitness", "Mental Health"],
      },
    ],
  },
  investment: {
    id: "investment",
    name: "Investment",
    description: "Financial advisory, portfolio management, and funding",
    icon: "📈",
    color: "emerald",
    categories: [
      {
        id: "advisory",
        name: "Advisory",
        subcategories: ["Portfolio Review", "Risk Assessment", "Planning"],
      },
      {
        id: "funding",
        name: "Funding",
        subcategories: ["Seed", "Series A", "Growth Capital"],
      },
    ],
  },
  donations: {
    id: "donations",
    name: "Donations",
    description: "Charitable giving, fundraising, and nonprofit support",
    icon: "❤️",
    color: "red",
    categories: [
      {
        id: "fundraising",
        name: "Fundraising",
        subcategories: ["Campaigns", "Events", "Corporate Giving"],
      },
      {
        id: "nonprofit",
        name: "Nonprofit",
        subcategories: ["Operations", "Volunteer Programs", "Outreach"],
      },
    ],
  },
}
