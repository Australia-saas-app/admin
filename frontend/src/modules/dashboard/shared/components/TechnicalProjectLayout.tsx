"use client"

import React, { useState } from "react"
import PageHeader from '@/src/components/ui/PageHeader'
import { Card, CardHeader, CardContent } from '@/src/components/ui/card'
import { Table, TableHeading, TableBody, TableRow, TableColumn } from '@/src/components/table'
import { Button } from '@/src/components/ui/button'
import TabButton from '@/src/components/ui/TabButton'
import { usePathname, useRouter } from 'next/navigation'

const demoProjects = Array.from({ length: 7 }).map((_, i) => ({
  id: `TP-${1000 + i}`,
  projectType: i % 2 === 0 ? 'Electrical' : 'Plumbing',
  totalAmount: `${500 + i * 100} USD`,
  dueAmount: `${200 + i * 50} USD`,
  duration: `${1 + i} months`,
  category: i % 2 === 0 ? 'Web Development' : 'App Development',
  location: 'Site A',
  price: `${100 + i * 25} USD`,
  status: i % 3 === 0 ? 'Active' : 'Completed',
}))

const TechnicalProjectLayout: React.FC = () => {
  const router = useRouter()
  const pathname = usePathname()
  // default active is 'project' for this page
  const [search, setSearch] = useState("")

  const goToPayment = () => {
    // if current path ends with /payment remove it, else append /payment
    if (pathname?.endsWith('/payment')) return
    router.push(`${pathname.replace(/\/$/, '')}/payment`)
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <PageHeader title="Technical Projects" />
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
            <TabButton label="Project" isActive={true} onClick={() => {}} />
            <TabButton label="Payment" isActive={false} onClick={goToPayment} />
          </div>
          <div className="text-sm text-slate-500">Showing 1 to {demoProjects.length} of {demoProjects.length} Results</div>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeading>
              <TableColumn isHeader>Project ID</TableColumn>
              <TableColumn isHeader>Project Type</TableColumn>
              <TableColumn isHeader>Total Amount</TableColumn>
              <TableColumn isHeader>Due Amount</TableColumn>
              <TableColumn isHeader>Duration</TableColumn>
              <TableColumn className="w-32" isHeader>Contact</TableColumn>
              <TableColumn isHeader>Status</TableColumn>
              <TableColumn isHeader>Action</TableColumn>
            </TableHeading>

            <TableBody>
              {demoProjects.map((p) => (
                <TableRow key={p.id}>
                  <TableColumn>{p.id}</TableColumn>
                  <TableColumn>{p.projectType}</TableColumn>
                  <TableColumn>{p.totalAmount}</TableColumn>
                  <TableColumn>{p.dueAmount}</TableColumn>
                  <TableColumn>{p.duration}</TableColumn>
                  <TableColumn className="w-32">
                    <Button>
                      Message
                    </Button>
                  </TableColumn>
                  <TableColumn>
                    <span className={`px-2 py-1 rounded text-xs ${p.status === 'Active' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>{p.status}</span>
                  </TableColumn>
                  <TableColumn>
                    <Button variant="outline" size="sm">View</Button>
                  </TableColumn>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-slate-500">Showing 1 to {demoProjects.length} of {demoProjects.length} Results</div>
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

export default TechnicalProjectLayout