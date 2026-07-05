'use client'
import React, { useState, useEffect } from 'react'
import PlatformLayout from '@/src/modules/dashboard/shared/components/PlatformLayout'
import { blogService } from '@/src/modules/dashboard/services/platform'

import { TableColumn } from '@/src/components/table'
import { FileText } from 'lucide-react'
import ConfirmDeleteModal from '@/src/components/modals/confirm-delete-modal'
import { toast } from 'sonner'
import { getApiErrorMessage } from '@/src/utils/ApiErrorMessage'
import BlogCreateModal from '@/src/modules/dashboard/blogs/BlogCreateModal'
import BlogEditModal from '@/src/modules/dashboard/blogs/BlogEditModal'
import { BlogViewModal } from '@/src/modules/dashboard/blogs/BlogViewModal'



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
            blogService.getItem(viewId).then(setViewData).finally(() => setViewLoading(false))
        }
    }, [viewId])

    const handleCreate = async (data: any) => {
        try {
            const formData = new FormData()


            formData.append("title", data.title)
            formData.append("content", data.content)
            formData.append("excerpt", data.excerpt)
            formData.append("category", data.category)
            formData.append("tags", data.tags)
            formData.append("isVisible", data.isVisible)

            if (data.file) {
                formData.append("file", data.file)
            }

      

            const result = await blogService.createItem(formData)


            if (result?.status === 201) {
                toast.success(
                    result?.data?.message
                )
                setShowCreate(false)
                setRefreshKey((p) => p + 1)
            }


        } catch (err: any) {
            toast.error(getApiErrorMessage(err, "Failed to create blog"))

        }
    };

    const handleUpdate = async (id: string, data: any) => {
        try {

            const formData = new FormData();
            formData.append('title', data.title || "");
            formData.append('content', data.content || "");
            formData.append('excerpt', data.excerpt || "");
            formData.append('category', data.category || "");
            formData.append('tags', data.tags || "");
            formData.append('isVisible', data.isVisible);


            // Only append file if it is a new File object
            if (data.file instanceof File) {
                formData.append('file', data.file);
            }


            await blogService.updateItem(id, formData);
            toast.success("Blog updated successfully")
            setEditId(null);
            setRefreshKey(p => p + 1);
        } catch (err: any) {
           
            toast.error(getApiErrorMessage(err, "Failed to update blog"))
        }
    }



    const handleDelete = async () => {
        if (!deleteId) return
        try {
            await blogService.deleteItem(deleteId)

            toast.success("Blog deleted successfully")

            setDeleteId(null)
            setRefreshKey(p => p + 1)
        } catch (err) {
            toast.error(getApiErrorMessage(err, "Failed to delete blog"))
        }
    }

    const handleToggleVisibility = async (id: string) => {
        if (!id) return
        try {
            await blogService.toggleItemVisibility(id)
            toast.success("Blog visibility updated successfully")
            setRefreshKey(p => p + 1)
        } catch (err) {
            toast.error(getApiErrorMessage(err, "Failed to update blog visibility"))
        }
    }


    return (
        <>

            <PlatformLayout
                title="Blog"
                fetchItems={blogService.fetchItems}
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

                        <TableColumn isHeader align="left">Content</TableColumn>
                        <TableColumn isHeader align="left">Excerpt</TableColumn>
                        <TableColumn isHeader align="center">Category</TableColumn>
                        <TableColumn isHeader align="center">Tags</TableColumn>
                        <TableColumn isHeader align="center">File</TableColumn>
                    </>
                }
                renderExtraCells={(item: any) => (
                    <React.Fragment key={item.id}>
                        <TableColumn title={item?.content} >
                            <div

                                className="text-gray-700 text-base leading-relaxed "
                                dangerouslySetInnerHTML={{ __html: item?.content || "<i>No content available</i>" }}
                            ></div>
                        </TableColumn>
                        <TableColumn title={item?.excerpt} align="center">
                            {
                                item?.excerpt
                            }

                        </TableColumn>

                        <TableColumn title={item?.category} align="center">
                            {
                                item?.category
                            }

                        </TableColumn>
                        <TableColumn title={item?.tags?.join(", ")} align="center">
                            {
                                item?.tags?.length > 0 ? item.tags.join(", ") : <span className="text-gray-300 italic text-xs">No tags</span>
                            }
                        </TableColumn>

                        <TableColumn align="center">
                            {item?.photo ? (
                                <a href={item?.photo?.url} target="_blank" rel="noreferrer"
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
                    <BlogCreateModal open={showCreate} onClose={() => setShowCreate(false)} onCreate={handleCreate} />
                    <BlogEditModal
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
                            message={`Are you sure you want to delete this blog?`}
                            onConfirm={handleDelete}

                            onCancel={() => setDeleteId(null)}
                        />
                    )}


                    <BlogViewModal isOpen={!!viewId} onClose={() => setViewId(null)} data={viewData} loading={viewLoading} />
                </>
            )}
        </>
    )
}

export default Page