"use client"

import React, { useEffect, useMemo, useState } from "react"
import { Table, TableHeading, TableBody, TableRow, TableColumn } from "@/src/shared/ui/table"
import { Button } from "@/src/shared/ui/ui/button"
import { SearchInput } from "@/src/shared/ui/form/search-input"
import PageHeader from "@/src/shared/ui/ui/PageHeader"
// Modal and local useForm removed; using NoticeCreateModal component instead
import NoticeCreateModal from "./NoticeCreateModal"
import { Pagination } from "@/src/shared/ui/ui/pagination"
import type { Notice } from "@/src/business/dashboard/menu/types"
import { fetchNotices as mockFetchNotices } from "@/src/business/dashboard/menu/services"
import { Edit2, File, Trash2 } from "lucide-react"

const PAGE_SIZE = 12

const NoticeLayout: React.FC = () => {
  const [notices, setNotices] = useState<Notice[]>([])
  const [query, setQuery] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [page, setPage] = useState(1)

  useEffect(() => {
    let mounted = true
    mockFetchNotices().then((data) => {
      if (mounted) setNotices(data)
    })
    return () => {
      mounted = false
    }
  }, [])

  const filtered = useMemo(() => {
    if (!query) return notices
    return notices.filter((n) => n.title.toLowerCase().includes(query.toLowerCase()))
  }, [notices, query])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  // create handler when NoticeCreateModal emits create payload
  const handleCreate = (payload: { title: string; description?: string; file?: File | null }) => {
    const newNotice: Notice = {
      id: String(Date.now()),
      title: payload.title || "(Untitled)",
      publishDate: new Date().toISOString().split("T")[0],
      fileUrl: payload.file ? URL.createObjectURL(payload.file) : undefined,
      active: true,
    }
    setNotices((prev) => [newNotice, ...prev])
    setShowModal(false)
    setPage(1)
  }

  const handleDelete = (id: string) => {
    if (!confirm("Delete this company?")) return
    setNotices((s) => s.filter((i) => i.id !== id))
  }

  const toggleActive = (id: string) => {
    setNotices((s) => s.map((it) => (it.id === id ? { ...it, active: !it.active } : it)))
  }
  return (
    <div>
      <PageHeader
        title="Notice"
        right={
          <div className="flex items-center gap-3">
            <div className="w-56">
              <SearchInput value={query} onChange={setQuery} placeholder="Search..." />
            </div>
            <Button onClick={() => setShowModal(true)} >Create</Button>
          </div>
        }
      />


      <div className="mt-4">
        <Table>
          <TableHeading>
            <TableColumn className="w-16" isHeader>No.</TableColumn>
            <TableColumn isHeader>Title</TableColumn>
            <TableColumn className="w-32 "  isHeader>Publish Date </TableColumn>
            <TableColumn className="w-16" isHeader>File</TableColumn>
            <TableColumn className="w-32 " isHeader >Action</TableColumn>
          </TableHeading>
          <TableBody isEmpty={pageItems.length === 0} colSpan={8}>
            {pageItems.map((b, idx) => (
              <TableRow key={b.id} className="relative">
                <TableColumn className="w-16 flex justify-center items-center">
                  <div className="text-center w-5 h-5 bg-primary text-white rounded">{(page - 1) * PAGE_SIZE + idx + 1}</div>
                </TableColumn>

                <TableColumn>{b.title}</TableColumn>
                <TableColumn className="w-32 " >{b.publishDate ?? "—"}</TableColumn>
                <TableColumn className="w-16" >
                  {b.fileUrl ? (
                    <a href={b.fileUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center">
                      <File size={16} />
                    </a>
                  ) : null}
                </TableColumn>
                <TableColumn className="w-32">
                  <div className="flex items-start justify-start gap-1">
                    <button
                      type="button"
                      onClick={() => toggleActive(b.id)}
                      className={`w-12 h-[21px] rounded-full transition-colors flex items-center px-1 ${b.active ? "bg-green-500" : "bg-gray-300"
                        }`}
                    >
                      <span
                        className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${b.active ? "translate-x-6" : "translate-x-0"
                          }`}
                      />
                    </button>

                    <button onClick={() => alert('Edit not implemented yet')} className="p-1">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(b.id)} className="p-1 text-red-500">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </TableColumn>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>


      <div className="pt-4">
        <Pagination currentPage={page} totalPages={totalPages} pageSize={PAGE_SIZE} totalResults={filtered.length} onPageChange={(p) => setPage(p)} />
      </div>

      <NoticeCreateModal isOpen={showModal} onClose={() => setShowModal(false)} onCreate={handleCreate} />
    </div>
  )
}

export default NoticeLayout