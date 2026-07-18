import type {
  Property,
  PropertyCategory,
  PropertyStatus,
  PropertySubCategory,
  PropertyType,
} from "../types"

const pseudoRandom = (seed: number) => {
  const x = Math.sin(seed + 1) * 10000
  return x - Math.floor(x)
}

const TITLES = [
  "Europe Tour Packages From India",
  "The House Is Very Beautiful, A House That...",
  "Luxury Villa with Ocean View",
  "Modern Downtown Apartment",
  "Cozy Suburban Cottage",
  "High-Rise Luxury Condo",
  "Spacious Countryside Ranch",
  "Elegant Colonial Estate",
  "Waterfront Penthouse Suite",
  "Charming Brick Townhouse",
  "Renovated Historic Brownstone",
  "Sunlit Garden Family Home",
  "Minimalist Smart Residence",
  "Lakefront Retreat Property",
  "Hilltop Mansion with Pool",
  "Urban Loft with Skyline Views",
  "Craftsman Bungalow Classic",
  "Mediterranean Style Villa",
  "Executive Corporate Housing",
  "Family-Friendly Corner Lot",
  "Premium Gated Community Home",
  "Downtown Studio With City Views",
  "Suburban Family Estate",
  "Beachfront Paradise Home",
  "Mountain View Chalet",
]

const STREETS = [
  "7843 E Valley View Rd",
  "123 Ocean Drive",
  "456 Metro Ave",
  "89 Maple Street",
  "200 Skyline Blvd",
  "555 Country Rd",
  "1420 Palm Canyon Dr",
  "88 Harbor View Ln",
  "301 Ridgecrest Way",
  "19 Willow Creek Ct",
  "6400 Sunset Strip",
  "2100 Lake Shore Dr",
  "77 Birchwood Ave",
  "915 Canyon Ridge Rd",
  "48 Meadowbrook Pl",
  "1120 Pacific Coast Hwy",
  "902 Broadway Ave",
  "450 Elm Street",
]

const LOCATIONS = [
  { city: "Scottsdale", state: "AZ", zip: "85250", country: "USA" },
  { city: "Miami", state: "FL", zip: "33139", country: "USA" },
  { city: "New York", state: "NY", zip: "10001", country: "USA" },
  { city: "Austin", state: "TX", zip: "78704", country: "USA" },
  { city: "Chicago", state: "IL", zip: "60601", country: "USA" },
  { city: "Nashville", state: "TN", zip: "37201", country: "USA" },
  { city: "Los Angeles", state: "CA", zip: "90001", country: "USA" },
  { city: "Seattle", state: "WA", zip: "98101", country: "USA" },
  { city: "Denver", state: "CO", zip: "80202", country: "USA" },
  { city: "Boston", state: "MA", zip: "02108", country: "USA" },
  { city: "Phoenix", state: "AZ", zip: "85001", country: "USA" },
  { city: "Dallas", state: "TX", zip: "75201", country: "USA" },
  { city: "San Diego", state: "CA", zip: "92101", country: "USA" },
  { city: "Portland", state: "OR", zip: "97201", country: "USA" },
  { city: "Atlanta", state: "GA", zip: "30301", country: "USA" },
  { city: "Toronto", state: "ON", zip: "M5H 2N2", country: "Canada" },
  { city: "Vancouver", state: "BC", zip: "V6B 1A1", country: "Canada" },
  { city: "London", state: "ENG", zip: "SW1A 1AA", country: "UK" },
  { city: "Paris", state: "IDF", zip: "75001", country: "France" },
  { city: "Rome", state: "LAZ", zip: "00100", country: "Italy" },
]

const REGIONS = [
  "North America",
  "Europe",
  "Asia Pacific",
  "Middle East",
  "South America",
  "Africa",
  "Caribbean",
  "Oceania",
]

