"use client"

import React, { useState } from "react"
import PageHeader from '@/src/shared/ui/ui/PageHeader'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/shared/ui/ui/select'
import { Pagination } from "@/src/shared/ui/ui/pagination"
import { SearchInput } from "@/src/shared/ui/form/search-input"
import { Eye } from "lucide-react"
import { Table } from "@/src/shared/ui/table/Table"
import { TableHeading } from "@/src/shared/ui/table/TableHeading"
import { TableRow } from "@/src/shared/ui/table/TableRow"
import { TableColumn } from "@/src/shared/ui/table/TableColumn"
import { Button } from "@/src/shared/ui/ui/button"

const demoReturns = Array.from({ length: 15 }).map((_, i) => ({
  id: `71L69PJK${i + 1}`,
  type: ['Payment', 'Refund', 'Add Money', 'Withdraw', 'Security Deposit'][i % 5],
  method: ['Credit', 'Debit Card', 'paypal', 'Wallet', 'paypal'][i % 5],
  amount: `${110 + i * 10} usd`,
  dateTime: 'UTC.03-02-25. 02:05 PM',
  status: ['failed', 'Disputed', 'Disputed', 'failed', 'succeeded'][i % 5],
}))

const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'succeeded':
      return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800'
    case 'failed':
      return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800'
    case 'disputed':
      return 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800'
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200'
  }
}

