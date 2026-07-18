"use client"

import dynamic from "next/dynamic"
import { Suspense, useEffect, useState, type ComponentType } from "react"
import { usePathname, useRouter } from "next/navigation"
import { ProfileTabs, type ProfileTabId } from "../constants/profile.constant"

const TabLoading = () => (
  <div className="flex items-center justify-center py-16 text-sm text-gray-500">
    Loading...
  </div>
)

const TAB_COMPONENTS: Record<ProfileTabId, ComponentType> = {
  profile: dynamic(() => import("./ProfilePageLayout"), {
    loading: TabLoading,
  }),
  "user-log": dynamic(() => import("./UserLogLayout"), {
    loading: TabLoading,
  }),
}

const ProfileLayout = () => {
  const router = useRouter()
  const pathname = usePathname()

  const resolveActiveTab = (): ProfileTabId => {
    const match = ProfileTabs.find((tab) => pathname === tab.url)
    return match?.id ?? ProfileTabs[0].id
  }

  const [activeTab, setActiveTab] = useState<ProfileTabId>(resolveActiveTab)

  useEffect(() => {
    const match = ProfileTabs.find((tab) => pathname === tab.url)
    setActiveTab(match?.id ?? ProfileTabs[0].id)
  }, [pathname])

  const ActiveComponent = TAB_COMPONENTS[activeTab] ?? TAB_COMPONENTS.profile

  const handleTabClick = (tab: (typeof ProfileTabs)[number]) => {
    setActiveTab(tab.id)
    router.push(tab.url)
  }

  return (
    <div className="flex flex-col w-full">
      <div className="mb-2">
        <h1 className="text-xl font-semibold text-gray-900">Profile</h1>
        <p className="text-sm text-gray-500 mt-1">View and manage your personal information.</p>
      </div>
      <div className="flex flex-wrap gap-3 mb-6">
        {ProfileTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => handleTabClick(tab)}
            className={`px-5 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-[#5D7293] text-white shadow-sm"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="w-full">
        <Suspense fallback={<TabLoading />}>
          <ActiveComponent />
        </Suspense>
      </div>
    </div>
  )
}

export default ProfileLayout
