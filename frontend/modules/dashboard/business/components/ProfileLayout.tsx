"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { ProfileTabs } from "../constants/profile.constant"
import ProfilePageLayout from "./ProfilePageLayout"

const ProfileLayout = () => {
  const router = useRouter()
  const pathname = usePathname()

  const resolveActiveTab = () => {
    const match = ProfileTabs.find((tab) => pathname === tab.url)
    return match?.id ?? ProfileTabs[0].id
  }

  const [activeTab, setActiveTab] = useState(resolveActiveTab)

  useEffect(() => {
    setActiveTab(resolveActiveTab())
  }, [pathname])

  const ActiveComponent =
    ProfileTabs.find((tab) => tab.id === activeTab)?.component ?? ProfilePageLayout

  const handleTabClick = (tab: (typeof ProfileTabs)[0]) => {
    setActiveTab(tab.id)
    router.push(tab.url)
  }

  return (
    <div className="flex w-full flex-col">
      <div className="mb-2">
        <h1 className="text-xl font-semibold text-gray-900">Profile</h1>
        <p className="mt-1 text-sm text-gray-500">View and manage your business information.</p>
      </div>
      <div className="mb-6 flex flex-wrap gap-3">
        {ProfileTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => handleTabClick(tab)}
            className={`rounded-md px-5 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-[#5D7293] text-white shadow-sm"
                : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <ActiveComponent />
    </div>
  )
}

export default ProfileLayout
