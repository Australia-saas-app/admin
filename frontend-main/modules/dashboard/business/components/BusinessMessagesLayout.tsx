"use client"

import { useEffect } from "react"
import { useLocale } from "@/src/shared/context/locale.provider"
import DashboardMessagesLayout from "@/src/modules/dashboard/shared/components/DashboardMessagesLayout"
import { BUSINESS_MESSAGES } from "../data/business-demo-data"
import { useIsDemoAccount } from "@/src/shared/hooks/use-is-demo-account"
import { demoToThread, seedThreadsIfEmpty } from "@/src/shared/lib/messages-store"

export default function BusinessMessagesLayout() {
  const { t } = useLocale()
  const { isDemo, isReady } = useIsDemoAccount()
  const p = t.businessPages.messages

  useEffect(() => {
    if (!isReady || !isDemo) return
    seedThreadsIfEmpty(BUSINESS_MESSAGES.map((m) => demoToThread("business", m)))
  }, [isReady, isDemo])

  return (
    <DashboardMessagesLayout
      role="business"
      title={p.title}
      subtitle={p.subtitle}
      technicalHref="/business/technical"
      labels={{
        total: p.total,
        unread: p.unread,
        search: p.search,
        unreadOnly: p.unreadOnly,
        from: p.from,
        project: "Category",
        reply: p.reply,
        archive: p.archive,
        selectMessage: p.selectMessage,
        send: "Send message",
        writeMessage: "Write your message…",
      }}
    />
  )
}