const ReturnLayout: React.FC = () => {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [search, setSearch] = useState("")

  const totalResults = demoReturns.length
  const totalPages = Math.max(1, Math.ceil(totalResults / pageSize))
  const paginatedReturns = demoReturns.slice((page - 1) * pageSize, page * pageSize)

  return (
    <div className="p-4 sm:p-6 w-full max-w-full overflow-hidden min-h-[70vh]">
      <div className="flex flex-col gap-6 w-full">
        
        {/* Header */}
        <div>
          <PageHeader title="Return" />
        </div>

        {/* Filters Toolbar */}
        <div className="flex flex-col 2xl:flex-row items-stretch 2xl:items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm w-full">
          
          {/* Left side: Search */}
          <div className="w-full 2xl:w-64 flex-shrink-0">
            <SearchInput 
              value={search}
              onChange={setSearch}
              placeholder="Search..." 
              className="w-full"
            />
          </div>

          {/* Right side: Dropdowns */}
          <div className="flex flex-col sm:flex-row flex-wrap 2xl:flex-nowrap items-stretch sm:items-center gap-2.5 w-full 2xl:w-auto 2xl:ml-auto">
            
            <Select defaultValue="all">
              <SelectTrigger className="w-full sm:w-[150px] h-10 px-3 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 text-sm font-medium text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all cursor-pointer shadow-sm">
                <SelectValue placeholder="All Industry Type" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-slate-900 border-gray-200 dark:border-gray-700 rounded-md shadow-lg">
                <SelectItem value="all" className="focus:bg-blue-600 focus:text-white cursor-pointer rounded-sm mx-1 my-0.5">All Industry Type</SelectItem>
                <SelectItem value="commercial" className="focus:bg-blue-600 focus:text-white cursor-pointer rounded-sm mx-1 my-0.5">Commercial</SelectItem>
                <SelectItem value="personal" className="focus:bg-blue-600 focus:text-white cursor-pointer rounded-sm mx-1 my-0.5">Personal</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="all">
              <SelectTrigger className="w-full sm:w-[150px] h-10 px-3 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 text-sm font-medium text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all cursor-pointer shadow-sm">
                <SelectValue placeholder="All Gateway Type" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-slate-900 border-gray-200 dark:border-gray-700 rounded-md shadow-lg">
                <SelectItem value="all" className="focus:bg-blue-600 focus:text-white cursor-pointer rounded-sm mx-1 my-0.5">All Gateway Type</SelectItem>
                <SelectItem value="stripe" className="focus:bg-blue-600 focus:text-white cursor-pointer rounded-sm mx-1 my-0.5">Stripe</SelectItem>
                <SelectItem value="paypal" className="focus:bg-blue-600 focus:text-white cursor-pointer rounded-sm mx-1 my-0.5">PayPal</SelectItem>
              </SelectContent>
            </Select>
            
            <Select defaultValue="all">
              <SelectTrigger className="w-full sm:w-[120px] h-10 px-3 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 text-sm font-medium text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all cursor-pointer shadow-sm">
                <SelectValue placeholder="All Currency" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-slate-900 border-gray-200 dark:border-gray-700 rounded-md shadow-lg">
                <SelectItem value="all" className="focus:bg-blue-600 focus:text-white cursor-pointer rounded-sm mx-1 my-0.5">All Currency</SelectItem>
                <SelectItem value="usd" className="focus:bg-blue-600 focus:text-white cursor-pointer rounded-sm mx-1 my-0.5">USD</SelectItem>
                <SelectItem value="eur" className="focus:bg-blue-600 focus:text-white cursor-pointer rounded-sm mx-1 my-0.5">EUR</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-1.5">
              <input type="date" className="h-10 px-2 w-[125px] bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all cursor-pointer" />
              <span className="text-slate-500 dark:text-slate-400 font-medium text-xs uppercase">To</span>
              <input type="date" className="h-10 px-2 w-[125px] bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all cursor-pointer" />
            </div>

            <Select defaultValue="all">
              <SelectTrigger className="w-full sm:w-[120px] h-10 px-3 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 text-sm font-medium text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all cursor-pointer shadow-sm">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-slate-900 border-gray-200 dark:border-gray-700 rounded-md shadow-lg">
                <SelectItem value="all" className="focus:bg-blue-600 focus:text-white cursor-pointer rounded-sm mx-1 my-0.5">All Status</SelectItem>
                <SelectItem value="succeeded" className="focus:bg-blue-600 focus:text-white cursor-pointer rounded-sm mx-1 my-0.5">Succeeded</SelectItem>
                <SelectItem value="failed" className="focus:bg-blue-600 focus:text-white cursor-pointer rounded-sm mx-1 my-0.5">Failed</SelectItem>
                <SelectItem value="disputed" className="focus:bg-blue-600 focus:text-white cursor-pointer rounded-sm mx-1 my-0.5">Disputed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Data Table */}
        <div className="mt-2 w-full overflow-x-auto">
            <div className="min-w-[1000px]">
              <Table>
                <TableHeading>
                  <TableColumn isHeader align="center" className="font-bold">Transaction ID</TableColumn>
                  <TableColumn isHeader align="center" className="font-bold">Type</TableColumn>
                  <TableColumn isHeader align="center" className="font-bold">Refund Method</TableColumn>
                  <TableColumn isHeader align="center" className="font-bold">Amount</TableColumn>
                  <TableColumn isHeader align="center" className="font-bold">Date & Time</TableColumn>
                  <TableColumn isHeader align="center" className="font-bold">Status</TableColumn>
                  <TableColumn isHeader align="center" className="font-bold">Action</TableColumn>
                </TableHeading>
                <tbody>
                  {paginatedReturns.length === 0 ? (
                    <TableRow>
                      <TableColumn colSpan={7}>
                        <div className="flex flex-col items-center justify-center gap-3 py-10">
                          <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">No returns found</h3>
                        </div>
                      </TableColumn>
                    </TableRow>
                  ) : (
                    paginatedReturns.map((item, index) => (
                      <TableRow key={index}>
                        <TableColumn align="center" className="font-semibold text-slate-700 dark:text-slate-200">{item.id}</TableColumn>
                        <TableColumn align="center" className="text-slate-600 dark:text-slate-300 font-medium">{item.type}</TableColumn>
                        <TableColumn align="center" className="text-slate-600 dark:text-slate-300">{item.method}</TableColumn>
                        <TableColumn align="center" className="font-semibold text-slate-800 dark:text-slate-200">{item.amount}</TableColumn>
                        <TableColumn align="center" className="text-slate-600 dark:text-slate-400 font-medium">{item.dateTime}</TableColumn>
                        <TableColumn align="center">
                          <span className={`px-2.5 py-1 text-[10px] sm:text-[11px] font-bold rounded-md border ${getStatusColor(item.status)}`}>
                            {item.status}
                          </span>
                        </TableColumn>
                        <TableColumn align="center">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                            <Eye size={18} />
                          </Button>
                        </TableColumn>
                      </TableRow>
                    ))
                  )}
                </tbody>
              </Table>
            </div>
        </div>

        {/* Pagination Footer */}
        <div className="mt-4 flex justify-end">
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
  )
}

export default ReturnLayout
