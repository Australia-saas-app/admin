"use client"

import React, { useState } from "react"
import PageHeader from '@/src/shared/ui/ui/PageHeader'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/shared/ui/ui/select'
import { Pagination } from "@/src/shared/ui/ui/pagination"
import { SearchInput } from "@/src/shared/ui/form/search-input"

const RealEstateLayout: React.FC = () => {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [search, setSearch] = useState("")

  const totalResults = 0
  const totalPages = 1

  const tabClass = (active: boolean) => active 
    ? "px-5 py-2 rounded-lg font-bold text-sm bg-blue-600 text-white shadow-sm transition-colors"
    : "px-5 py-2 rounded-lg font-bold text-sm bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm"

  return (
    <div className="p-4 sm:p-6 w-full max-w-full overflow-hidden min-h-[70vh]">
      <div className="flex flex-col gap-6 w-full">
        
        {/* Header */}
        <div>
          <PageHeader title="Real Estate" />
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
              <SelectTrigger className="w-full sm:w-[120px] h-10 px-3 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 text-sm font-medium text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all cursor-pointer shadow-sm">
                <SelectValue placeholder="All Country" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-slate-900 border-gray-200 dark:border-gray-700 rounded-md shadow-lg">
                <SelectItem value="all" className="focus:bg-blue-600 focus:text-white cursor-pointer rounded-sm mx-1 my-0.5">All Country</SelectItem>
                <SelectItem value="japan" className="focus:bg-blue-600 focus:text-white cursor-pointer rounded-sm mx-1 my-0.5">Japan</SelectItem>
                <SelectItem value="canada" className="focus:bg-blue-600 focus:text-white cursor-pointer rounded-sm mx-1 my-0.5">Canada</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-1.5">
              <input type="date" className="h-10 px-2 w-[125px] bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all cursor-pointer" />
              <span className="text-slate-500 dark:text-slate-400 font-medium text-xs uppercase">To</span>
              <input type="date" className="h-10 px-2 w-[125px] bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all cursor-pointer" />
            </div>

            <Select defaultValue="all">
              <SelectTrigger className="w-full sm:w-[130px] h-10 px-3 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 text-sm font-medium text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all cursor-pointer shadow-sm">
                <SelectValue placeholder="All Category" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-slate-900 border-gray-200 dark:border-gray-700 rounded-md shadow-lg">
                <SelectItem value="all" className="focus:bg-blue-600 focus:text-white cursor-pointer rounded-sm mx-1 my-0.5">All Category</SelectItem>
                <SelectItem value="soft" className="focus:bg-blue-600 focus:text-white cursor-pointer rounded-sm mx-1 my-0.5">Soft dev</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="all">
              <SelectTrigger className="w-full sm:w-[150px] h-10 px-3 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 text-sm font-medium text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all cursor-pointer shadow-sm">
                <SelectValue placeholder="All Sub Category" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-slate-900 border-gray-200 dark:border-gray-700 rounded-md shadow-lg">
                <SelectItem value="all" className="focus:bg-blue-600 focus:text-white cursor-pointer rounded-sm mx-1 my-0.5">All Sub Category</SelectItem>
                <SelectItem value="web" className="focus:bg-blue-600 focus:text-white cursor-pointer rounded-sm mx-1 my-0.5">Web dev</SelectItem>
                <SelectItem value="app" className="focus:bg-blue-600 focus:text-white cursor-pointer rounded-sm mx-1 my-0.5">App dev</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="all">
              <SelectTrigger className="w-full sm:w-[120px] h-10 px-3 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 text-sm font-medium text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all cursor-pointer shadow-sm">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-slate-900 border-gray-200 dark:border-gray-700 rounded-md shadow-lg">
                <SelectItem value="all" className="focus:bg-blue-600 focus:text-white cursor-pointer rounded-sm mx-1 my-0.5">All Status</SelectItem>
                <SelectItem value="pending" className="focus:bg-blue-600 focus:text-white cursor-pointer rounded-sm mx-1 my-0.5">Pending</SelectItem>
                <SelectItem value="payment" className="focus:bg-blue-600 focus:text-white cursor-pointer rounded-sm mx-1 my-0.5">Payment</SelectItem>
                <SelectItem value="waiting" className="focus:bg-blue-600 focus:text-white cursor-pointer rounded-sm mx-1 my-0.5">Waiting</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tabs under the filter card */}
        <div className="flex flex-wrap items-center gap-2 mt-2">
          <button className={tabClass(true)}>Project</button>
          <button className={tabClass(false)}>My Project</button>
          <button className={tabClass(false)}>Refund Project</button>
          <button className={tabClass(false)}>Report Project</button>
        </div>

        {/* Empty Table Space */}
        <div className="mt-2 w-full overflow-x-auto min-h-[300px] border-2 border-slate-200 dark:border-slate-800 rounded-xl bg-white/50 dark:bg-slate-900/50 flex flex-col items-center justify-center border-dashed">
            <p className="text-slate-400 font-bold mb-1">Table Placeholder Space</p>
            <p className="text-slate-400 text-xs text-center px-4">We will add the table data here next.</p>
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

export default RealEstateLayout
