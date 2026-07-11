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

// ── Types ──────────────────────────────────────────────────────────────────
type BusinessStatus = "ACTIVE" | "SUSPEND" | "BLOCK" | "DORMANT" | "CLOSED" | "INACTIVE"

interface BusinessRow {
  id: string
  businessId: string
  businessName: string
  businessType: string
  securityDeposit: string
  dueAmount: string
  percentageRate: string
  paidAmount: string
  country: string
  status: BusinessStatus
}

// ── Dummy Data ─────────────────────────────────────────────────────────────
const BUSINESS_TYPES = [
  "Technology",
  "Retail",
  "Real Estate",
  "Visa & Travel",
  "Finance",
  "Healthcare",
]
const STATUSES: BusinessStatus[] = ["ACTIVE", "SUSPEND", "BLOCK", "DORMANT", "CLOSED", "INACTIVE"]
const COUNTRIES = ["Australia", "Japan", "United States", "United Kingdom", "Canada", "Germany"]
const NAMES = ["tast", "tarzan", "quantum", "nexus", "vertex", "horizon"]

const dummyBusinesses: BusinessRow[] = Array.from({ length: 54 }).map((_, i) => {
  return {
    id: String(i + 1),
    businessId: String(10001 + i).padStart(5, "0"),
    businessName: NAMES[i % NAMES.length],
    businessType: BUSINESS_TYPES[i % BUSINESS_TYPES.length],
    securityDeposit: `${(i % 5 === 0) ? 45 : 20} USD`,
    dueAmount: `510 USD`,
    percentageRate: `50%`,
    paidAmount: `100 USD`,
    country: COUNTRIES[i % COUNTRIES.length],
    status: STATUSES[i % STATUSES.length],
  }
})

// ── Status Badge ───────────────────────────────────────────────────────────
function getStatusStyle(status: BusinessStatus) {
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
const AllBusinessTable: React.FC = () => {
  const router = useRouter()
  const [query, setQuery]               = useState("")
  const [country, setCountry]           = useState("All Countries")
  const [businessTypeFilter, setBusinessTypeFilter] = useState("All Business")
  const [status, setStatus]             = useState("All Statuses")
  const [startDate, setStartDate]       = useState("")
  const [endDate, setEndDate]           = useState("")
  const [page, setPage]                 = useState(1)
  const [pageSize, setPageSize]         = useState(10)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let arr = dummyBusinesses
    if (country !== "All Countries")       arr = arr.filter(a => a.country === country)
    if (businessTypeFilter !== "All Business") arr = arr.filter(a => a.businessType === businessTypeFilter)
    if (status !== "All Statuses")         arr = arr.filter(a => a.status === status)
    if (q) arr = arr.filter(a =>
      a.businessId.includes(q) ||
      a.businessName.toLowerCase().includes(q) ||
      (a.businessType || "").toLowerCase().includes(q)
    )
    return arr
  }, [query, country, businessTypeFilter, status])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const pageItems  = filtered.slice((page - 1) * pageSize, page * pageSize)

  const handleView = (businessId: string) => {
    router.push(`/all-businesses/${businessId}`)
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
              placeholder="Search businesses by name, ID or type..."
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

            {/* Business Type */}
            <Select value={businessTypeFilter} onValueChange={setBusinessTypeFilter}>
              <SelectTrigger className="h-10 px-3 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 text-sm font-medium text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 w-[140px] shadow-sm">
                <SelectValue placeholder="All Business" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-slate-900 border-gray-200 rounded-md shadow-lg z-[100]">
                <SelectItem value="All Business" className="focus:bg-blue-600 focus:text-white cursor-pointer rounded-sm mx-1 my-0.5">All Business</SelectItem>
                {BUSINESS_TYPES.map(t => <SelectItem key={t} value={t} className="focus:bg-blue-600 focus:text-white cursor-pointer rounded-sm mx-1 my-0.5">{t}</SelectItem>)}
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
            <TableColumn isHeader style={{ width: '10%'  }}>Business ID</TableColumn>
            <TableColumn isHeader style={{ width: '16%'  }}>Business Name</TableColumn>
            <TableColumn isHeader style={{ width: '16%'  }}>Business Type</TableColumn>
            <TableColumn isHeader style={{ width: '12%'  }}>Security Deposit</TableColumn>
            <TableColumn isHeader style={{ width: '12%'  }}>Due Amount</TableColumn>
            <TableColumn isHeader style={{ width: '10%'  }}>Percentage Rate</TableColumn>
            <TableColumn isHeader style={{ width: '10%'  }}>Paid Amount</TableColumn>
            <TableColumn isHeader style={{ width: '8%'   }}>Status</TableColumn>
            <TableColumn isHeader style={{ width: '6%'   }} align="center">Action</TableColumn>
          </TableHeading>
          <tbody>
            {pageItems.length === 0 ? (
              <TableRow>
                <TableColumn colSpan={9}>
                  <div className="flex flex-col items-center justify-center gap-3 py-10 w-full">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                      <Search className="w-6 h-6 text-gray-400" />
                    </div>
                    <h3 className="text-base font-bold text-gray-700">No businesses found</h3>
                    <p className="text-gray-500 text-sm">Try adjusting your search or filters.</p>
                  </div>
                </TableColumn>
              </TableRow>
            ) : (
              pageItems.map((b) => (
                <TableRow key={b.id}>
                  {/* Business ID */}
                  <TableColumn>
                    <span className="font-mono text-sm font-semibold text-blue-600">#{b.businessId}</span>
                  </TableColumn>

                  {/* Business Name */}
                  <TableColumn>
                    <span className="font-semibold text-gray-800 dark:text-gray-100">{b.businessName}</span>
                  </TableColumn>

                  {/* Business Type */}
                  <TableColumn>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{b.businessType}</span>
                  </TableColumn>

                  {/* Security Deposit */}
                  <TableColumn>
                    <span className="font-semibold text-slate-700">{b.securityDeposit}</span>
                  </TableColumn>

                  {/* Due Amount */}
                  <TableColumn>
                    <span className="font-semibold text-slate-700">{b.dueAmount}</span>
                  </TableColumn>

                  {/* Percentage Rate */}
                  <TableColumn>
                    <span className="text-sm font-semibold text-slate-600">{b.percentageRate}</span>
                  </TableColumn>

                  {/* Paid Amount */}
                  <TableColumn>
                    <span className="font-semibold text-emerald-700">{b.paidAmount}</span>
                  </TableColumn>

                  {/* Status */}
                  <TableColumn>
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusStyle(b.status)}`}>
                      {b.status}
                    </span>
                  </TableColumn>

                  {/* Action */}
                  <TableColumn align="center">
                    <button
                      onClick={() => handleView(b.businessId)}
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

export default AllBusinessTable