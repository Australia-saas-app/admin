export interface TechnicalFilters {
  projectType: string
  category: string
  subcategory: string
  skills: string[]
  languages: string[]
  minPrice: number
  maxPrice: number
}

export const DEFAULT_TECHNICAL_FILTERS: TechnicalFilters = {
  projectType: "all",
  category: "all",
  subcategory: "all",
  skills: [],
  languages: [],
  minPrice: 0,
  maxPrice: 20000,
}

export const PROJECT_TYPE_OPTIONS = [
  { value: "all", label: "All Types" },
  { value: "new-build", label: "New Build" },
  { value: "upgrade", label: "Upgrade" },
  { value: "troubleshooting", label: "Troubleshooting" },
  { value: "maintenance", label: "Maintenance" },
  { value: "installation", label: "Installation" },
] as const

export const CATEGORY_OPTIONS = [
  { value: "all", label: "All Categories" },
  { value: "software", label: "Software Development" },
  { value: "web", label: "Web Design & UI/UX" },
  { value: "mobile", label: "Mobile App" },
] as const

export const SUBCATEGORY_OPTIONS = [
  { value: "all", label: "All Sub Categories" },
  { value: "frontend", label: "Frontend" },
  { value: "backend", label: "Backend" },
  { value: "fullstack", label: "Full Stack" },
] as const

export const SKILL_OPTIONS = [
  { value: "python", label: "Python" },
  { value: "react", label: "React" },
  { value: "django", label: "Django" },
  { value: "typescript", label: "TypeScript" },
  { value: "node", label: "Node.js" },
  { value: "docker", label: "Docker" },
  { value: "kubernetes", label: "Kubernetes" },
  { value: "aws", label: "AWS" },
  { value: "figma", label: "Figma" },
  { value: "postgresql", label: "PostgreSQL" },
  { value: "selenium", label: "Selenium" },
  { value: "solidity", label: "Solidity" },
] as const

export const LANGUAGE_OPTIONS = [
  { value: "english", label: "English" },
  { value: "hindi", label: "Hindi" },
  { value: "bengali", label: "Bengali" },
  { value: "spanish", label: "Spanish" },
] as const

export const MAX_BUDGET = 20000
