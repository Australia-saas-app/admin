"use client"

import React, { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, Search } from "lucide-react"
import { SearchInput } from "@/src/shared/ui/form/search-input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/shared/ui/ui/select"
import { Table } from "@/src/shared/ui/table/Table"
import { TableHeading } from "@/src/shared/ui/table/TableHeading"
import { TableColumn } from "@/src/shared/ui/table/TableColumn"
import { TableRow } from "@/src/shared/ui/table/TableRow"
import { Pagination } from "@/src/shared/ui/ui/pagination"
import { Loader2 } from "lucide-react"

// ── Types ──────────────────────────────────────────────────────────────────
type AffiliateStatus = "ACTIVE" | "SUSPEND" | "BLOCK" | "DORMANT" | "CLOSED" | "INACTIVE"

interface AffiliateRow {
  id: string
  affiliateId: string
  fullName: string
  email: string
  industryType: string
  totalConversions: number
  totalReferrals: number
  commissionRate: string
  earningsAmount: string
  level: number
  country: string
  status: AffiliateStatus
}

// ── Dummy Data ─────────────────────────────────────────────────────────────
const INDUSTRY_TYPES = [
  "Technology, Construction",
  "Retail, Import & Export",
  "Real Estate",
  "Visa & Travel",
  "Finance & Banking",
  "Healthcare",
]
const STATUSES: AffiliateStatus[] = ["ACTIVE", "SUSPEND", "BLOCK", "DORMANT", "CLOSED", "INACTIVE"]
const COUNTRIES = ["Australia", "Japan", "United States", "United Kingdom", "Canada", "Germany"]
const NAMES = [
  ["Emma Thompson", "emma.t@example.com"],
  ["Liam O'Connor", "liam.oc@example.com"],
  ["Sophia Martinez", "smartinez2@example.com"],
  ["Noah Williams", "noah.w@example.com"],
  ["Olivia Chen", "olivia.chen@example.com"],
  ["William Davis", "william.d@example.com"],
  ["Ava Johnson", "ava.j@example.com"],
  ["James Wilson", "james.w@example.com"],
  ["Isabella Brown", "i.brown@example.com"],
  ["Benjamin Taylor", "ben.t@globalmail.com"],
]

const dummyAffiliates: AffiliateRow[] = Array.from({ length: 54 }).map((_, i) => {
  const person = NAMES[i % NAMES.length]
  return {
    id: String(i + 1),
    affiliateId: String(10001 + i),
    fullName: person[0],
    email: person[1],
    industryType: INDUSTRY_TYPES[i % INDUSTRY_TYPES.length],
    totalConversions: 2 + (i % 8),
    totalReferrals: 30 + (i % 12) * 40,
    commissionRate: `${1 + (i % 4)}%`,
    earningsAmount: `${(20 + (i % 10) * 15).toFixed(0)} USD`,
    level: 1 + (i % 7),
    country: COUNTRIES[i % COUNTRIES.length],
    status: STATUSES[i % STATUSES.length],
  }
})

// ── Status Badge ───────────────────────────────────────────────────────────
function getStatusStyle(status: AffiliateStatus) {
  switch (status) {
    case "ACTIVE":   return "bg-emerald-100 text-emerald-700 border-emerald-200"
    case "SUSPEND":  return "bg-orange-100 text-orange-700 border-orange-200"
    case "BLOCK":    return "bg-red-100 text-red-700 border-red-200"
    case "DORMANT":  return "bg-slate-100 text-slate-600 border-slate-200"
    case "CLOSED":   return "bg-yellow-100 text-yellow-700 border-yellow-200"
    case "INACTIVE": return "bg-gray-100 text-gray-500 border-gray-200"
    default:         return "bg-gray-100 text-gray-500 border-gray-200"
  }
}

