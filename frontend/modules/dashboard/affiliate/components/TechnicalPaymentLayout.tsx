"use client"

import React, { useMemo, useState } from 'react'
import PageHeader from '@/src/components/ui/PageHeader'
import { Card, CardHeader, CardContent } from '@/src/components/ui/card'
import { Table, TableHeading, TableBody, TableRow, TableColumn } from '@/src/components/table'
import TabButton from '@/src/components/ui/TabButton'
import { Button } from '@/src/components/ui/button'
import { usePathname, useRouter } from 'next/navigation'
import { Pagination } from '@/src/components/ui/pagination'
import { SearchInput } from '@/src/components/form/search-input'
import { useIsDemoAccount } from '@/src/shared/hooks/use-is-demo-account'

const demoPayments = [
  { id: 'tx-01', method: 'Stripe', amount: '10 usd', date: '03 Feb 2025, 2:05 PM (UTC)', status: 'failed' },
  { id: 'tx-02', method: 'Stripe', amount: '110 usd', date: '03 Feb 2025, 2:05 PM (UTC)', status: 'refund' },
  { id: 'tx-03', method: 'Paypal', amount: '120 usd', date: '03 Feb 2025, 2:05 PM (UTC)', status: 'succeeded' },
]

const TechnicalPaymentLayout: React.FC = () => {



  const router = useRouter()
  const pathname = usePathname()
  const { demoOrEmpty } = useIsDemoAccount()
  const payments = demoOrEmpty(demoPayments, [] as typeof demoPayments)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 12

  const filtered = useMemo(() => {
    if (!search) return payments
    const q = search.toLowerCase()
    return payments.filter((p) =>
      p.id.toLowerCase().includes(q) ||
      p.method.toLowerCase().includes(q) ||
      p.amount.toLowerCase().includes(q) ||
      p.date.toLowerCase().includes(q) ||
      p.status.toLowerCase().includes(q)
    )
  }, [search, payments])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const goToProject = () => {
    if (pathname?.endsWith('/payment')) {
      router.push(pathname.replace(/\/payment$/, ''))
    }
  }

  return (
    <div className="p-4">

      <Card className="shadow-none bg-transparent border-0">
        <CardHeader className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TabButton label="Project" isActive={false} onClick={goToProject} />
            <TabButton label="Transaction" isActive={true} onClick={() => { }} />
          </div>
          <SearchInput value={search} onChange={(v) => setSearch(v)} placeholder="Search media..." />
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-[700px]">
              <Table>
                <TableHeading>
                  <TableColumn isHeader>Transaction ID</TableColumn>
                  <TableColumn isHeader>Method</TableColumn>
                  <TableColumn isHeader>Amount</TableColumn>
                  <TableColumn isHeader>Date & Time</TableColumn>
                  <TableColumn isHeader>Status</TableColumn>
                  <TableColumn isHeader>Action</TableColumn>
                </TableHeading>

                <TableBody>
                  {pageData.map((t) => (
                    <TableRow key={t.id}>
                      <TableColumn>{t.id}</TableColumn>
                      <TableColumn>{t.method}</TableColumn>
                      <TableColumn>{t.amount}</TableColumn>
                      <TableColumn>{t.date}</TableColumn>
                      <TableColumn>
                        <span className={`px-2 py-1 rounded text-xs ${t.status === 'failed' ? 'bg-red-100 text-red-700' : t.status === 'refund' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{t.status}</span>
                      </TableColumn>
                      <TableColumn>
                        <Button variant="outline" size="sm">View</Button>
                      </TableColumn>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Table visible on all sizes; horizontal scroll allows viewing on small devices */}

          <div className="pt-4">
            <Pagination currentPage={page} totalPages={totalPages} pageSize={PAGE_SIZE} totalResults={filtered.length} onPageChange={(p: number) => setPage(p)} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default TechnicalPaymentLayout