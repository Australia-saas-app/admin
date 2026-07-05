"use client"

import React, { useState } from 'react'
import PageHeader from '@/src/components/ui/PageHeader'
import { Card, CardHeader, CardContent } from '@/src/components/ui/card'
import { Table, TableHeading, TableBody, TableRow, TableColumn } from '@/src/components/table'
import TabButton from '@/src/components/ui/TabButton'
import { Button } from '@/src/components/ui/button'
import { usePathname, useRouter } from 'next/navigation'

const demoPayments = [
  { id: 'tx-01', method: 'Stripe', amount: '10 usd', date: '03 Feb 2025, 2:05 PM (UTC)', status: 'failed' },
  { id: 'tx-02', method: 'Stripe', amount: '110 usd', date: '03 Feb 2025, 2:05 PM (UTC)', status: 'refund' },
  { id: 'tx-03', method: 'Paypal', amount: '120 usd', date: '03 Feb 2025, 2:05 PM (UTC)', status: 'succeeded' },
]

const TechnicalPaymentLayout: React.FC = () => {
  const router = useRouter()
  const pathname = usePathname()
  const [search, setSearch] = useState("")

  const goToProject = () => {
    if (pathname?.endsWith('/payment')) {
      router.push(pathname.replace(/\/payment$/, ''))
    }
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <PageHeader title="Payment" />
        <div className="w-1/3">
          <div className="relative">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
              className="w-full h-10 px-3 rounded border"
            />
            <button className="absolute right-1 top-1/2 -translate-y-1/2 px-3 py-1 rounded bg-secondary text-base-400">Search</button>
          </div>
        </div>
      </div>

      <Card className="shadow-none bg-transparent border-0">
        <CardHeader className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TabButton label="Project" isActive={false} onClick={goToProject} />
            <TabButton label="Payment" isActive={true} onClick={() => {}} />
          </div>
        </CardHeader>

        <CardContent>
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
              {demoPayments.map((t) => (
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

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-slate-500">Showing 1 to {demoPayments.length} of {demoPayments.length} Results</div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">&lt;</Button>
              <Button size="sm">1</Button>
              <Button variant="outline" size="sm">&gt;</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default TechnicalPaymentLayout