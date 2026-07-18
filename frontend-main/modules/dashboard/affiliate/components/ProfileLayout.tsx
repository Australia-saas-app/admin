"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { ProfileTabs } from "../constants/profile.constant"
import AffiliaProAffiliateProfilePage from "./AffiliaProAffiliateProfilePage"
import AffiliateLogLayout from "./AffiliateLogLayout"

const ProfileLayout = () => {
  const pathname = usePathname()
  const normalized = pathname.replace(/^\/dashboard/, "")

  const resolveActiveTab = () => {
    const match = ProfileTabs.find((tab) => normalized === tab.url || pathname === tab.url)
    return match?.id ?? ProfileTabs[0].id
  }

  const [activeTab, setActiveTab] = useState(resolveActiveTab)

  useEffect(() => {
    setActiveTab(resolveActiveTab())
  }, [pathname])

  if (activeTab === "affiliate-log") {
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Affiliate Log</h1>
            <p className="mt-1 text-sm text-gray-500">Activity history for your affiliate account.</p>
          </div>
          <Link
            href="/affiliate/profile"
            className="text-sm font-semibold text-indigo-600 hover:underline"
          >
            ← Back to Profile Settings
          </Link>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm md:p-6">
          <AffiliateLogLayout />
        </div>
      </div>
    )
  }

  return <AffiliaProAffiliateProfilePage />
}

export default ProfileLayout
