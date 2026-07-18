export type VisaTravelStatus = "Waiting" | "Available" | "Sold" | "Pending"

export type VisaTravelSort = "Oldest" | "Newest" | "Lowest Price" | "Highest Price"

export interface VisaTravelFilters {
  propertyType: string
  propertyStatus: string
  currentStatus: string
  address: string
  country: string
  state: string
  city: string
  zipCode: string
  beds: string
  bathroom: string
  kitchen: string
  sizeRange: string
  features: string
  priceMin: number
  priceMax: number
}

export interface VisaTravelListing {
  id: string
  title: string
  price: number
  currency: string
  image: string
  currentStatus: VisaTravelStatus
  duration: string
  countries: string[]
  features: string[]
  validTill: string
  travelClass?: string
  passengers?: number
  address: string
  postedDaysAgo: number
  propertyType: string
  propertyStatus: string
  country: string
  state: string
  city: string
  zipCode: string
  beds: number
  bathroom: number
  kitchen: number
  sqFt: number
}

export const DEFAULT_VISA_TRAVEL_FILTERS: VisaTravelFilters = {
  propertyType: "",
  propertyStatus: "",
  currentStatus: "",
  address: "",
  country: "",
  state: "",
  city: "",
  zipCode: "",
  beds: "",
  bathroom: "",
  kitchen: "",
  sizeRange: "",
  features: "",
  priceMin: 100,
  priceMax: 20000000,
}
