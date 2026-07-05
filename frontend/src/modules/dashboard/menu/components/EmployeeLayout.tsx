"use client"

import React, { useEffect, useMemo, useState } from "react"
import PageHeader from "@/src/components/ui/PageHeader"
import { SearchInput } from "@/src/components/form/search-input"
import { Button } from "@/src/components/ui/button"
import { Table, TableHeading, TableBody, TableRow, TableColumn } from "@/src/components/table"
import { fetchEmployees } from "@/src/modules/dashboard/menu/services/employees"
import type { Employee } from "@/src/modules/dashboard/menu/types/employee"
import EmployeeCreateModal from "./EmployeeCreateModal"
import { Edit2, Facebook, Instagram, Linkedin, Trash2, Twitter, Youtube } from "lucide-react"

const PAGE_SIZE = 12
const SOCIAL_ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  facebook: Facebook,
  twitter: Twitter,
  instagram: Instagram,
  linkedin: Linkedin,
  youtube: Youtube,
}


const EmployeeLayout: React.FC = () => {
  const [items, setItems] = useState<Employee[]>([])
  const [query, setQuery] = useState("")
  const [showCreate, setShowCreate] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    let mounted = true
      ; (async () => {
        const data = await fetchEmployees()
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
    return items.filter((it) => (it.name || "").toLowerCase().includes(q) || (it.title || "").toLowerCase().includes(q))
  }, [items, query])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))

  const pageItems = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return filtered.slice(start, start + PAGE_SIZE)
  }, [filtered, currentPage])

  const handleCreate = (data: any) => {
    const id = Date.now().toString()
    const photoUrl = data.file ? URL.createObjectURL(data.file) : undefined
    const newItem: Employee = {
      id,
      name: data.name,
      title: data.title,
      officeAddress: data.officeAddress,
      photoUrl,
      socialLinks: data.socialLinks ?? [],
      active: data.active ?? true,
    }
    setItems((s) => [newItem, ...s])
    setCurrentPage(1)
  }

  const handleDelete = (id: string) => {
    if (!confirm("Delete this employee?")) return
    setItems((s) => s.filter((i) => i.id !== id))
  }

  const toggleActive = (id: string) => {
    setItems((s) => s.map((it) => (it.id === id ? { ...it, active: !it.active } : it)))
  }

  return (
    <div>
      <PageHeader
        title="Employee"
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
            <TableColumn className="w-16" isHeader>No.</TableColumn>
            <TableColumn isHeader>Photo</TableColumn>
            <TableColumn isHeader>Name</TableColumn>
            <TableColumn isHeader>Title</TableColumn>
            <TableColumn isHeader>Office Address</TableColumn>
            <TableColumn isHeader>Social Link</TableColumn>
            <TableColumn className="w-32 " isHeader >Action</TableColumn>
          </TableHeading>
          <TableBody isEmpty={pageItems.length === 0} colSpan={8}>
            {pageItems.map((b, idx) => (
              <TableRow key={b.id} className="relative">
                <TableColumn className="w-16 flex justify-center items-center">
                  <div className="text-center w-5 h-5 bg-primary text-white rounded">{(currentPage - 1) * PAGE_SIZE + idx + 1}</div>
                </TableColumn>
                <TableColumn>
                  {b.photoUrl ? (
                    <img src={b.photoUrl} alt={b.name} className="w-12 h-8 object-cover rounded" />
                  ) : (
                    <div className="w-12 h-8 bg-gray-100" />
                  )}
                </TableColumn>
                <TableColumn>{b.name}</TableColumn>
                <TableColumn>{b.title ?? "—"}</TableColumn>
                <TableColumn>
                  <span className="block line-clamp-1">{b.officeAddress ?? "—"}</span>
                </TableColumn>
                <TableColumn className="text-sm text-gray-600">
                  {b.socialLinks && b.socialLinks.length > 0 ? (
                    <div className="flex items-center gap-2">
                      {b.socialLinks.map((link, idx) => {
                        const Icon = SOCIAL_ICON_MAP[link.platform]
                        if (!Icon) return null
                        return <Icon key={`${link.platform}-${idx}`} className="w-4 h-4 text-orange-500" />
                      })}
                    </div>
                  ) : (
                    <span className="block line-clamp-1">—</span>
                  )}
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


      <EmployeeCreateModal open={showCreate} onClose={() => setShowCreate(false)} onCreate={handleCreate} />
    </div>
  )
}

export default EmployeeLayout