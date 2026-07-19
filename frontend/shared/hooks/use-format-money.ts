"use client"

import { useCallback } from "react"
import { useLocale } from "@/src/shared/context/locale.provider"
import { formatMoneyAmount, formatMoneyFromUsd } from "@/src/shared/lib/currency-format"

export function useFormatMoney() {
  const { currency, locale } = useLocale()

  const formatUsd = useCallback(
    (amountUsd: number) => formatMoneyFromUsd(amountUsd, currency, locale),
    [currency, locale]
  )

  const formatPrice = useCallback(
    (amount: number, sourceCurrency = "USD") =>
      formatMoneyAmount(amount, sourceCurrency, currency, locale),
    [currency, locale]
  )

  return { formatUsd, formatPrice, currency, locale }
}