const NEARBY_POOL = [
  "Italy",
  "France",
  "Switzerland",
  "Germany",
  "Austria",
  "Spain",
  "Portugal",
  "Greece",
  "Netherlands",
  "Belgium",
  "Downtown",
  "Midtown",
  "Waterfront",
  "Historic District",
  "Suburbs",
  "Business Park",
]

const IMAGES = [
  "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1570129477492-45c003eaa271?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=600&q=80",
]

const ALL_FEATURES = [
  "Deck",
  "Dishwasher",
  "Door Person",
  "Gym",
  "Pool",
  "Smart Home",
  "Garage",
  "Fireplace",
  "Garden",
  "Solar",
  "Balcony",
  "Rooftop",
  "Doorman",
  "Elevator",
  "Wine Cellar",
  "Home Office",
  "Pet Friendly",
  "Central AC",
]

const CATEGORIES: PropertyCategory[] = ["Buy", "Rent", "Mortgage"]
const SUB_CATEGORIES: PropertySubCategory[] = ["Residential", "Commercial"]
const PROPERTY_TYPES: PropertyType[] = ["House", "Villa", "Apartment", "Condo", "Townhouse"]
const STATUSES: PropertyStatus[] = ["Available", "Waiting", "Sold", "Pending"]

const pick = <T,>(arr: T[], seed: number) => arr[Math.floor(pseudoRandom(seed) * arr.length)]

const buildFeatures = (seed: number) => {
  const count = 4 + Math.floor(pseudoRandom(seed) * 6)
  const shuffled = [...ALL_FEATURES].sort((a, b) => pseudoRandom(seed + a.charCodeAt(0)) - 0.5)
  return shuffled.slice(0, count)
}

const buildNearby = (seed: number) => {
  const count = 4 + Math.floor(pseudoRandom(seed) * 4)
  const shuffled = [...NEARBY_POOL].sort((a, b) => pseudoRandom(seed + a.length) - 0.5)
  return shuffled.slice(0, count)
}

