"use client";

import { useCallback } from "react";
import { useLocale } from "@/src/shared/context/locale.provider";
import {
  formatDateShort as formatDateShortBase,
  formatRelativeTime as formatRelativeTimeBase,
} from "@/src/utils/formatters";
import type { Locale } from "@/src/shared/i18n/types";

const LOCALE_TO_BCP47: Record<Locale, string> = {
  en: "en-US",
  hi: "hi-IN",
  es: "es-ES",
};

/** Locale-aware date helpers bound to the active LocaleProvider locale. */
export function useFormatDate() {
  const { locale } = useLocale();
  const bcp47 = LOCALE_TO_BCP47[locale] ?? "en-US";

  const formatDateShort = useCallback((iso: string) => formatDateShortBase(iso, bcp47), [bcp47]);

  const formatRelativeTime = useCallback(
    (iso: string) => formatRelativeTimeBase(iso, bcp47),
    [bcp47]
  );

  return { formatDateShort, formatRelativeTime, locale: bcp47 };
}
