"use client"

import React, { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import TabButton from "@/src/components/ui/TabButton"
import { PlatformTabs } from "@/src/modules/dashboard/platform/constants"

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()

  const normalize = (p?: string) => (p ? p.replace(/\/$/, "") : "")

  const getInitialTab = () => {
    const t = PlatformTabs.find((tab) => normalize(pathname).startsWith(normalize(tab.url)))
    return t ? t.id : PlatformTabs[0].id
  }

  const [activeTab, setActiveTab] = useState(getInitialTab())

  useEffect(() => {
    const t = PlatformTabs.find((tab) => normalize(pathname).startsWith(normalize(tab.url)))
    if (t) setActiveTab(t.id)
  }, [pathname])

  const handleClick = (tab: typeof PlatformTabs[0]) => {
    setActiveTab(tab.id)
    router.push(tab.url)
  }

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="mb-8 overflow-hidden rounded-xl border bg-card/30 backdrop-blur-md shadow-sm p-2">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-0">
          {PlatformTabs.map((tab) => (
            <div key={tab.id} className="relative shrink-0">
              <TabButton 
                label={tab.label} 
                isActive={activeTab === tab.id} 
                onClick={() => handleClick(tab)} 
              />
              {activeTab === tab.id && (
                <div className="absolute -bottom-1 left-0 right-0 h-1 bg-primary rounded-full animate-in slide-in-from-bottom-1 duration-300" />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-2 transition-all duration-300 ease-in-out">
        {children}
      </div>
    </div>
  )
}
