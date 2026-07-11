"use client"

import React from "react"
import { Pagination } from "@/src/shared/ui/ui/pagination"

interface Props {
  page: number
  setPage: (p: number) => void
  pageSize: number
  setPageSize: (s: number) => void
  totalResults: number
  totalPages: number
}

const AffiliatesPaginationControl: React.FC<Props> = ({ page, setPage, pageSize, setPageSize, totalResults, totalPages }) => {
  return (
    <div className="flex flex-col items-center gap-3 mt-6">
      <div className="text-sm text-gray-700">Showing {((page - 1) * pageSize) + 1} To {Math.min(totalResults, page * pageSize)} of {totalResults} Results</div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-yellow-300 px-3 py-2 rounded-md">
          <span>More Results</span>
          <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1) }} className="bg-transparent">
            <option value={12}>12</option>
            <option value={24}>24</option>
            <option value={48}>48</option>
            <option value={96}>96</option>
          </select>
        </div>
      </div>

      <div className="w-full max-w-2xl mt-2">
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={(p) => setPage(p)} pageSize={pageSize} totalResults={totalResults} />
      </div>
    </div>
  )
}

export default AffiliatesPaginationControl
