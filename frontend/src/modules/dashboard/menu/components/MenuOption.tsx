'use client';
import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import TabButton from "@/src/components/ui/TabButton";
import { MenuTabs } from "../constants";
import GlobalBranchLayout from "./GlobalBranchLayout";
const MenuOption = () => {
  const router = useRouter();
  const pathname = usePathname();

  // Normalize path (remove trailing slash) to improve matching
  const normalize = (p?: string) => (p ? p.replace(/\/$/, "") : "")

  // Initialize activeTab based on current pathname
  const getInitialTab = () => {
    const currentTab = MenuTabs.find((tab) => normalize(pathname).startsWith(normalize(tab.url)));
    return currentTab ? currentTab.id : MenuTabs[0].id;
  };

  const [activeTab, setActiveTab] = useState(getInitialTab());

  // Sync active tab with current route
  useEffect(() => {
    const currentTab = MenuTabs.find((tab) => normalize(pathname).startsWith(normalize(tab.url)));
    if (currentTab) {
      setActiveTab(currentTab.id);
    }
  }, [pathname]);

  const ActiveComponent = MenuTabs.find((tab) => tab.id === activeTab)?.component || GlobalBranchLayout;

  const handleTabClick = (tab: typeof MenuTabs[0]) => {
    setActiveTab(tab.id);
    router.push(tab.url);
  };

  return (
    <div className="w-full">
      {/* Tab Navigation (horizontally scrollable on small screens) */}
      <div className="mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {MenuTabs.map((tab) => (
            <div key={tab.id} className="shrink-0">
              <TabButton
                label={tab.label}
                isActive={activeTab === tab.id}
                onClick={() => handleTabClick(tab)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Active Tab Content */}
      <div className="mt-4">
        <ActiveComponent
        />
      </div>
    </div>
  );
}

export default MenuOption