"use client"

import React from "react"
import { Inter } from "next/font/google"

const inter = Inter({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
})

interface StatItemProps {
  label: string
  value: string | number
}

const StatItem: React.FC<StatItemProps> = ({ label, value }) => (
  <div className="flex items-center justify-between py-2">
    <span className="text-sm text-gray-500 font-medium">{label}</span>
    <span className="text-sm font-bold text-gray-900 dark:text-white">{value}</span>
  </div>
)

interface StatCardProps {
  title: string
  items: StatItemProps[]
}

const StatCard: React.FC<StatCardProps> = ({ title, items }) => (
  <div className="bg-white dark:bg-slate-900 rounded-lg p-5 shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col h-[320px]">
    <h3 className={`${inter.className} text-[15px] font-bold text-gray-900 dark:text-white mb-4 shrink-0`}>
      {title}
    </h3>
    <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-1">
      {items.map((item, idx) => (
        <StatItem key={idx} label={item.label} value={item.value} />
      ))}
    </div>
  </div>
)

const SystemOverview: React.FC = () => {
  const defaultVal = "12,450K"

  const userStatus = [
    { label: "Total User", value: defaultVal },
    { label: "Total Active User", value: defaultVal },
    { label: "Total Suspend User", value: defaultVal },
    { label: "Total Block User", value: defaultVal },
    { label: "Total Dormant User", value: defaultVal },
    { label: "Total Closed User", value: defaultVal },
  ]

  const affiliateStatus = [
    { label: "Total Affiliate", value: defaultVal },
    { label: "Total Active Affiliate", value: defaultVal },
    { label: "Total Suspend Affiliate", value: defaultVal },
    { label: "Total Block Affiliate", value: defaultVal },
    { label: "Total Dormant Affiliate", value: defaultVal },
    { label: "Total Closed Affiliate", value: defaultVal },
  ]

  const businessStatus = [
    { label: "Total Business", value: defaultVal },
    { label: "Total Pending Business", value: defaultVal },
    { label: "Total Inactive Business", value: defaultVal },
    { label: "Total Active Business", value: defaultVal },
    { label: "Total Suspend Business", value: defaultVal },
    { label: "Total Block Business", value: defaultVal },
    { label: "Total Dormant Business", value: defaultVal },
    { label: "Total Closed Business", value: defaultVal },
  ]

  const adminStatus = [
    { label: "Total Admin", value: defaultVal },
    { label: "Total Active Admin", value: defaultVal },
    { label: "Total Suspend Admin", value: defaultVal },
    { label: "Total Block Admin", value: defaultVal },
    { label: "Total Closed Admin", value: defaultVal },
  ]

  const technologyStatus = [
    { label: "Total project", value: defaultVal },
    { label: "Total pending", value: defaultVal },
    { label: "Total payment", value: defaultVal },
    { label: "Total Waiting", value: defaultVal },
    { label: "Total Delayed", value: defaultVal },
    { label: "Total Expired", value: defaultVal },
    { label: "Total Accepted", value: defaultVal },
    { label: "Total In Progress", value: defaultVal },
    { label: "Total On Hold", value: defaultVal },
    { label: "Total In Review", value: defaultVal },
    { label: "Total Completed", value: defaultVal },
    { label: "Total Refunded", value: defaultVal },
    { label: "Total Cancelled", value: defaultVal },
  ]

  const technologyService = [
    { label: "Category", value: "12" },
    { label: "Sub category", value: "45" },
    { label: "Skills", value: "505K" },
  ]

  return (
    <div className="px-4 sm:px-6 pt-2 pb-6 w-full max-w-[1600px] mx-auto min-h-[70vh]">
      <div className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <StatCard title="User Status" items={userStatus} />
          <StatCard title="Affiliate Status" items={affiliateStatus} />
          <StatCard title="Business Status" items={businessStatus} />
          <StatCard title="Admin Status" items={adminStatus} />
          
          <StatCard title="Technology Status" items={technologyStatus} />
          <StatCard title="Technology Service" items={technologyService} />
        </div>
      </div>
    </div>
  )
}

export default SystemOverview
