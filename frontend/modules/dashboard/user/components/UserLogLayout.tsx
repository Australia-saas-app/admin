"use client"

import { useLocale } from "@/src/shared/context/locale.provider"
import { useIsDemoAccount } from "@/src/shared/hooks/use-is-demo-account"
import { USER_LOG_ENTRIES } from "../data/user-demo-data"

export default function UserLogLayout() {
  const { t } = useLocale()
  const { demoOrEmpty } = useIsDemoAccount()
  const entries = demoOrEmpty(USER_LOG_ENTRIES, [] as typeof USER_LOG_ENTRIES)
  const p = t.userPages.userLog

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 md:p-8 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-1">{p.title}</h3>
      <p className="text-sm text-gray-500 mb-6">{p.subtitle}</p>
      <div className="divide-y divide-gray-100">
        {entries.length === 0 ? (
          <p className="py-6 text-center text-sm text-gray-500">No activity logged yet.</p>
        ) : entries.map((entry) => (
          <div
            key={`${entry.action}-${entry.date}`}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 py-3.5 text-sm"
          >
            <span className="text-gray-700">{entry.action}</span>
            <span className="text-gray-400 shrink-0 text-xs font-mono">{entry.date}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
