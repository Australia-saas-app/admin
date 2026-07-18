export const SUPPORTED_COUNTRIES = ["in", "us", "gb", "ca", "jp"] as const
export type Country = (typeof SUPPORTED_COUNTRIES)[number]

export const SUPPORTED_CURRENCIES = ["usd", "inr", "eur", "gbp"] as const
export type Currency = (typeof SUPPORTED_CURRENCIES)[number]

export const DEFAULT_COUNTRY: Country = "in"
export const DEFAULT_CURRENCY: Currency = "inr"

export const COUNTRY_STORAGE_KEY = "app-country"
export const CURRENCY_STORAGE_KEY = "app-currency"
export const COUNTRY_COOKIE_KEY = "app-country"
export const CURRENCY_COOKIE_KEY = "app-currency"

export const COUNTRY_OPTIONS: {
  value: Country
  labelKey: "india" | "usa" | "uk" | "canada" | "japan"
}[] = [
  { value: "in", labelKey: "india" },
  { value: "us", labelKey: "usa" },
  { value: "gb", labelKey: "uk" },
  { value: "ca", labelKey: "canada" },
  { value: "jp", labelKey: "japan" },
]

export const CURRENCY_OPTIONS: {
  value: Currency
  labelKey: "usd" | "inr" | "eur" | "gbp"
}[] = [
  { value: "usd", labelKey: "usd" },
  { value: "inr", labelKey: "inr" },
  { value: "eur", labelKey: "eur" },
  { value: "gbp", labelKey: "gbp" },
]

export const COUNTRY_DEFAULT_CURRENCY: Record<Country, Currency> = {
  in: "inr",
  us: "usd",
  gb: "gbp",
  ca: "usd",
  jp: "usd",
}

export type CountryFilterContext =
  | "careers"
  | "courses"
  | "marketplace"
  | "realEstate"
  | "visaTravel"

/** Maps footer country codes to filter values used in each catalog's mock data. */
const COUNTRY_FILTER_MAP: Record<CountryFilterContext, Partial<Record<Country, string>>> = {
  careers: {
    us: "usa",
    gb: "uk",
    ca: "canada",
    jp: "japan",
  },
  courses: {
    us: "USA",
    ca: "Canada",
    jp: "Japan",
  },
  marketplace: {
    ca: "canada",
    jp: "japan",
  },
  realEstate: {
    us: "USA",
    gb: "UK",
    ca: "Canada",
  },
  visaTravel: {
    in: "India",
    us: "United States",
    gb: "United Kingdom",
    ca: "Canada",
    jp: "Japan",
  },
}

export function isCountry(value: string): value is Country {
  return SUPPORTED_COUNTRIES.includes(value as Country)
}

export function isCurrency(value: string): value is Currency {
  return SUPPORTED_CURRENCIES.includes(value as Currency)
}

export function getCountryFilterValue(
  country: Country,
  context: CountryFilterContext
): string | null {
  return COUNTRY_FILTER_MAP[context][country] ?? null
}

export function getCountryLabelKey(country: Country): (typeof COUNTRY_OPTIONS)[number]["labelKey"] {
  return COUNTRY_OPTIONS.find((option) => option.value === country)?.labelKey ?? "india"
}

export function getCurrencyLabelKey(currency: Currency): (typeof CURRENCY_OPTIONS)[number]["labelKey"] {
  return CURRENCY_OPTIONS.find((option) => option.value === currency)?.labelKey ?? "usd"
}
