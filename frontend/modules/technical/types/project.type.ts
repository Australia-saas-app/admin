export type TechnicalUserRole = "unauthorized" | "normal" | "affiliate" | "business"

export interface TechnicalProject {
  id: number
  title: string
  category: string
  categoryFilter: "software" | "web" | "mobile"
  projectType: "new-build" | "upgrade" | "troubleshooting" | "maintenance" | "installation"
  subcategory: "frontend" | "backend" | "fullstack"
  skills: string[]
  languages: string[]
  duration: string
  experience: string
  priceRange: string
  price: number
  description: string
  modified?: string
  location?: string
}
