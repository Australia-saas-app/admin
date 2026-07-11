"use client"

import { Button } from "@/src/shared/ui/ui/button"
import PageHeader from "@/src/shared/ui/ui/PageHeader"
import { Pagination } from "@/src/shared/ui/ui/pagination"
import { Table, TableBody, TableColumn, TableHeading, TableRow } from "@/src/shared/ui/table"
import { fetchGalleryImages, createGalleryCategory, updateGalleryCategory } from "@/src/business/dashboard/services/gallery"
import type { GalleryImage } from "@/src/business/dashboard/types/gallery"
import { Trash2, Edit2, Upload, Eye } from "lucide-react"
import React, { useEffect, useState, useCallback } from "react"
import GalleryCreateModal from "./GalleryCreateModal"
import GalleryEditModal from "./GalleryEditModal"
import GalleryUploadModal from "./GalleryUploadModal"
import GalleryViewImagesModal from "./GalleryViewImagesModal"
import { Badge } from "@/src/shared/ui/ui/badge"

const PAGE_SIZE = 20

const GalleryLayout: React.FC = () => {
  const [items, setItems] = useState<GalleryImage[]>([])
  const [totalItems, setTotalItems] = useState(0)
  const [loading, setLoading] = useState(false)
  const [showCreate, setShowCreate] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [uploadId, setUploadId] = useState<string | null>(null)
  const [viewId, setViewId] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  const loadData = useCallback(async (page: number) => {
    setLoading(true)
    try {
      const { data, total } = await fetchGalleryImages(page, PAGE_SIZE)
      setItems(data)
      setTotalItems(total)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData(currentPage)
  }, [currentPage, loadData])

  const handleCreate = async (data: Omit<GalleryImage, "id">) => {
    try {
      await createGalleryCategory(data)
      setShowCreate(false)
      loadData(1)
      setCurrentPage(1)
    } catch (err) {
      alert("Failed to create gallery category")
    }
  }

  const handleUpdate = async (data: Partial<GalleryImage>) => {
    if (!editId) return
    try {
      await updateGalleryCategory(editId, data)
      setEditId(null)
      loadData(currentPage)
    } catch (err) {
      alert("Failed to update gallery category")
    }
  }

  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE))

  return (
    <div className="mt-5">
      <PageHeader
        title="Gallery Categories"
        right={
          <div className="flex gap-2 items-center">
            <Button onClick={() => setShowCreate(true)} className="bg-blue-600 text-white hover:bg-blue-700 shadow-sm">Add Category</Button>
          </div>
        }
      />

      <div className="mt-4">
        {loading ? (
          <div className="p-8 text-center text-gray-500 italic">Loading gallery categories...</div>
        ) : (
          <Table className="shadow">
            <TableHeading className="bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-slate-200">
              <TableColumn isHeader align="left">Category Name</TableColumn>
              <TableColumn isHeader align="left">Description</TableColumn>
              <TableColumn isHeader align="center">Visibility</TableColumn>
              <TableColumn isHeader align="center">Action</TableColumn>
            </TableHeading>

            <TableBody isEmpty={items.length === 0} colSpan={4}>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableColumn className="text-gray-800 font-semibold">{item.categoryName}</TableColumn>
                  <TableColumn className="text-gray-800">{item.description}</TableColumn>
                  <TableColumn align="center">
                    <Badge className={item.isVisible ? "bg-green-500 text-white" : "bg-gray-600 text-white"}>
                      {item.isVisible ? "Visible" : "Hidden"}
                    </Badge>
                  </TableColumn>
                  <TableColumn align="center">
                    <div className="flex justify-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => setViewId(item.id)} className="text-gray-500">
                        <Eye size={16} />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setEditId(item.id)} className="text-blue-500">
                        <Edit2 size={16} />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setUploadId(item.id)} className="text-green-500">
                        <Upload size={16} />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => {/* Handle delete */ }} className="text-red-500">
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableColumn>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <div className="mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={PAGE_SIZE}
            totalResults={totalItems}
            onPageChange={(p) => setCurrentPage(p)}
          />
        </div>
      </div>

      <GalleryCreateModal open={showCreate} onClose={() => setShowCreate(false)} onCreate={handleCreate} />
      <GalleryEditModal open={!!editId} id={editId} onClose={() => setEditId(null)} onUpdate={handleUpdate} />
      <GalleryUploadModal open={!!uploadId} categoryId={uploadId} onClose={() => setUploadId(null)} onSuccess={() => loadData(currentPage)} />
      <GalleryViewImagesModal open={!!viewId} categoryId={viewId} onClose={() => setViewId(null)} />
    </div>
  )
}

export default GalleryLayout
