"use client"

import React, { useState } from "react"
import PageHeader from "@/src/shared/ui/ui/PageHeader"
import { SearchInput } from "@/src/shared/ui/form/search-input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/shared/ui/ui/select"
import { Pagination } from "@/src/shared/ui/ui/pagination"
import { Table } from "@/src/shared/ui/table/Table"
import { TableHeading } from "@/src/shared/ui/table/TableHeading"
import { TableRow } from "@/src/shared/ui/table/TableRow"
import { TableColumn } from "@/src/shared/ui/table/TableColumn"
import { Wallet, TrendingUp, TrendingDown } from "lucide-react"

type Transaction = {
    id: string;
    date: string;
    amount: number;
    type: "Deposit" | "Withdrawal" | "Transfer";
    status: "Completed" | "Pending" | "Failed";
}

// Generate dummy data
const generateDummyTransactions = (): Transaction[] => {
    const types: ("Deposit" | "Withdrawal" | "Transfer")[] = ["Deposit", "Withdrawal", "Transfer"]
    const statuses: ("Completed" | "Pending" | "Failed")[] = ["Completed", "Completed", "Completed", "Pending", "Failed"]
    
    return Array.from({ length: 42 }).map((_, i) => ({
        id: `TXN-${100500 + i}`,
        date: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        amount: Math.floor(Math.random() * 5000) + 100,
        type: types[Math.floor(Math.random() * types.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
    }))
}

const mockTransactions = generateDummyTransactions()

const WalletLayout: React.FC = () => {
    const [query, setQuery] = useState("")
    const [status, setStatus] = useState("All Status")
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)

    // Filter logic
    const filtered = mockTransactions.filter(tx => {
        const matchesQuery = tx.id.toLowerCase().includes(query.toLowerCase())
        const matchesStatus = status === "All Status" || tx.status === status
        return matchesQuery && matchesStatus
    })

    const totalResults = filtered.length
    const totalPages = Math.max(1, Math.ceil(totalResults / pageSize))
    const paginatedItems = filtered.slice((page - 1) * pageSize, page * pageSize)

    // Helper for status colors
    const getStatusStyle = (s: string) => {
        switch(s) {
            case "Completed": return "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800"
            case "Pending": return "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800"
            case "Failed": return "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800"
            default: return "bg-slate-50 text-slate-600 border border-slate-200"
        }
    }

    return (
        <div className="p-4 sm:p-6 w-full max-w-full overflow-hidden min-h-[70vh]">
            <div className="flex flex-col gap-6 w-full">
                <PageHeader title="Wallet" />

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                            <Wallet className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Total Balance</p>
                            <p className="text-2xl font-black text-slate-800 dark:text-slate-100">$124,500.00</p>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center flex-shrink-0">
                            <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Incoming (30d)</p>
                            <p className="text-2xl font-black text-slate-800 dark:text-slate-100">$45,230.50</p>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center flex-shrink-0">
                            <TrendingDown className="w-6 h-6 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Outgoing (30d)</p>
                            <p className="text-2xl font-black text-slate-800 dark:text-slate-100">$12,800.00</p>
                        </div>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="flex flex-col xl:flex-row items-stretch xl:items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm w-full">
                    <div className="w-full xl:w-80 flex-shrink-0">
                        <SearchInput 
                            value={query} 
                            onChange={setQuery} 
                            placeholder="Search by Transaction ID..." 
                            className="w-full"
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 w-full xl:w-auto xl:ml-auto">
                        <Select value={status} onValueChange={setStatus}>
                            <SelectTrigger className="h-10 px-3 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 text-sm font-medium text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all cursor-pointer shadow-sm w-full sm:w-[160px] flex-shrink-0">
                                <SelectValue placeholder="All Status" />
                            </SelectTrigger>
                            <SelectContent className="bg-white dark:bg-slate-900 border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-[100]">
                                <SelectItem value="All Status" className="focus:bg-blue-600 focus:text-white cursor-pointer rounded-sm mx-1 my-0.5">All Status</SelectItem>
                                <SelectItem value="Completed" className="focus:bg-blue-600 focus:text-white cursor-pointer rounded-sm mx-1 my-0.5">Completed</SelectItem>
                                <SelectItem value="Pending" className="focus:bg-blue-600 focus:text-white cursor-pointer rounded-sm mx-1 my-0.5">Pending</SelectItem>
                                <SelectItem value="Failed" className="focus:bg-blue-600 focus:text-white cursor-pointer rounded-sm mx-1 my-0.5">Failed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Data Table */}
                <div className="mt-2">
                    <Table>
                        <TableHeading>
                            <TableColumn isHeader className="font-bold">Transaction ID</TableColumn>
                            <TableColumn isHeader className="font-bold">Date</TableColumn>
                            <TableColumn isHeader className="font-bold">Type</TableColumn>
                            <TableColumn isHeader align="right" className="font-bold">Amount</TableColumn>
                            <TableColumn isHeader align="center" className="font-bold">Status</TableColumn>
                        </TableHeading>
                        <tbody>
                            {paginatedItems.length === 0 ? (
                                <TableRow>
                                    <TableColumn colSpan={5}>
                                        <div className="flex flex-col items-center justify-center gap-3 py-10">
                                            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">No transactions found</h3>
                                        </div>
                                    </TableColumn>
                                </TableRow>
                            ) : (
                                paginatedItems.map((row) => (
                                    <TableRow key={row.id}>
                                        <TableColumn className="font-bold text-slate-800 dark:text-slate-100">
                                            {row.id}
                                        </TableColumn>
                                        <TableColumn className="font-medium text-slate-500 dark:text-slate-400">
                                            {row.date}
                                        </TableColumn>
                                        <TableColumn className="font-medium text-slate-600 dark:text-slate-300">
                                            {row.type}
                                        </TableColumn>
                                        <TableColumn align="right" className="font-bold text-slate-800 dark:text-slate-100">
                                            ${row.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </TableColumn>
                                        <TableColumn align="center">
                                            <div className="flex justify-center">
                                                <span className={`px-2.5 py-1 text-xs font-bold rounded-md ${getStatusStyle(row.status)}`}>
                                                    {row.status}
                                                </span>
                                            </div>
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
                            onPageSizeChange={(size) => { setPageSize(size); setPage(1) }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WalletLayout
