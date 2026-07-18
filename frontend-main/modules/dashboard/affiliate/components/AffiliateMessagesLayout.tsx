"use client"

import { useEffect } from "react"
import { useLocale } from "@/src/shared/context/locale.provider"
import DashboardMessagesLayout from "@/src/modules/dashboard/shared/components/DashboardMessagesLayout"
import { AFFILIATE_MESSAGES } from "../data/affiliate-demo-data"
import { useIsDemoAccount } from "@/src/shared/hooks/use-is-demo-account"
import { demoToThread, seedThreadsIfEmpty } from "@/src/shared/lib/messages-store"

export default function AffiliateMessagesLayout() {
  const { t } = useLocale()
  const { isDemo, isReady } = useIsDemoAccount()
  const p = t.affiliatePages.messages

  useEffect(() => {
    if (!isReady || !isDemo) return
    seedThreadsIfEmpty(AFFILIATE_MESSAGES.map((m) => demoToThread("affiliate", m)))
  }, [isReady, isDemo])

  return (
    <DashboardMessagesLayout
      role="affiliate"
      title={p.title}
      subtitle={p.subtitle}
      technicalHref="/affiliate/technical"
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
