'use client'
import React, { useState, useEffect } from 'react'
import PlatformLayout from '@/src/business/dashboard/shared/components/PlatformLayout'
import {  galleryService } from '@/src/business/dashboard/services/platform'

import { TableColumn } from '@/src/shared/ui/table'
import { FileText } from 'lucide-react'
import ConfirmDeleteModal from '@/src/shared/ui/modals/confirm-delete-modal'
import { toast } from 'sonner'
import { getApiErrorMessage } from '@/src/shared/utils/ApiErrorMessage'

import { GalleryViewModal } from '@/src/business/dashboard/gallery/components/GalleryViewModal'
import GalleryEditModal from '@/src/business/dashboard/gallery/components/GalleryEditModal'
import GalleryCreateModal from '@/src/business/dashboard/gallery/components/GalleryCreateModal'



const Page = () => {
    const [refreshKey, setRefreshKey] = useState(0)
    const [showCreate, setShowCreate] = useState(false)
    const [editId, setEditId] = useState<string | null>(null)
    const [deleteId, setDeleteId] = useState<string | null>(null)
    const [viewId, setViewId] = useState<string | null>(null)
    const [viewData, setViewData] = useState<any>(null)
    const [viewLoading, setViewLoading] = useState(false)
    const [mounted, setMounted] = useState(false)



    useEffect(() => { setMounted(true) }, [])

    useEffect(() => {
        if (viewId) {
            setViewLoading(true)
            galleryService.getItem(viewId).then(setViewData).finally(() => setViewLoading(false))
        }
    }, [viewId])

    const handleCreate = async (data: any) => {
        try {
            const formData = new FormData()


            formData.append("title", data.title)
            formData.append("description", data.description)
            formData.append("category", data.category)
            formData.append("isVisible", data.isVisible)

            if (data.file) {
                formData.append("file", data.file)
            }


            const result = await galleryService.createItem(formData)


            if (result?.status === 201) {
                toast.success(
                    result?.data?.message
                )
                setShowCreate(false)
                setRefreshKey((p) => p + 1)
            }


        } catch (err: any) {
            toast.error(getApiErrorMessage(err, "Failed to create Gallery item"))

        
        }
    };

    const handleUpdate = async (id: string, data: any) => {
        try {

            const formData = new FormData();
            formData.append('title', data.title || "");
            formData.append('description', data.description || "");
            formData.append('category', data.category || "");
            formData.append('isVisible', data.isVisible);


            // Only append file if it is a new File object
            if (data.file instanceof File) {
                formData.append('file', data.file);
            }


            await galleryService.updateItem(id, formData);
            toast.success("Gallery item updated successfully")
            setEditId(null);
            setRefreshKey(p => p + 1);
        } catch (err: any) {
 
            toast.error(getApiErrorMessage(err, "Failed to update gallery item"))
        }
    }



    const handleDelete = async () => {
        if (!deleteId) return
        try {
            await galleryService.deleteItem(deleteId)

            toast.success("Gallery item deleted successfully")

            setDeleteId(null)
            setRefreshKey(p => p + 1)
        } catch (err) {
            toast.error(getApiErrorMessage(err, "Failed to delete gallery item"))
        }
    }

    const handleToggleVisibility = async (id: string) => {
        if (!id) return
        try {
            await galleryService.toggleItemVisibility(id)
            toast.success("Gallery item visibility updated successfully")
            setRefreshKey(p => p + 1)
        } catch (err) {
            toast.error(getApiErrorMessage(err, "Failed to update gallery item visibility"))
        }
    }


    return (
        <>

            <PlatformLayout
                title="Gallery"
                fetchItems={galleryService.fetchItems}
                refreshKey={refreshKey}
                onAddClick={() => setShowCreate(true)}
                onEditClick={(id) => setEditId(id)}
                onDeleteClick={(id) => setDeleteId(id)}
                onViewClick={(id) => setViewId(id)}
                onToggleVisibilityClick={(id) => handleToggleVisibility(id)}
                colSpan={5}
                onSearch={(q) => {
                    console.log("Search:", q)
                }}
                extraColumns={
                    <>
                        <TableColumn isHeader align="left">Description</TableColumn>
                            <TableColumn isHeader align="left">Category</TableColumn>
                        <TableColumn isHeader align="center">File</TableColumn>
                    </>
                }
                renderExtraCells={(item: any) => (
                    <React.Fragment key={item.id}>
                        <TableColumn title={item?.description} >
                            <div

                                className="text-gray-700 text-base leading-relaxed "
                                dangerouslySetInnerHTML={{ __html: item?.description || "<i>No description available</i>" }}
                            ></div>
                        </TableColumn>
                       

                        <TableColumn title={item?.category} align="center">
                            {
                                item?.category
                            }

                        </TableColumn>
                      

                        <TableColumn align="center">
                            {item?.media ? (
                                <a href={item?.media?.url} target="_blank" rel="noreferrer"
                                    className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors inline-flex">
                                    <FileText size={18} />
                                </a>
                            ) : (
                                <span className="text-gray-300 italic text-xs">No file available</span>
                            )}
                        </TableColumn>
                    </React.Fragment>
                )}
            />

            {mounted && (
                <>
                    <GalleryCreateModal open={showCreate} onClose={() => setShowCreate(false)} onCreate={handleCreate} />
                    <GalleryEditModal
                        open={!!editId}
                        id={editId}
                        onClose={() => setEditId(null)}
                        onUpdate={(data) => {
                            if (editId) {
                                handleUpdate(editId, data);
                            }
                        }}
                    />


                    {deleteId && (
                        <ConfirmDeleteModal
                            message={`Are you sure you want to delete this gallery item?`}
                            onConfirm={handleDelete}

                            onCancel={() => setDeleteId(null)}
                        />
                    )}


                    <GalleryViewModal isOpen={!!viewId} onClose={() => setViewId(null)} data={viewData} loading={viewLoading} />
                </>
            )}
        </>
    )
}

export default Page
