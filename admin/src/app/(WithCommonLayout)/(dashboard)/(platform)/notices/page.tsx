'use client'
import React, { useState, useEffect } from 'react'
import PlatformLayout from '@/src/business/dashboard/shared/components/PlatformLayout'
import { noticeService } from '@/src/business/dashboard/services/platform'
import NoticeCreateModal from '@/src/business/dashboard/notices/components/NoticeCreateModal'
import NoticeEditModal from '@/src/business/dashboard/notices/components/NoticeEditModal'
import { NoticeViewModal } from '@/src/business/dashboard/notices/components/NoticeViewModal'
import { TableColumn } from '@/src/shared/ui/table'
import { FileText } from 'lucide-react'
import ConfirmDeleteModal from '@/src/shared/ui/modals/confirm-delete-modal'
import { toast } from 'sonner'
import { getApiErrorMessage } from '@/src/shared/utils/ApiErrorMessage'



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
            noticeService.getItem(viewId).then(setViewData).finally(() => setViewLoading(false))
        }
    }, [viewId])

    const handleCreate = async (data: any) => {
        try {
            const formData = new FormData()


            formData.append("title", data.title)
            formData.append("description", data.description)
            formData.append("priority", data.priority)
            formData.append("isVisible", data.isVisible)

            if (data.file) {
                formData.append("file", data.file)
            }

            // 🔍 DEBUG (VERY IMPORTANT)
            // for (let pair of formData.entries()) {
            //     console.log(pair[0], pair[1])
            // }

            const result = await noticeService.createItem(formData)


            if (result?.status === 201) {
                toast.success(
                    result?.data?.message
                )
                setShowCreate(false)
                setRefreshKey((p) => p + 1)
            }


        } catch (err: any) {
            toast.error(getApiErrorMessage(err, "Failed to create notice"))

            // console.log("FULL ERROR OBJECT:", err)
            //  toast.error()

            // if (err.response) {
            //     console.log("STATUS:", err.response.status)
            //     console.log("DATA:", err.response.data)
            // } else {
            //     console.log("NO RESPONSE → NETWORK / FORMAT ISSUE")
            //     console.log("MESSAGE:", err.message)
            // }
        }
    };

    const handleUpdate = async (id: string, data: any) => {
        try {
   

            const formData = new FormData();
            formData.append('title', data.title || "");
            formData.append('description', data.description || "");
            formData.append('priority', data.priority || "medium");
            formData.append('isVisible', data.isVisible);

            // Only append file if it is a new File object
            if (data.file instanceof File) {
                formData.append('file', data.file);
            }

            // Log the final FormData keys to verify
            // for (let pair of formData.entries()) {
            //     console.log(pair[0] + ': ' + pair[1]);
            // }

            await noticeService.updateItem(id, formData);
            toast.success("Notice updated successfully")
            setEditId(null);
            setRefreshKey(p => p + 1);
        } catch (err: any) {
            // This will show you the ACTUAL status code and response
            // console.error("Full Axios Error:", err);
            // console.error("Server Response Data:", err.response?.data);
            // alert(`Update failed: ${err.response?.data?.message || "Internal Server Error"}`);
            toast.error(getApiErrorMessage(err, "Failed to update notice"))
        }
    }



    const handleDelete = async () => {
        if (!deleteId) return
        try {
            await noticeService.deleteItem(deleteId)

            toast.success("Notice deleted successfully")

            setDeleteId(null)
            setRefreshKey(p => p + 1)
        } catch (err) {
            toast.error(getApiErrorMessage(err, "Failed to delete notice"))
        }
    }

    const handleToggleVisibility = async (id: string) => {
        if (!id) return
        try {
            await noticeService.toggleItemVisibility(id)
            toast.success("Notice visibility updated successfully")
            setRefreshKey(p => p + 1)
        } catch (err) {
            toast.error(getApiErrorMessage(err, "Failed to update notice visibility"))
        }
    }


    return (
        <>

            <PlatformLayout
                title="Notices"
                fetchItems={noticeService.fetchItems}
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
                        <TableColumn isHeader align="center">Priority</TableColumn>
                        <TableColumn isHeader align="center">File</TableColumn>
                    </>
                }
                renderExtraCells={(item: any) => (
                    <React.Fragment key={item.id}>
                        <TableColumn title={item?.description} >
                            <div

                                className="text-gray-700 text-base leading-relaxed "
                                dangerouslySetInnerHTML={{ __html: item.description || "<i>No description</i>" }}
                            ></div>
                        </TableColumn>
                        <TableColumn title={item?.priority} className="flex items-center justify-center">
                            <div className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${item?.priority === "high" ? "bg-red-100 text-red-800" : item?.priority === "medium" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}`}>
                                {item?.priority}
                            </div>
                        </TableColumn>
                        <TableColumn align="center">
                            {item?.file ? (
                                <a href={item?.file?.url} target="_blank" rel="noreferrer"
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
                    <NoticeCreateModal open={showCreate} onClose={() => setShowCreate(false)} onCreate={handleCreate} />
                    <NoticeEditModal
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
                            message={`Are you sure you want to delete this notice?`}
                            onConfirm={handleDelete}

                            onCancel={() => setDeleteId(null)}
                        />
                    )}


                    <NoticeViewModal isOpen={!!viewId} onClose={() => setViewId(null)} data={viewData} loading={viewLoading} />
                </>
            )}
        </>
    )
}

export default Page
