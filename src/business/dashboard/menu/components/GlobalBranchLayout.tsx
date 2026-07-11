"use client"

import { Table, TableBody, TableColumn, TableHeading, TableRow } from "@/src/shared/ui/table"
import { Button } from "@/src/shared/ui/ui/button"
import PageHeader from "@/src/shared/ui/ui/PageHeader"
import { Pagination } from "@/src/shared/ui/ui/pagination"
import { fetchGlobalBranches } from "@/src/business/dashboard/menu/services/globalBranches"
import type { GlobalBranch } from "@/src/business/dashboard/menu/types/globalBranch"
import { Edit2, Facebook, Instagram, Linkedin, Trash2, Twitter, Youtube } from "lucide-react"
import React, { useEffect, useMemo, useState } from "react"
import GlobalBranchCreateModal from "./GlobalBranchCreateModal"

const PAGE_SIZE = 12

const SOCIAL_ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  facebook: Facebook,
  twitter: Twitter,
  instagram: Instagram,
  linkedin: Linkedin,
  youtube: Youtube,
}

const GlobalBranchLayout: React.FC = () => {
  const [branches, setBranches] = useState<GlobalBranch[]>([])
  const [query, setQuery] = useState("")
  const [page, setPage] = useState(1)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    let mounted = true
    fetchGlobalBranches().then((data) => {
      if (mounted) setBranches(data)
    })
    return () => {
      mounted = false
    }
  }, [])

  const filtered = useMemo(() => {
    if (!query) return branches
    return branches.filter((b) =>
      b.name.toLowerCase().includes(query.toLowerCase()) ||
      (b.call || "").includes(query) ||
      (b.email || "").toLowerCase().includes(query.toLowerCase()) ||
      (b.socialLinks || []).some((s) => s.url.toLowerCase().includes(query.toLowerCase()) || s.platform.toLowerCase().includes(query.toLowerCase()))
    )
  }, [branches, query])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleCreate = (payload: { name: string; call?: string; email?: string; officeAddress?: string; socialLinks?: Array<{ platform: string; url: string }>; flag?: File | null }) => {
    const newBranch: GlobalBranch = {
      id: String(Date.now()),
      name: payload.name,
      flagUrl: payload.flag ? URL.createObjectURL(payload.flag) : undefined,
      call: payload.call,
      email: payload.email,
      officeAddress: payload.officeAddress,
      socialLinks: payload.socialLinks,
      active: true,
    }
    setBranches((p) => [newBranch, ...p])
    setShowModal(false)
    setPage(1)
  }

  const handleDelete = (id: string) => {
    if (!confirm("Delete this company?")) return
    setBranches((s) => s.filter((i) => i.id !== id))
  }

  const toggleActive = (id: string) => {
    setBranches((s) => s.map((it) => (it.id === id ? { ...it, active: !it.active } : it)))
  }

  return (
    <div className="">
      <PageHeader
        title="Global Branch"
        right={
          <div className="flex items-center gap-3">
            <div className="w-56">
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search..." className="w-full h-11 px-4 rounded-md border border-input bg-white text-sm" />
            </div>
            <Button onClick={() => setShowModal(true)}>Create</Button>
          </div>
        }
      />

      <div className="mt-4">
        <Table>
          <TableHeading>
            <TableColumn className="w-16" isHeader>No.</TableColumn>
            <TableColumn isHeader>Photo</TableColumn>
            <TableColumn isHeader>Name</TableColumn>
            <TableColumn isHeader>Call</TableColumn>
            <TableColumn isHeader>E-Mail</TableColumn>
            <TableColumn isHeader>Office Address</TableColumn>
            <TableColumn isHeader>Social Link</TableColumn>
            <TableColumn className="w-32 " isHeader >Action</TableColumn>
          </TableHeading>
          <TableBody isEmpty={pageItems.length === 0} colSpan={8}>
            {pageItems.map((b, idx) => (
              <TableRow key={b.id} className="relative">
                <TableColumn className="w-16 flex justify-center items-center">
                  <div className="text-center w-5 h-5 bg-primary text-white rounded">{(page - 1) * PAGE_SIZE + idx + 1}</div>
                </TableColumn>
                <TableColumn>
                  {b.flagUrl ? (
                    <img src={b.flagUrl} alt={b.name} className="w-12 h-8 object-cover rounded" />
                  ) : (
                    <div className="w-12 h-8 bg-gray-100" />
                  )}
                </TableColumn>
                <TableColumn>{b.name}</TableColumn>
                <TableColumn>{b.call ?? "—"}</TableColumn>
                <TableColumn>
                  <span className="block line-clamp-1">{b.email ?? "—"}</span>
                </TableColumn>
                <TableColumn className="text-sm text-gray-600">{b.officeAddress ?? "—"}</TableColumn>
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

      <div className="pt-4">
        <Pagination currentPage={page} totalPages={totalPages} pageSize={PAGE_SIZE} totalResults={filtered.length} onPageChange={(p) => setPage(p)} />
      </div>

      <GlobalBranchCreateModal isOpen={showModal} onClose={() => setShowModal(false)} onCreate={handleCreate} />
    </div>
  )
}

export default GlobalBranchLayout