export type PropertyCategory = "Buy" | "Rent" | "Mortgage"
export type PropertySubCategory = "Residential" | "Commercial"
export type PropertyType = "House" | "Villa" | "Apartment" | "Condo" | "Townhouse"
export type PropertyStatus = "Available" | "Waiting" | "Sold" | "Pending"

export interface Property {
  id: number
  title: string
  category: PropertyCategory
  subCategory: PropertySubCategory
  propertyType: PropertyType
  currentStatus: PropertyStatus
  price: number
  beds: number
  baths: number
  kitchens: number
  sqFt: number
  country: string
  state: string
  city: string
  zip: string
  street: string
  features: string[]
  yearBuilt: number
  postedDaysAgo: number
  image: string
  duration: string
  parking: string
  moveInDate: string
  destinationRegion: string
  propertyClass: string
  listingCategory: string
  transactionType: string
  validTill: string
  nearbyAreas: string[]
}

export interface RealEstateFilters {
  category: string
  subCategory: string
  currentStatus: string
  country: string
  state: string
  city: string
  zip: string
  duration: string
  parking: string
  moveInDate: string
  destinationRegion: string
  houseType: string
  apartmentType: string
  commercialType: string
  propertyClass: string
  listingCategory: string
  transactionType: string
  beds: string
  bathroom: string
  kitchen: string
  sizeRange: string
  features: string
  priceMin: number
  priceMax: number
}

export const DEFAULT_FILTERS: RealEstateFilters = {
  category: "",
  subCategory: "",
  currentStatus: "",
  country: "",
  state: "",
  city: "",
  zip: "",
  duration: "",
  parking: "",
  moveInDate: "",
  destinationRegion: "",
  houseType: "",
  apartmentType: "",
  commercialType: "",
  propertyClass: "",
  listingCategory: "",
  transactionType: "",
  beds: "",
  bathroom: "",
  kitchen: "",
  sizeRange: "",
  features: "",
  priceMin: 100,
  priceMax: 200_000_000,
}

export type SortOption = "Oldest" | "Newest" | "Lowest Price" | "Highest Price"
