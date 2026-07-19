"use client"

import React, { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import TabButton from "@/src/components/ui/TabButton"
import { ProfileTabs } from "../constants/profile.constant"
import ProfilePageLayout from "./ProfilePageLayout"

const ProfileLayout = () => {
 const router = useRouter();
  const pathname = usePathname();
  
  // Initialize activeTab based on current pathname
  const getInitialTab = () => {
    // Match by suffix because the app routes include a /dashboard prefix
    const currentTab = ProfileTabs.find((tab) => pathname?.endsWith(tab.url) || pathname === `/dashboard${tab.url}`);
    return currentTab ? currentTab.id : ProfileTabs[0].id;
  };
  
  const [activeTab, setActiveTab] = useState(getInitialTab());

  // Sync active tab with current route
  useEffect(() => {
    const currentTab = ProfileTabs.find(
      (tab) => pathname === tab.url || pathname?.endsWith(tab.url)
    )
    if (currentTab) {
      setActiveTab(currentTab.id)
    }
  }, [pathname])

  const ActiveComponent = ProfileTabs.find((tab) => tab.id === activeTab)?.component || ProfilePageLayout

  const handleTabClick = (tab: typeof ProfileTabs[0]) => {
    setActiveTab(tab.id)
    router.push(tab.url)
  }

  return (
   <div className="flex flex-col">
             {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-6">
        {ProfileTabs.map((tab) => (
          <TabButton
            key={tab.id}
            label={tab.label}
            isActive={activeTab === tab.id}
            onClick={() => handleTabClick(tab)}
          />
        ))}
      </div>
         <div className="mt-4">
        <ActiveComponent
        />
      </div>
       
      </div>
  )
}

export default ProfileLayout