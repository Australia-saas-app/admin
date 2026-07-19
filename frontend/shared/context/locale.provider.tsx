"use client"

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import {
  COUNTRY_COOKIE_KEY,
  COUNTRY_DEFAULT_CURRENCY,
  COUNTRY_STORAGE_KEY,
  CURRENCY_COOKIE_KEY,
  CURRENCY_STORAGE_KEY,
  DEFAULT_COUNTRY,
  type Country,
  type Currency,
  isCountry,
  isCurrency,
} from "@/src/shared/i18n/country"
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE_KEY,
  LOCALE_STORAGE_KEY,
  type Locale,
  type Translations,
  isLocale,
} from "@/src/shared/i18n/types"
import { getTranslations } from "@/src/shared/i18n"

interface LocaleContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  country: Country
  setCountry: (country: Country) => void
  currency: Currency
  setCurrency: (currency: Currency) => void
  t: Translations
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

function readStoredLocale(): Locale {
  if (typeof window === "undefined") return DEFAULT_LOCALE
  const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY)
  return stored && isLocale(stored) ? stored : DEFAULT_LOCALE
}

function readStoredCountry(): Country {
  if (typeof window === "undefined") return DEFAULT_COUNTRY
  const stored = window.localStorage.getItem(COUNTRY_STORAGE_KEY)
  return stored && isCountry(stored) ? stored : DEFAULT_COUNTRY
}

function readStoredCurrency(fallbackCountry: Country = DEFAULT_COUNTRY): Currency {
  if (typeof window === "undefined") return COUNTRY_DEFAULT_CURRENCY[fallbackCountry]
  const stored = window.localStorage.getItem(CURRENCY_STORAGE_KEY)
  if (stored && isCurrency(stored)) return stored
  return COUNTRY_DEFAULT_CURRENCY[fallbackCountry]
}

function persistCountry(country: Country) {
  window.localStorage.setItem(COUNTRY_STORAGE_KEY, country)
  document.cookie = `${COUNTRY_COOKIE_KEY}=${country};path=/;max-age=31536000;SameSite=Lax`
  document.documentElement.dataset.country = country
}

function persistCurrency(currency: Currency) {
  window.localStorage.setItem(CURRENCY_STORAGE_KEY, currency)
  document.cookie = `${CURRENCY_COOKIE_KEY}=${currency};path=/;max-age=31536000;SameSite=Lax`
  document.documentElement.dataset.currency = currency
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE)
  const [country, setCountryState] = useState<Country>(DEFAULT_COUNTRY)
  const [currency, setCurrencyState] = useState<Currency>(COUNTRY_DEFAULT_CURRENCY[DEFAULT_COUNTRY])

  useEffect(() => {
    const storedLocale = readStoredLocale()
    const storedCountry = readStoredCountry()
    const storedCurrency = readStoredCurrency(storedCountry)

    setLocaleState(storedLocale)
    setCountryState(storedCountry)
    setCurrencyState(storedCurrency)
    document.documentElement.lang = storedLocale
    document.documentElement.dataset.country = storedCountry
    document.documentElement.dataset.currency = storedCurrency
  }, [])

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    window.localStorage.setItem(LOCALE_STORAGE_KEY, next)
    document.cookie = `${LOCALE_COOKIE_KEY}=${next};path=/;max-age=31536000;SameSite=Lax`
    document.documentElement.lang = next
  }, [])

  const setCountry = useCallback((next: Country) => {
    setCountryState(next)
    persistCountry(next)

    const defaultCurrency = COUNTRY_DEFAULT_CURRENCY[next]
    setCurrencyState(defaultCurrency)
    persistCurrency(defaultCurrency)
  }, [])

  const setCurrency = useCallback((next: Currency) => {
    setCurrencyState(next)
    persistCurrency(next)
  }, [])

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      setLocale,
      country,
      setCountry,
      currency,
      setCurrency,
      t: getTranslations(locale),
    }),
    [locale, setLocale, country, setCountry, currency, setCurrency]
  )

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale() {
  const context = useContext(LocaleContext)
  if (!context) {
    throw new Error("useLocale must be used within LocaleProvider")
  }
  return context
}
