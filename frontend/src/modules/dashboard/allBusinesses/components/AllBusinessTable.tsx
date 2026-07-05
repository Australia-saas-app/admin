"use client"

import React, { useMemo, useState } from "react"

import { Pagination } from "@/src/components/ui/pagination"
import type { AffiliateRow } from "./affiliates.types"
import BusinessTable from "./BusinessTable"
import BusinessToolbar from "./BusinessToolbar"

const businessNames = [
  "Tech Solutions Inc", "Global Retail Co", "Digital Services Ltd",
  "Cloud Systems Corp", "Smart Logistics", "E-Commerce Hub",
  "Finance Pro Services", "Market Solutions", "Innovation Labs",
  "Enterprise Systems", "NextGen Technology", "Business Solutions",
]

const businessTypes = ["Technology", "Retail", "Services", "Construction", "Finance", "Logistics"]

const demoAffiliates: AffiliateRow[] = Array.from({ length: 37 }).map((_, i) => ({
  id: String(i + 1),
  affiliateId: String(10001 + i).padStart(5, "0"),
  industryType: businessNames[i % businessNames.length],
  totalCustomer: (1000 + i * 100),
  referrals: (5000 + i * 500),
  commissionRate: `${(2 + (i % 3))}%`,
  earningsAmount: `${(10000 + i * 1000)} USD`,
  level: 1 + (i % 6),
  status: (i % 5 === 0
    ? "BLOCK"
    : i % 5 === 1
      ? "DORMANT"
      : i % 5 === 2
        ? "CLOSED"
        : i % 5 === 3
          ? "SUSPEND"
          : "ACTIVE") as AffiliateRow["status"],
}))

const AllBusinessTable: React.FC = () => {
  const [query, setQuery] = useState("")
  const [country, setCountry] = useState("All")
  const [businessType, setBusinessType] = useState("All")
  const [status, setStatus] = useState("All")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let arr = demoAffiliates
    if (country !== "All") {
      arr = arr.filter((_, idx) => (country === "Japan" ? idx % 2 === 0 : idx % 2 === 1))
    }
    if (businessType !== "All") arr = arr.filter((a) => (a.industryType || "").toLowerCase().includes(businessType.toLowerCase()))
    if (status !== "All") arr = arr.filter((a) => a.status === status)
    if (q) arr = arr.filter((a) => a.affiliateId.includes(q) || (a.industryType || "").toLowerCase().includes(q))
    return arr
  }, [query, country, businessType, status])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize)

  return (
    <div className="p-6 bg-[#dad0f8] min-h-[70vh]">
      <div className="flex flex-col gap-4">
        <BusinessToolbar
          query={query}
          onQueryChange={setQuery}
          country={country}
          onCountryChange={setCountry}
          businessType={businessType}
          onBusinessTypeChange={setBusinessType}
          status={status}
          onStatusChange={setStatus}
        />

        <BusinessTable items={pageItems}  />

        <div className="mt-4">
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={(p) => setPage(p)} pageSize={pageSize} totalResults={filtered.length} />
        </div>
      </div>
    </div>
  )
}

export default AllBusinessTable