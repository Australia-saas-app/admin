"use client"

import { SearchInput } from "@/src/components/form/search-input"
import { Table, TableBody, TableColumn, TableHeading, TableRow } from "@/src/components/table"
import PageHeader from "@/src/components/ui/PageHeader"
import { Button } from "@/src/components/ui/button"
import { Pagination } from "@/src/components/ui/pagination"
import { fetchBlogs } from "@/src/modules/dashboard/menu/services/blogs"
import type { Blog } from "@/src/modules/dashboard/menu/types/blog"
import { Edit2, Trash2 } from "lucide-react"
import React, { useEffect, useMemo, useState } from "react"
import BlogCreateModal from "./BlogCreateModal"

const PAGE_SIZE = 12

const BlogyLayout: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [query, setQuery] = useState("")
  const [page, setPage] = useState(1)
  const [showModal, setShowModal] = useState(false)

  // Strip HTML tags from content
  const stripHtml = (html?: string) => {
    if (!html) return ""
    return html.replace(/<[^>]*>/g, "").substring(0, 100)
  }

  useEffect(() => {
    let mounted = true
    fetchBlogs().then((data) => {
      if (mounted) setBlogs(data)
    })
    return () => {
      mounted = false
    }
  }, [])

  const filtered = useMemo(() => {
    if (!query) return blogs
    return blogs.filter((b) => {
      const q = query.toLowerCase()
      const matchesTitle = b.title.toLowerCase().includes(q)
      const matchesExcerpt = (b.excerpt || "").toLowerCase().includes(q)
      return matchesTitle || matchesExcerpt
    })
  }, [blogs, query])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleCreate = (payload: { title: string; content?: string; excerpt?: string; cover?: File | null }) => {
    const newBlog: Blog = {
      id: String(Date.now()),
      title: payload.title,
      publishDate: new Date().toISOString().split("T")[0],
      content: payload.content,
      excerpt: payload.excerpt,
      coverUrl: payload.cover ? URL.createObjectURL(payload.cover) : undefined,
      active: true,
    }
    setBlogs((p) => [newBlog, ...p])
    setShowModal(false)
    setPage(1)
  }

  const handleDelete = (id: string) => {
    if (!confirm("Delete this company?")) return
    setBlogs((s) => s.filter((i) => i.id !== id))
  }

  const toggleActive = (id: string) => {
    setBlogs((s) => s.map((it) => (it.id === id ? { ...it, active: !it.active } : it)))
  }

  return (
    <div >
      <PageHeader
        title="Blog"
        right={
          <div className="flex gap-2 items-center">
            <div className="w-48">
              <SearchInput value={query} onChange={setQuery} placeholder="Search" />
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
            <TableColumn isHeader>Title</TableColumn>
            <TableColumn isHeader>Content</TableColumn>
            <TableColumn className="w-32 " isHeader >Action</TableColumn>
          </TableHeading>
          <TableBody isEmpty={pageItems.length === 0} colSpan={8}>
            {pageItems.map((b, idx) => (
              <TableRow key={b.id} className="relative">
                <TableColumn className="w-16 flex justify-center items-center">
                  <div className="text-center w-5 h-5 bg-primary text-white rounded">{(page - 1) * PAGE_SIZE + idx + 1}</div>
                </TableColumn>
                <TableColumn>
                  {b.coverUrl ? (
                    <img src={b.coverUrl} alt={b.title} className="w-12 h-8 object-cover rounded" />
                  ) : (
                    <div className="w-12 h-8 bg-gray-100" />
                  )}
                </TableColumn>
                <TableColumn>{b.title}</TableColumn>
                <TableColumn className="line-clamp-2">{stripHtml(b.content)}</TableColumn>

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

      <BlogCreateModal isOpen={showModal} onClose={() => setShowModal(false)} onCreate={handleCreate} />
    </div>
  )
}

export default BlogyLayout