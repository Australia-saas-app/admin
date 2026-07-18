"use client"

import React, { useMemo, useState } from "react"
import { Pagination } from '@/src/components/ui/pagination'
import PageHeader from '@/src/components/ui/PageHeader'
import { Card, CardHeader, CardContent } from '@/src/components/ui/card'
import { Table, TableHeading, TableBody, TableRow, TableColumn } from '@/src/components/table'
import { Button } from '@/src/components/ui/button'
import TabButton from '@/src/components/ui/TabButton'
import { usePathname, useRouter } from 'next/navigation'
import { SearchInput } from "@/src/components/form/search-input"

const demoProjects = Array.from({ length: 7 }).map((_, i) => ({
  id: `TP-${1000 + i}`,
  category: i % 2 === 0 ? 'Electrical' : 'Plumbing',
  location: 'Site A',
  price: `${100 + i * 25} USD`,
  status: i % 3 === 0 ? 'Active' : 'Completed',
}))

const TechnicalProjectLayout: React.FC = () => {
  const router = useRouter()
  const pathname = usePathname()
  // default active is 'project' for this page
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)

  const PAGE_SIZE = 12

  const filtered = useMemo(() => {
    if (!search) return demoProjects
    const q = search.toLowerCase()
    return demoProjects.filter((p) =>
      p.id.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.location.toLowerCase().includes(q) ||
      p.price.toLowerCase().includes(q)
    )
  }, [search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const goToPayment = () => {
    // if current path ends with /payment remove it, else append /payment
    if (pathname?.endsWith('/payment')) return
    router.push(`${pathname.replace(/\/$/, '')}/payment`)
  }

  return (
    <div className="p-4">

      <Card className="shadow-none bg-transparent border-0">
        <CardHeader className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TabButton label="Project" isActive={true} onClick={() => {}} />
            <TabButton label="Payment" isActive={false} onClick={goToPayment} />
          </div>
          <SearchInput value={search} onChange={(v) => setSearch(v)} placeholder="Search media..." />
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-[700px]">
              <Table>
                <TableHeading>
                  <TableColumn isHeader>PROJECT ID</TableColumn>
                  <TableColumn isHeader>CATEGORY</TableColumn>
                  <TableColumn isHeader>LOCATION</TableColumn>
                  <TableColumn isHeader>PRICE</TableColumn>
                  <TableColumn isHeader>STATUS</TableColumn>
                  <TableColumn isHeader>ACTION</TableColumn>
                </TableHeading>

                <TableBody>
                  {pageData.map((p) => (
                    <TableRow key={p.id}>
                      <TableColumn>{p.id}</TableColumn>
                      <TableColumn>{p.category}</TableColumn>
                      <TableColumn>{p.location}</TableColumn>
                      <TableColumn>{p.price}</TableColumn>
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
            </div>
          </div>
            <div className="pt-4">
              <Pagination currentPage={page} totalPages={totalPages} pageSize={PAGE_SIZE} totalResults={filtered.length} onPageChange={(p: number) => setPage(p)} />
            </div>
     
        </CardContent>
      </Card>
    </div>
  )
}

export default TechnicalProjectLayout