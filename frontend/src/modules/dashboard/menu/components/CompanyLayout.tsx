"use client"

import { SearchInput } from "@/src/components/form/search-input"
import { Table, TableBody, TableColumn, TableHeading, TableRow } from "@/src/components/table"
import { Button } from "@/src/components/ui/button"
import PageHeader from "@/src/components/ui/PageHeader"
import { fetchCompanies } from "@/src/modules/dashboard/menu/services/companies"
import type { Company } from "@/src/modules/dashboard/menu/types/company"
import React, { useEffect, useMemo, useState } from "react"
import CompanyCreateModal from "./CompanyCreateModal"

import { Pagination } from "@/src/components/ui/pagination"
import { Edit2, Trash2 } from "lucide-react"

const PAGE_SIZE = 12

const CompanyLayout: React.FC = () => {
  const [items, setItems] = useState<Company[]>([])
  const [query, setQuery] = useState("")
  const [showCreate, setShowCreate] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    let mounted = true
      ; (async () => {
        const data = await fetchCompanies()
        if (!mounted) return
        setItems(data)
      })()
    return () => {
      mounted = false
    }
  }, [])

  const filtered = useMemo(() => {
    if (!query) return items
    const q = query.toLowerCase()
    return items.filter((it) =>
      (it.contentName ||  "").toLowerCase().includes(q) ||
      (it.contentDescription || it.description || "").toLowerCase().includes(q)
    )
  }, [items, query])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))

  const pageItems = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return filtered.slice(start, start + PAGE_SIZE)
  }, [filtered, currentPage])

  const handleCreate = (data: { contentName: string; contentDescription?: string }) => {
    const id = Date.now().toString()
    const newItem: Company = {
      id,
      contentName: data.contentName,
      contentDescription: data.contentDescription,
      contentDate: new Date().toISOString().split("T")[0],
      active: true,
    }
    setItems((s) => [newItem, ...s])
    setCurrentPage(1)
  }

  const handleDelete = (id: string) => {
    if (!confirm("Delete this company?")) return
    setItems((s) => s.filter((i) => i.id !== id))
  }

  const toggleActive = (id: string) => {
    setItems((s) => s.map((it) => (it.id === id ? { ...it, active: !it.active } : it)))
  }

  return (
    <div>
      <PageHeader
        title="Company"
        right={
          <div className="flex gap-2 items-center">
            <div className="w-48">
              <SearchInput value={query} onChange={setQuery} placeholder="Search" />
            </div>
            <Button onClick={() => setShowCreate(true)}>Create</Button>
          </div>
        }
      />

      <div className="mt-4">
        <Table>
          <TableHeading>
            <TableColumn className="w-14" isHeader>No.</TableColumn>
            <TableColumn isHeader>Content Name</TableColumn>
            <TableColumn isHeader>Description</TableColumn>
            <TableColumn isHeader>Date</TableColumn>
            <TableColumn isHeader>Action</TableColumn>
          </TableHeading>
          <TableBody isEmpty={pageItems.length === 0} colSpan={5}>
            {pageItems.map((c, idx) => (
              <TableRow key={c.id}>
                <TableColumn className="w-14 flex justify-center items-center">
                  <div className="text-center w-5 h-5 bg-primary text-white rounded">{(currentPage - 1) * PAGE_SIZE + idx + 1}</div>
                </TableColumn>
                <TableColumn>{c.contentName }</TableColumn>
                <TableColumn className="max-w-xl text-sm text-gray-700">
                  <span className="line-clamp-2" dangerouslySetInnerHTML={{ __html: c.contentDescription || c.description || "—" }} />
                </TableColumn>
                <TableColumn>{c.contentDate || "—"}</TableColumn>
                <TableColumn>
                  <div className="flex items-center gap-2">
                      <button
                      type="button"
                      onClick={() => toggleActive(c.id)}
                      className={`w-12 h-[21px] rounded-full transition-colors flex items-center px-1 ${c.active ? "bg-green-500" : "bg-gray-300"
                        }`}
                    >
                      <span
                        className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${c.active ? "translate-x-6" : "translate-x-0"
                          }`}
                      />
                    </button>
                    <button onClick={() => alert('Edit not implemented yet')} className="p-1">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(c.id)} className="p-1 text-red-500">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </TableColumn>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="pt-4">
          <Pagination currentPage={currentPage} totalPages={totalPages} pageSize={PAGE_SIZE} totalResults={filtered.length} onPageChange={(p) => setCurrentPage(p)} />
        </div>
      </div>

      <CompanyCreateModal open={showCreate} onClose={() => setShowCreate(false)} onCreate={handleCreate} />
    </div>
  )
}

export default CompanyLayout