"use client"

import React, { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import TabButton from "@/src/components/ui/TabButton"
import { MenuTabs } from "@/src/modules/dashboard/menu/constants"

export default function MenuLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()

  const normalize = (p?: string) => (p ? p.replace(/\/$/, "") : "")

  const getInitialTab = () => {
    const t = MenuTabs.find((tab) => normalize(pathname).startsWith(normalize(tab.url)))
    return t ? t.id : MenuTabs[0].id
  }

  const [activeTab, setActiveTab] = useState(getInitialTab())

  useEffect(() => {
    const t = MenuTabs.find((tab) => normalize(pathname).startsWith(normalize(tab.url)))
    if (t) setActiveTab(t.id)
  }, [pathname])

  const handleClick = (tab: typeof MenuTabs[0]) => {
    setActiveTab(tab.id)
    router.push(tab.url)
  }

  return (
    <div className="py-4">
      <div className="mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {MenuTabs.map((tab) => (
            <div key={tab.id} className="shrink-0">
              <TabButton label={tab.label} isActive={activeTab === tab.id} onClick={() => handleClick(tab)} />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4">{children}</div>
    </div>
  )
}
