"use client"

import { useEffect } from "react"
import { useLocale } from "@/src/shared/context/locale.provider"
import { useIsDemoAccount } from "@/src/shared/hooks/use-is-demo-account"
import DashboardMessagesLayout from "@/src/modules/dashboard/shared/components/DashboardMessagesLayout"
import { USER_MESSAGES } from "../data/user-demo-data"
import { demoToThread, seedThreadsIfEmpty } from "@/src/shared/lib/messages-store"

export default function UserMessagesLayout() {
  const { t } = useLocale()
  const { isDemo, isReady } = useIsDemoAccount()
  const p = t.userPages.messages

  useEffect(() => {
    if (!isReady || !isDemo) return
    seedThreadsIfEmpty(USER_MESSAGES.map((m) => demoToThread("user", m)))
  }, [isReady, isDemo])

  return (
    <DashboardMessagesLayout
      role="user"
      title={p.title}
      subtitle={p.subtitle}
      technicalHref="/user/technical"
      labels={{
        total: p.total,
        unread: p.unread,
        search: p.search,
        unreadOnly: p.unreadOnly,
        from: p.from,
        project: p.project,
        reply: p.reply,
        archive: p.archive,
        selectMessage: p.selectMessage,
        send: "Send message",
        writeMessage: "Write your message…",
      }}
    />
  )
}
