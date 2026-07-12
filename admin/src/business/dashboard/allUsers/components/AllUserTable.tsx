"use client"

import React, { useEffect, useState } from "react"
import UsersToolbar from "./UsersToolbar"
import { Pagination } from "@/src/shared/ui/ui/pagination"
import { useRouter } from "next/navigation"
import { Table } from "@/src/shared/ui/table/Table"
import { TableHeading } from "@/src/shared/ui/table/TableHeading"
import { TableRow } from "@/src/shared/ui/table/TableRow"
import { TableColumn } from "@/src/shared/ui/table/TableColumn"
import { Loader2, Eye, Search } from "lucide-react"

type BackendUser = {
    userId: string
    accountType?: string
    fullName?: string
    email?: string
    phone?: string | null
    currency?: string
    status?: string
    createdAt?: string
}

// ---------------------------------------------------------
// DUMMY DATA: Replaces the failing backend axios call
// ---------------------------------------------------------
const dummyUsersData: BackendUser[] = [
  { userId: "1", fullName: "Emma Thompson", email: "emma.t@example.com", currency: "USD", status: "active", createdAt: "2026-06-15T10:30:00Z" },
  { userId: "2", fullName: "Liam O'Connor", email: "liam.oc@example.com", currency: "EUR", status: "pending", createdAt: "2026-06-18T14:20:00Z" },
  { userId: "3", fullName: "Sophia Martinez", email: "smartinez@example.com", currency: "USD", status: "active", createdAt: "2026-06-20T09:15:00Z" },
  { userId: "4", fullName: "Noah Williams", email: "noah.w@example.com", currency: "GBP", status: "suspend", createdAt: "2026-06-22T16:45:00Z" },
  { userId: "5", fullName: "Olivia Chen", email: "olivia.chen@example.com", currency: "JPY", status: "active", createdAt: "2026-06-25T11:10:00Z" },
  { userId: "6", fullName: "William Davis", email: "will.davis@example.com", currency: "USD", status: "dormant", createdAt: "2026-06-28T08:05:00Z" },
  { userId: "7", fullName: "Ava Taylor", email: "ava.t@example.com", currency: "EUR", status: "active", createdAt: "2026-07-01T13:40:00Z" },
  { userId: "8", fullName: "James Anderson", email: "j.anderson@example.com", currency: "GBP", status: "pending", createdAt: "2026-07-02T15:25:00Z" },
  { userId: "9", fullName: "Isabella Thomas", email: "isa.thomas@example.com", currency: "USD", status: "active", createdAt: "2026-07-03T10:50:00Z" },
  { userId: "10", fullName: "Benjamin Jackson", email: "ben.jackson@example.com", currency: "USD", status: "closed", createdAt: "2026-07-04T09:30:00Z" },
  { userId: "11", fullName: "Mia White", email: "mia.white@example.com", currency: "EUR", status: "active", createdAt: "2026-07-05T14:15:00Z" },
  { userId: "12", fullName: "Lucas Harris", email: "lucas.h@example.com", currency: "JPY", status: "pending", createdAt: "2026-07-05T16:00:00Z" },
]

const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
        case 'active':
            return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
        case 'pending':
            return 'bg-amber-500/10 text-amber-600 border-amber-500/20'
        case 'suspend':
            return 'bg-red-500/10 text-red-600 border-red-500/20'
        case 'dormant':
            return 'bg-slate-500/10 text-slate-600 border-slate-500/20'
        case 'closed':
            return 'bg-zinc-800/10 text-zinc-600 border-zinc-800/20'
        case 'block':
            return 'bg-rose-600/10 text-rose-600 border-rose-600/20'
        default:
            return 'bg-gray-500/10 text-gray-600 border-gray-500/20'
    }
}

