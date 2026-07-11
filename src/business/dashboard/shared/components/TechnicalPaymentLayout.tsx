"use client"

import React, { useState } from 'react'
import PageHeader from '@/src/shared/ui/ui/PageHeader'
import { Card, CardHeader, CardContent } from '@/src/shared/ui/ui/card'
import { Table } from "@/src/shared/ui/table/Table"
import { TableHeading } from "@/src/shared/ui/table/TableHeading"
import { TableRow } from "@/src/shared/ui/table/TableRow"
import { TableColumn } from "@/src/shared/ui/table/TableColumn"
import TabButton from '@/src/shared/ui/ui/TabButton'
import { Button } from '@/src/shared/ui/ui/button'
import { Pagination } from "@/src/shared/ui/ui/pagination"
import { SearchInput } from "@/src/shared/ui/form/search-input"
import { Eye } from "lucide-react"
import { usePathname, useRouter } from 'next/navigation'

const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
        case 'succeeded':
            return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
        case 'refund':
            return 'bg-blue-500/10 text-blue-600 border-blue-500/20'
        case 'failed':
            return 'bg-red-500/10 text-red-600 border-red-500/20'
        default:
            return 'bg-slate-500/10 text-slate-600 border-slate-500/20'
    }
}

const demoPayments = [
  { id: 'tx-01', method: 'Stripe', amount: '10 usd', date: '03 Feb 2025, 2:05 PM (UTC)', status: 'failed' },
  { id: 'tx-02', method: 'Stripe', amount: '110 usd', date: '03 Feb 2025, 2:05 PM (UTC)', status: 'refund' },
  { id: 'tx-03', method: 'Paypal', amount: '120 usd', date: '03 Feb 2025, 2:05 PM (UTC)', status: 'succeeded' },
]

const TechnicalPaymentLayout: React.FC = () => {
  const router = useRouter()
  const pathname = usePathname()
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const pageSize = 10

  const goToProject = () => {
    if (pathname?.endsWith('/payment')) {
      router.push(pathname.replace(/\/payment$/, ''))
    }
  }

  return (
    <div className="p-4 sm:p-6 w-full max-w-full overflow-hidden min-h-[70vh]">
      <div className="flex flex-col gap-6 w-full">
        {/* Header */}
        <div className="mb-2">
          <PageHeader title="Technical Payments" />
        </div>

        {/* Toolbar (Tabs & Search) */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm w-full">
          {/* Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <button 
              onClick={goToProject}
              className="px-6 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-all bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 dark:hover:bg-blue-900/20"
            >
              Project
            </button>
            <button 
              onClick={() => {}}
              className="px-6 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-all bg-blue-600 text-white hover:bg-blue-700"
            >
              Payment
            </button>
          </div>

          {/* Search */}
          <div className="w-full md:w-80">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search payments..."
              className="w-full"
            />
          </div>
        </div>

          <div className="mt-6">
            <Table>
              <TableHeading>
              <TableColumn isHeader align="left">Transaction ID</TableColumn>
              <TableColumn isHeader align="left">Method</TableColumn>
              <TableColumn isHeader align="left">Amount</TableColumn>
              <TableColumn isHeader align="left">Date & Time</TableColumn>
              <TableColumn isHeader align="center">Status</TableColumn>
              <TableColumn isHeader align="center">Action</TableColumn>
            </TableHeading>

            <tbody>
              {demoPayments.length === 0 ? (
                <TableRow>
                  <TableColumn colSpan={6}>
                    <div className="flex flex-col items-center justify-center gap-3 py-10">
                      <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">No payments found</h3>
                    </div>
                  </TableColumn>
                </TableRow>
              ) : (
                demoPayments.map((t) => (
                  <TableRow key={t.id}>
                    <TableColumn className="font-bold">{t.id}</TableColumn>
                    <TableColumn>{t.method}</TableColumn>
                    <TableColumn className="font-semibold">{t.amount}</TableColumn>
                    <TableColumn className="text-slate-500">{t.date}</TableColumn>
                    <TableColumn align="center">
                      <span className={`px-3 py-1 text-[11px] font-bold rounded-full border ${getStatusColor(t.status)}`}>
                        {t.status.toUpperCase()}
                      </span>
                    </TableColumn>
                    <TableColumn align="center">
                      <Button variant="ghost" size="sm" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                        <Eye size={16} />
                      </Button>
                    </TableColumn>
                  </TableRow>
                ))
              )}
            </tbody>
          </Table>
        </div>

          {/* Pagination Footer */}
          <div className="mt-4 flex justify-end">
            <Pagination
              currentPage={page}
              totalPages={1}
              pageSize={pageSize}
              totalResults={demoPayments.length}
              onPageChange={(p) => setPage(p)}
            />
          </div>
        </div>
      </div>
  )
}

export default TechnicalPaymentLayout