const buildPrice = (seed: number, category: PropertyCategory) => {
  const roll = pseudoRandom(seed)
  if (category === "Rent") return Math.round(800 + roll * 12000)
  if (roll < 0.12) return Math.round(500000 + roll * 5000000)
  if (roll < 0.35) return Math.round(150000 + roll * 800000)
  return Math.round(8000 + roll * 450000)
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

export const MOCK_PROPERTIES: Property[] = Array.from({ length: 200 }, (_, index) => {
  const seed = index + 1
  const category = pick(CATEGORIES, seed * 3)
  const subCategory = pick(SUB_CATEGORIES, seed * 5)
  const propertyType = pick(PROPERTY_TYPES, seed * 7)
  const location = pick(LOCATIONS, seed * 11)
  const price = buildPrice(seed * 13, category)
  const beds = 1 + Math.floor(pseudoRandom(seed * 17) * 6)
  const baths = 1 + Math.floor(pseudoRandom(seed * 19) * 4)
  const kitchens = 1 + Math.floor(pseudoRandom(seed * 23) * 2)
  const sqFt = 650 + Math.floor(pseudoRandom(seed * 29) * 6200)
  const yearBuilt = 1985 + Math.floor(pseudoRandom(seed * 31) * 40)
  const postedDaysAgo = Math.floor(pseudoRandom(seed * 37) * 180)
  const nights = 3 + Math.floor(pseudoRandom(seed * 41) * 8)
  const days = nights + 1
  const validMonth = MONTHS[Math.floor(pseudoRandom(seed * 53) * 12)]
  const validDay = 1 + Math.floor(pseudoRandom(seed * 59) * 28)

  return {
    id: index + 1,
    title: pick(TITLES, seed * 41),
    category,
    subCategory,
    propertyType,
    currentStatus: pick(STATUSES, seed * 61),
    price,
    beds,
    baths,
    kitchens,
    sqFt,
    country: location.country,
    state: location.state,
    city: location.city,
    zip: location.zip,
    street: pick(STREETS, seed * 43),
    features: buildFeatures(seed * 47),
    yearBuilt,
    postedDaysAgo,
    image: IMAGES[index % IMAGES.length],
    duration: `${days} Days ${nights} Nights`,
    parking: pick(["Garage", "Street", "Driveway", "Valet", "None"], seed * 67),
    moveInDate: pick(["Immediate", "Within 30 Days", "Within 60 Days", "Q1 2026", "Q2 2026"], seed * 71),
    destinationRegion: pick(REGIONS, seed * 73),
    propertyClass: pick(["Premium", "Standard", "Economy", "Luxury"], seed * 79),
    listingCategory: pick(["Featured", "New Listing", "Price Reduced", "Open House"], seed * 83),
    transactionType: pick(["Cash", "Mortgage", "Lease", "Rent-to-Own"], seed * 89),
    validTill: `${validDay} ${validMonth} 2026`,
    nearbyAreas: buildNearby(seed * 97),
  }
})

export const FILTER_OPTIONS = {
  categories: CATEGORIES,
  subCategories: SUB_CATEGORIES,
  currentStatuses: STATUSES,
  propertyTypes: PROPERTY_TYPES,
  countries: [...new Set(LOCATIONS.map((l) => l.country))],
  states: [...new Set(LOCATIONS.map((l) => l.state))].sort(),
  cities: [...new Set(LOCATIONS.map((l) => l.city))].sort(),
  zips: [...new Set(LOCATIONS.map((l) => l.zip))].sort(),
  durations: ["3 Days 2 Nights", "5 Days 4 Nights", "7 Days 6 Nights", "10 Days 9 Nights", "14 Days 13 Nights"],
  parking: ["Garage", "Street", "Driveway", "Valet", "None"],
  moveInDates: ["Immediate", "Within 30 Days", "Within 60 Days", "Q1 2026", "Q2 2026"],
  destinationRegions: REGIONS,
  houseTypes: ["Detached", "Semi-Detached", "Bungalow", "Cottage", "Ranch"],
  apartmentTypes: ["Studio", "Loft", "Penthouse", "Duplex", "High-Rise"],
  commercialTypes: ["Office", "Retail", "Warehouse", "Mixed Use", "Industrial"],
  propertyClasses: ["Premium", "Standard", "Economy", "Luxury"],
  listingCategories: ["Featured", "New Listing", "Price Reduced", "Open House"],
  transactionTypes: ["Cash", "Mortgage", "Lease", "Rent-to-Own"],
  beds: ["1", "2", "3", "4", "5", "6+"],
  bathrooms: ["1", "2", "3", "4+"],
  kitchens: ["1", "2+"],
  sizeRanges: ["< 1000", "1000-2000", "2000-4000", "4000+"],
  features: ALL_FEATURES,
}

export function formatPrice(property: Property): string {
  if (property.category === "Rent") {
    return `$${property.price.toLocaleString()} /mo`
  }
  return `$${property.price.toLocaleString()} USD`
}

export function formatPostedLabel(daysAgo: number): string {
  if (daysAgo === 0) return "Today"
  if (daysAgo === 1) return "1 Day Ago"
  if (daysAgo < 7) return `${daysAgo} Day${daysAgo > 1 ? "s" : ""} Ago`
  if (daysAgo < 30) return `${Math.floor(daysAgo / 7)} Week${daysAgo >= 14 ? "s" : ""} Ago`
  if (daysAgo < 365) return `${Math.floor(daysAgo / 30)} Month${daysAgo >= 60 ? "s" : ""} Ago`
  return `${Math.floor(daysAgo / 365)} Year${daysAgo >= 730 ? "s" : ""} Ago`
}

export function formatResultCount(total: number): string {
  if (total >= 2000) return "2K"
  if (total >= 1000) return `${(total / 1000).toFixed(1)}K`
  return String(total)
}

export const TOTAL_CATALOG_SIZE = 2000