const AllUserTable: React.FC = () => {
    const [query, setQuery] = useState("")
    const [currency, setCurrency] = useState("All Currencies")
    const [status, setStatus] = useState("All Statuses")
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [page, setPage] = useState(1)
    const [isFetching, setIsFetching] = useState(false)
    const [pageSize, setPageSize] = useState(10)
    const [items, setItems] = useState<BackendUser[]>([])
    const [totalPages, setTotalPages] = useState(1)
    const [totalResults, setTotalResults] = useState(0)
    const [debouncedQuery, setDebouncedQuery] = useState(query)
    const router = useRouter()

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(query)
        }, 0)
        return () => clearTimeout(handler)
    }, [query])

    useEffect(() => {
        let active = true
        const fetch = async () => {
            setIsFetching(true)
            try {
                // Simulate network request delay for a beautiful loading state
                await new Promise(resolve => setTimeout(resolve, 0))
                
                if (!active) return

                let filtered = [...dummyUsersData]

                // Apply Filters
                if (debouncedQuery) {
                    const q = debouncedQuery.toLowerCase()
                    filtered = filtered.filter(u => 
                        u.fullName?.toLowerCase().includes(q) || 
                        u.email?.toLowerCase().includes(q)
                    )
                }

                if (status && status !== "All Statuses") {
                    filtered = filtered.filter(u => u.status?.toLowerCase() === status.toLowerCase())
                }

                if (currency && currency !== "All Currencies") {
                    filtered = filtered.filter(u => u.currency === currency)
                }

                setTotalResults(filtered.length)
                setTotalPages(Math.max(1, Math.ceil(filtered.length / pageSize)))
                
                // Apply Pagination
                const startIdx = (page - 1) * pageSize
                const paginated = filtered.slice(startIdx, startIdx + pageSize)
                
                setItems(paginated)
            } finally {
                if (active) setIsFetching(false)
            }
        }
        fetch()
        return () => { active = false }
    }, [page, pageSize, status, debouncedQuery, currency, startDate, endDate])

    const handleView = (userId?: string) => {
        if (!userId) return
        router.push(`/all-users/${userId}`)
    }

    return (
        <div className="px-4 sm:px-6 pt-2 pb-6 w-full max-w-full overflow-hidden min-h-[70vh]">
            <div className="flex flex-col gap-6 w-full">
                
                <UsersToolbar
                    query={query}
                    onQueryChange={setQuery}
                    currency={currency}
                    onCurrencyChange={setCurrency}
                    status={status}
                    onStatusChange={setStatus}
                    startDate={startDate}
                    onStartDateChange={setStartDate}
                    endDate={endDate}
                    onEndDateChange={setEndDate}
                />

                <Table>
                    <TableHeading>
                        <TableColumn isHeader style={{ width: '9%' }}>ID</TableColumn>
                        <TableColumn isHeader style={{ width: '28%' }}>User Details</TableColumn>
                        <TableColumn isHeader style={{ width: '15%' }}>Currency</TableColumn>
                        <TableColumn isHeader style={{ width: '16%' }}>Status</TableColumn>
                        <TableColumn isHeader style={{ width: '20%' }}>Created At</TableColumn>
                        <TableColumn isHeader align="center" style={{ width: '12%' }}>Action</TableColumn>
                    </TableHeading>
                    <tbody>
                        {isFetching ? (
                            <TableRow>
                                <TableColumn colSpan={6}>
                                    <div className="flex flex-col items-center justify-center gap-3 py-10 w-full">
                                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                                        <span className="text-gray-500 font-medium">Fetching users...</span>
                                    </div>
                                </TableColumn>
                            </TableRow>
                        ) : items.length === 0 ? (
                            <TableRow>
                                <TableColumn colSpan={6}>
                                    <div className="flex flex-col items-center justify-center gap-3 py-10 w-full">
                                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                                            <Search className="w-6 h-6 text-gray-400" />
                                        </div>
                                        <h3 className="text-base font-bold text-gray-700">No users found</h3>
                                        <p className="text-gray-500 text-sm">Try adjusting your search or filters.</p>
                                    </div>
                                </TableColumn>
                            </TableRow>
                        ) : (
                            items.map((u, idx) => (
                                <TableRow key={u.userId}>
                                    <TableColumn>
                                        #{(page - 1) * pageSize + idx + 1}
                                    </TableColumn>
                                    <TableColumn>
                                        <div className="flex items-center gap-3">
                                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                                                {u.fullName ? u.fullName.charAt(0).toUpperCase() : 'U'}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="font-semibold text-gray-800 dark:text-gray-100 truncate">{u.fullName || 'Unknown User'}</div>
                                                <div className="text-xs text-gray-500 truncate">{u.email || '-'}</div>
                                            </div>
                                        </div>
                                    </TableColumn>
                                    <TableColumn>
                                        {u.currency || '-'}
                                    </TableColumn>
                                    <TableColumn>
                                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusColor(u.status || '')}`}>
                                            {(u.status || 'UNKNOWN').toUpperCase()}
                                        </span>
                                    </TableColumn>
                                    <TableColumn>
                                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '-'}
                                    </TableColumn>
                                    <TableColumn align="center">
                                        <button
                                            onClick={() => handleView(u.userId)}
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
                
                {/* Pagination Footer */}
                <div className="mt-4 w-full">
                        <Pagination 
                            currentPage={page} 
                            totalPages={totalPages} 
                            onPageChange={(p) => setPage(p)} 
                            pageSize={pageSize} 
                            totalResults={totalResults}
                            onPageSizeChange={(size) => setPageSize(size)}
                        />
                </div>

            </div>
        </div>
    )
}

export default AllUserTable