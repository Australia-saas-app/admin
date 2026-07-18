export type VisaRegion =
  | "ALL"
  | "Asia"
  | "Europe"
  | "Africa"
  | "North America"
  | "South America"
  | "Australia"
  | "Antarctica"

export interface VisaDestination {
  id: string
  country: string
  region: Exclude<VisaRegion, "ALL">
}

export const VISA_REGIONS: { label: VisaRegion; count: number }[] = [
  { label: "ALL", count: 97 },
  { label: "Asia", count: 56 },
  { label: "Europe", count: 69 },
  { label: "Africa", count: 65 },
  { label: "North America", count: 69 },
  { label: "South America", count: 65 },
  { label: "Australia", count: 36 },
  { label: "Antarctica", count: 36 },
]

const REGION_COUNTRIES: Record<Exclude<VisaRegion, "ALL">, string[]> = {
  Asia: [
    "Japan",
    "Singapore",
    "Thailand",
    "India",
    "China",
    "South Korea",
    "Malaysia",
    "Vietnam",
    "Indonesia",
    "Philippines",
    "UAE",
    "Saudi Arabia",
  ],
  Europe: [
    "London",
    "Paris",
    "Berlin",
    "Rome",
    "Madrid",
    "Amsterdam",
    "Vienna",
    "Prague",
    "Stockholm",
    "Dublin",
    "Lisbon",
    "Athens",
  ],
  Africa: [
    "Cairo",
    "Nairobi",
    "Lagos",
    "Johannesburg",
    "Casablanca",
    "Accra",
    "Tunis",
    "Addis Ababa",
    "Dakar",
    "Kampala",
  ],
  "North America": [
    "New York",
    "Toronto",
    "Los Angeles",
    "Mexico City",
    "Chicago",
    "Vancouver",
    "Miami",
    "Houston",
    "Montreal",
    "Dallas",
  ],
  "South America": [
    "São Paulo",
    "Buenos Aires",
    "Lima",
    "Bogotá",
    "Santiago",
    "Caracas",
    "Montevideo",
    "Quito",
    "La Paz",
    "Asunción",
  ],
  Australia: ["Sydney", "Melbourne", "Brisbane", "Perth", "Auckland", "Wellington"],
  Antarctica: ["McMurdo", "Palmer Station", "Rothera"],
}

function buildCatalog(): VisaDestination[] {
  const items: VisaDestination[] = []
  let id = 1

  ;(Object.entries(REGION_COUNTRIES) as [Exclude<VisaRegion, "ALL">, string[]][]).forEach(
    ([region, countries]) => {
      countries.forEach((country) => {
        items.push({ id: String(id++), country, region })
        // duplicate entries to reach catalog size per design
        if (region === "Asia" || region === "Europe") {
          items.push({ id: String(id++), country, region })
        }
      })
    }
  )

  return items
}

export const VISA_CATALOG = buildCatalog()
export const TOTAL_VISA_RESULTS = 97
