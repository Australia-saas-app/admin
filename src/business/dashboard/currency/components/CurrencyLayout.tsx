"use client"

import React, { useState } from "react"
import { Pagination } from "@/src/shared/ui/ui/pagination"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/shared/ui/ui/select"
import { Table } from "@/src/shared/ui/table/Table"
import { TableHeading } from "@/src/shared/ui/table/TableHeading"
import { TableRow } from "@/src/shared/ui/table/TableRow"
import { TableColumn } from "@/src/shared/ui/table/TableColumn"

type CurrencyRate = {
    id: number
    code: string
    amount: number
}

// Generate some dummy data based on the screenshot
const generateMockData = (): CurrencyRate[] => {
    const codes = ["AFN", "ALL", "DZD", "USD", "EUR", "GBP", "JPY", "CAD", "AUD", "INR"]
    const data: CurrencyRate[] = []
    for (let i = 1; i <= 45; i++) {
        data.push({
            id: i,
            code: codes[i % codes.length],
            amount: 46000 + Math.floor(Math.random() * 1000)
        })
    }
    return data
}

const mockCurrencies = generateMockData()

const CurrencyLayout: React.FC = () => {
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [fromCurrency, setFromCurrency] = useState("USD")
    const [toCurrency, setToCurrency] = useState("INR")

    // Input classes for the currency amount boxes
    const inputClasses = "w-24 h-10 px-3 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 text-sm font-medium text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all shadow-sm"

    const totalResults = mockCurrencies.length
    const totalPages = Math.max(1, Math.ceil(totalResults / pageSize))
    const paginatedItems = mockCurrencies.slice((page - 1) * pageSize, page * pageSize)

    return (
        <div className="p-4 sm:p-6 w-full max-w-full overflow-hidden min-h-[70vh]">
            <div className="flex flex-col gap-6 w-full">
                
                {/* Header & Exchange Converter */}
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-white dark:bg-slate-900 p-4 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm w-full">
                    <div>
                        <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100">1 US Dollar Exchange Rate</h1>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-3">
                        {/* From Currency */}
                        <div className="flex items-center gap-2">
                            <Select value={fromCurrency} onValueChange={setFromCurrency}>
                                <SelectTrigger className="h-10 px-3 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 text-sm font-medium text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all cursor-pointer shadow-sm w-28">
                                    <SelectValue placeholder="USD" />
                                </SelectTrigger>
                                <SelectContent className="bg-white dark:bg-slate-900 border-gray-200 dark:border-gray-700 rounded-md shadow-lg">
                                    <SelectItem value="USD" className="focus:bg-blue-600 focus:text-white cursor-pointer rounded-sm mx-1 my-0.5">USD</SelectItem>
                                    <SelectItem value="EUR" className="focus:bg-blue-600 focus:text-white cursor-pointer rounded-sm mx-1 my-0.5">EUR</SelectItem>
                                    <SelectItem value="GBP" className="focus:bg-blue-600 focus:text-white cursor-pointer rounded-sm mx-1 my-0.5">GBP</SelectItem>
                                </SelectContent>
                            </Select>
                            <input type="text" defaultValue="1.00" className={inputClasses} />
                        </div>

                        <span className="font-bold text-slate-500 dark:text-slate-400">=</span>

                        {/* To Currency */}
                        <div className="flex items-center gap-2">
                            <Select value={toCurrency} onValueChange={setToCurrency}>
                                <SelectTrigger className="h-10 px-3 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 text-sm font-medium text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all cursor-pointer shadow-sm w-28">
                                    <SelectValue placeholder="INR" />
                                </SelectTrigger>
                                <SelectContent className="bg-white dark:bg-slate-900 border-gray-200 dark:border-gray-700 rounded-md shadow-lg">
                                    <SelectItem value="INR" className="focus:bg-blue-600 focus:text-white cursor-pointer rounded-sm mx-1 my-0.5">INR</SelectItem>
                                    <SelectItem value="AFN" className="focus:bg-blue-600 focus:text-white cursor-pointer rounded-sm mx-1 my-0.5">AFN</SelectItem>
                                    <SelectItem value="ALL" className="focus:bg-blue-600 focus:text-white cursor-pointer rounded-sm mx-1 my-0.5">ALL</SelectItem>
                                </SelectContent>
                            </Select>
                            <input type="text" defaultValue="83.50" className={inputClasses} />
                        </div>
                    </div>
                </div>

                {/* Data Table */}
                <div className="mt-2">
                    <Table>
                        <TableHeading className="bg-yellow-400 text-slate-900">
                            <TableColumn isHeader align="center" className="w-20 font-bold">No.</TableColumn>
                            <TableColumn isHeader align="center" className="font-bold">Currency</TableColumn>
                            <TableColumn isHeader align="center" className="font-bold">Amount</TableColumn>
                        </TableHeading>
                        <tbody>
                            {paginatedItems.length === 0 ? (
                                <TableRow>
                                    <TableColumn colSpan={3}>
                                        <div className="flex flex-col items-center justify-center gap-3 py-10">
                                            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">No rates found</h3>
                                        </div>
                                    </TableColumn>
                                </TableRow>
                            ) : (
                                paginatedItems.map((row) => (
                                    <TableRow key={row.id}>
                                        <TableColumn align="center">
                                            <div className="flex justify-center items-center">
                                                <span className="font-medium text-slate-700 dark:text-slate-300">
                                                    {row.id}
                                                </span>
                                            </div>
                                        </TableColumn>
                                        <TableColumn align="center" className="font-medium text-slate-700 dark:text-slate-300">
                                            {row.code}
                                        </TableColumn>
                                        <TableColumn align="center" className="font-semibold text-slate-800 dark:text-slate-200">
                                            {row.amount.toLocaleString()}
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

export default CurrencyLayout
