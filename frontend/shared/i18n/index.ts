import type { Locale, Translations } from "./types"
import { en } from "./locales/en"
import { hi } from "./locales/hi"
import { es } from "./locales/es"

export const translations: Record<Locale, Translations> = {
  en,
  hi,
  es,
}

export function getTranslations(locale: Locale): Translations {
  return translations[locale] ?? translations.en
}

export * from "./country"
