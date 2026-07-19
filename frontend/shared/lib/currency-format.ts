import type { Currency } from "@/src/shared/i18n/country"
import type { Locale } from "@/src/shared/i18n/types"

const CURRENCY_META: Record<
  Currency,
  { code: string; locale: string; rateFromUsd: number; maximumFractionDigits: number }
> = {
  usd: { code: "USD", locale: "en-US", rateFromUsd: 1, maximumFractionDigits: 2 },
  inr: { code: "INR", locale: "en-IN", rateFromUsd: 83, maximumFractionDigits: 0 },
  eur: { code: "EUR", locale: "de-DE", rateFromUsd: 0.92, maximumFractionDigits: 2 },
  gbp: { code: "GBP", locale: "en-GB", rateFromUsd: 0.79, maximumFractionDigits: 2 },
}

function intlLocale(locale: Locale, currency: Currency): string {
  if (locale === "hi") return "hi-IN"
  if (locale === "es") return "es-ES"
  return CURRENCY_META[currency].locale
}

export function convertFromUsd(amountUsd: number, currency: Currency): number {
  return amountUsd * CURRENCY_META[currency].rateFromUsd
}

export function formatMoneyFromUsd(
  amountUsd: number,
  currency: Currency,
  locale: Locale = "en"
): string {
  const meta = CURRENCY_META[currency]
  const converted = convertFromUsd(amountUsd, currency)

  try {
    return new Intl.NumberFormat(intlLocale(locale, currency), {
      style: "currency",
      currency: meta.code,
      maximumFractionDigits: meta.maximumFractionDigits,
      minimumFractionDigits: 0,
    }).format(converted)
  } catch {
    return `${meta.code} ${converted.toFixed(meta.maximumFractionDigits)}`
  }
}

export function formatMoneyAmount(
  amount: number,
  sourceCurrency: string,
  displayCurrency: Currency,
  locale: Locale = "en"
): string {
  const normalized = sourceCurrency.toUpperCase()
  let amountUsd = amount

  if (normalized === "INR") amountUsd = amount / CURRENCY_META.inr.rateFromUsd
  else if (normalized === "EUR") amountUsd = amount / CURRENCY_META.eur.rateFromUsd
  else if (normalized === "GBP") amountUsd = amount / CURRENCY_META.gbp.rateFromUsd

  return formatMoneyFromUsd(amountUsd, displayCurrency, locale)
}
