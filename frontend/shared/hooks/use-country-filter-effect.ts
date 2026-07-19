"use client"

import { useEffect, useRef } from "react"
import { useLocale } from "@/src/shared/context/locale.provider"
import { getCountryFilterValue, type CountryFilterContext } from "@/src/shared/i18n/country"

export function useCountryFilterEffect(
  context: CountryFilterContext,
  onApply: (value: string | null) => void
) {
  const { country } = useLocale()
  const onApplyRef = useRef(onApply)
  onApplyRef.current = onApply

  useEffect(() => {
    onApplyRef.current(getCountryFilterValue(country, context))
  }, [country, context])
}