// ── Main Component ─────────────────────────────────────────────────────────
const AllAffiliateTable: React.FC = () => {
  const router = useRouter()
  const [query, setQuery]               = useState("")
  const [country, setCountry]           = useState("All Countries")
  const [industryType, setIndustryType] = useState("All Industries")
  const [status, setStatus]             = useState("All Statuses")
  const [startDate, setStartDate]       = useState("")
  const [endDate, setEndDate]           = useState("")
  const [page, setPage]                 = useState(1)
  const [pageSize, setPageSize]         = useState(10)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let arr = dummyAffiliates
    if (country !== "All Countries")       arr = arr.filter(a => a.country === country)
    if (industryType !== "All Industries") arr = arr.filter(a => a.industryType === industryType)
    if (status !== "All Statuses")         arr = arr.filter(a => a.status === status)
    if (q) arr = arr.filter(a =>
      a.affiliateId.includes(q) ||
      a.fullName.toLowerCase().includes(q) ||
      a.email.toLowerCase().includes(q) ||
      (a.industryType || "").toLowerCase().includes(q)
    )
    return arr
  }, [query, country, industryType, status])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const pageItems  = filtered.slice((page - 1) * pageSize, page * pageSize)

  const handleView = (affiliateId: string) => {
    router.push(`/all-affiliates/${affiliateId}`)
  }

  return (
    <div className="px-4 sm:px-6 pt-2 pb-6 w-full max-w-full overflow-hidden min-h-[70vh]">
      <div className="flex flex-col gap-6 w-full">

        {/* ── Toolbar ── */}
        <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm w-full overflow-x-auto custom-scrollbar">
          <div className="w-64 sm:w-72 flex-shrink-0">
            <SearchInput
              value={query}
              onChange={setQuery}
              placeholder="Search affiliates by name, ID or industry..."
              className="w-full"
            />
          </div>

          <div className="flex items-center gap-3 ml-auto flex-shrink-0">
            {/* Country */}
            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger className="h-10 px-3 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 text-sm font-medium text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 w-[140px] shadow-sm">
                <SelectValue placeholder="All Countries" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-slate-900 border-gray-200 rounded-md shadow-lg z-[100]">
                <SelectItem value="All Countries" className="focus:bg-blue-600 focus:text-white cursor-pointer rounded-sm mx-1 my-0.5">All Countries</SelectItem>
                {COUNTRIES.map(c => <SelectItem key={c} value={c} className="focus:bg-blue-600 focus:text-white cursor-pointer rounded-sm mx-1 my-0.5">{c}</SelectItem>)}
              </SelectContent>
            </Select>

            {/* Date Range */}
            <div className="flex items-center gap-2">
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="h-10 px-3 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 text-sm font-medium text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all cursor-pointer shadow-sm w-[130px]"
              />
              <span className="text-slate-400 font-medium">To</span>
              <input 
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="h-10 px-3 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 text-sm font-medium text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all cursor-pointer shadow-sm w-[130px]"
              />
            </div>

            {/* Industry */}
            <Select value={industryType} onValueChange={setIndustryType}>
              <SelectTrigger className="h-10 px-3 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 text-sm font-medium text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 w-[150px] shadow-sm">
                <SelectValue placeholder="All Industries" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-slate-900 border-gray-200 rounded-md shadow-lg z-[100]">
                <SelectItem value="All Industries" className="focus:bg-blue-600 focus:text-white cursor-pointer rounded-sm mx-1 my-0.5">All Industries</SelectItem>
                {INDUSTRY_TYPES.map(t => <SelectItem key={t} value={t} className="focus:bg-blue-600 focus:text-white cursor-pointer rounded-sm mx-1 my-0.5">{t}</SelectItem>)}
              </SelectContent>
            </Select>

            {/* Status */}
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="h-10 px-3 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 text-sm font-medium text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 w-[140px] shadow-sm">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-slate-900 border-gray-200 rounded-md shadow-lg z-[100]">
                <SelectItem value="All Statuses" className="focus:bg-blue-600 focus:text-white cursor-pointer rounded-sm mx-1 my-0.5">All Statuses</SelectItem>
                {STATUSES.map(s => <SelectItem key={s} value={s} className="focus:bg-blue-600 focus:text-white cursor-pointer rounded-sm mx-1 my-0.5">{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* ── Table ── */}
        <Table>
          <TableHeading>
            <TableColumn isHeader style={{ width: '10%'  }}>Affiliate ID</TableColumn>
            <TableColumn isHeader style={{ width: '18%'  }}>Affiliate</TableColumn>
            <TableColumn isHeader style={{ width: '16%'  }}>Industry Type</TableColumn>
            <TableColumn isHeader style={{ width: '8%'   }}>Conversions</TableColumn>
            <TableColumn isHeader style={{ width: '8%'   }}>Referrals</TableColumn>
            <TableColumn isHeader style={{ width: '8%'   }}>Commission</TableColumn>
            <TableColumn isHeader style={{ width: '10%'  }}>Earnings</TableColumn>
            <TableColumn isHeader style={{ width: '6%'   }} align="center">Level</TableColumn>
            <TableColumn isHeader style={{ width: '10%'  }}>Status</TableColumn>
            <TableColumn isHeader style={{ width: '6%'   }} align="center">Action</TableColumn>
          </TableHeading>
          <tbody>
            {pageItems.length === 0 ? (
              <TableRow>
                <TableColumn colSpan={10}>
                  <div className="flex flex-col items-center justify-center gap-3 py-10 w-full">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                      <Search className="w-6 h-6 text-gray-400" />
                    </div>
                    <h3 className="text-base font-bold text-gray-700">No affiliates found</h3>
                    <p className="text-gray-500 text-sm">Try adjusting your search or filters.</p>
                  </div>
                </TableColumn>
              </TableRow>
            ) : (
              pageItems.map((a) => (
                <TableRow key={a.id}>
                  {/* Affiliate ID */}
                  <TableColumn>
                    <span className="font-mono text-sm font-semibold text-blue-600">#{a.affiliateId}</span>
                  </TableColumn>

                  {/* Affiliate name + email */}
                  <TableColumn>
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                        {a.fullName.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-gray-800 dark:text-gray-100 truncate">{a.fullName}</div>
                        <div className="text-xs text-gray-500 truncate">{a.email}</div>
                      </div>
                    </div>
                  </TableColumn>

                  {/* Industry */}
                  <TableColumn>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{a.industryType}</span>
                  </TableColumn>

                  {/* Conversions */}
                  <TableColumn align="center">
                    <span className="font-semibold text-slate-700">{a.totalConversions}</span>
                  </TableColumn>

                  {/* Referrals */}
                  <TableColumn align="center">
                    <span className="font-semibold text-slate-700">{a.totalReferrals}</span>
                  </TableColumn>

                  {/* Commission Rate */}
                  <TableColumn align="center">
                    <span className="text-sm font-semibold text-slate-600">{a.commissionRate}</span>
                  </TableColumn>

                  {/* Earnings */}
                  <TableColumn>
                    <span className="font-semibold text-emerald-700">{a.earningsAmount}</span>
                  </TableColumn>

                  {/* Level */}
                  <TableColumn align="center">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
                      {a.level}
                    </span>
                  </TableColumn>

                  {/* Status */}
                  <TableColumn>
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusStyle(a.status)}`}>
                      {a.status}
                    </span>
                  </TableColumn>

                  {/* Action */}
                  <TableColumn align="center">
                    <button
                      onClick={() => handleView(a.affiliateId)}
                      className="inline-flex items-center justify-center p-2 rounded-md hover:bg-blue-50 text-gray-500 hover:text-blue-600 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </TableColumn>
                </TableRow>
              ))
            )}
          </tbody>
        </Table>

        {/* ── Pagination ── */}
        <div className="mt-2 w-full">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(p) => setPage(p)}
            pageSize={pageSize}
            totalResults={filtered.length}
            onPageSizeChange={(size) => { setPageSize(size); setPage(1) }}
          />
        </div>

      </div>
    </div>
  )
}

export default AllAffiliateTable