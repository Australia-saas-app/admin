"use client"

import React, { useEffect, useState } from "react"
import UsersToolbar from "./UsersToolbar"
import { Pagination } from "@/src/components/ui/pagination"
import { userService } from "@/src/modules/dashboard/services/platform"
import { useRouter } from "next/navigation"
import { Button } from "@/src/components/ui/button"
import { Loader2 } from "lucide-react"

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

const AllUserTable: React.FC = () => {
    const [query, setQuery] = useState("")
    const [currency, setCurrency] = useState("All")
    const [status, setStatus] = useState("All")
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [page, setPage] = useState(1)
    const [isFetching, setIsFetching] = useState(false)
    const [pageSize] = useState(10)
    const [items, setItems] = useState<BackendUser[]>([])
    const [totalPages, setTotalPages] = useState(1)
    const [totalResults, setTotalResults] = useState(0)
    const [loadingUserId, setLoadingUserId] = useState<string | null>(null)
    const [debouncedQuery, setDebouncedQuery] = useState(query)
    const router = useRouter()

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(query)
        }, 500)
        return () => clearTimeout(handler)
    }, [query])

    useEffect(() => {
        let active = true
        const fetch = async () => {
            setIsFetching(true)
            try {
                const s = status === "All" ? "" : status.toLowerCase()
                const res = await userService.fetchUsers(page, pageSize, s || "active", debouncedQuery, currency, startDate, endDate)
                if (!active) return
                const users = res.users || []
                setItems(users)
                const pag = res.pagination || { page: 1, limit: pageSize, total: 0, pages: 1 }
                setTotalPages(pag.pages || Math.max(1, Math.ceil((pag.total || 0) / pageSize)))
                setTotalResults(pag.total || 0)
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
        <div className="p-6 bg-[#dad0f8] min-h-[70vh]">
            <div className="flex flex-col gap-4">
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

                <div className="overflow-x-auto bg-white rounded shadow">
                    <table className="min-w-full text-left">
                        <thead className="bg-primary text-white">
                            <tr>
                                <th className="px-4 py-2">No.</th>
                                <th className="px-4 py-2">Name</th>
                                <th className="px-4 py-2">Email</th>
                                <th className="px-4 py-2">Status</th>
                                <th className="px-4 py-2">Created At</th>
                                <th className="px-4 py-2">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isFetching ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-primary">
                                        <div className="flex flex-col items-center gap-2">
                                            <Loader2 className="w-8 h-8 animate-spin" />
                                            <span>Loading users...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : items.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-6 text-center text-gray-500">No users found</td>
                                </tr>
                            ) : (
                                items.map((u, idx) => (
                                    <tr key={u.userId} className="border-t">
                                        <td className="px-4 py-3">{(page - 1) * pageSize + idx + 1}</td>
                                        <td className="px-4 py-3">{u.fullName || '-'}</td>
                                        <td className="px-4 py-3">{u.email || '-'}</td>
                                        <td className="px-4 py-3">{(u.status || '').toUpperCase()}</td>
                                        <td className="px-4 py-3">{u.createdAt ? new Date(u.createdAt).toLocaleString() : '-'}</td>
                                        <td className="px-4 py-3">
                                            <Button
                                                size="sm"
                                                disabled={loadingUserId === u.userId}
                                                onClick={async () => {
                                                    if (!u.userId) return
                                                    setLoadingUserId(u.userId)
                                                    try {
                                                        const user = await userService.getUser(u.userId)
                                                        if (user) {
                                                            try { sessionStorage.setItem(`user_${u.userId}`, JSON.stringify(user)) } catch { }
                                                        }
                                                        handleView(u.userId)
                                                    } catch (e) {
                                                        console.error(e)
                                                        setLoadingUserId(null)
                                                    }
                                                }}
                                            >
                                                {loadingUserId === u.userId ? "Loading..." : "View"}
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="mt-4">
                    <Pagination currentPage={page} totalPages={totalPages} onPageChange={(p) => setPage(p)} pageSize={pageSize} totalResults={totalResults} />
                </div>

            </div>
        </div>
    )
}

export default AllUserTable