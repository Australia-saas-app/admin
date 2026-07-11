'use client'
import React, { useState, useEffect } from 'react'
import PlatformLayout from '@/src/business/dashboard/shared/components/PlatformLayout'
import { teamService } from '@/src/business/dashboard/services/platform'

import { TableColumn } from '@/src/shared/ui/table'

import ConfirmDeleteModal from '@/src/shared/ui/modals/confirm-delete-modal'
import { toast } from 'sonner'
import { getApiErrorMessage } from '@/src/shared/utils/ApiErrorMessage'

import TeamCreateModal from '@/src/business/dashboard/our-team/components/TeamCreateModal'
import TeamEditModal from '@/src/business/dashboard/our-team/components/TeamEditModal'
import { TeamViewModal } from '@/src/business/dashboard/our-team/components/TeamViewModal'
import Image from 'next/image'
import { uploadImageToStorage } from '@/src/business/dashboard/services/gallery'



const Page = () => {
    // Standard States
    const [showCreate, setShowCreate] = useState(false)
    const [viewId, setViewId] = useState<string | null>(null)
    const [deleteId, setDeleteId] = useState<string | null>(null)
    const [refreshKey, setRefreshKey] = useState(0)
    const [loading, setLoading] = useState(false)
    const [mounted, setMounted] = useState(false)

    // View States
    const [viewLoading, setViewLoading] = useState(false)
    const [viewData, setViewData] = useState<any | null>(null)

    // ✅ Edit States (Added these to fix the "not working" issue)
    const [editId, setEditId] = useState<string | null>(null)
    const [existingData, setExistingData] = useState<any>(null)
    const [fetchingData, setFetchingData] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    // Handle View Data Fetching
    useEffect(() => {
        if (viewId) {
            setViewLoading(true)
            teamService.getItem(viewId)
                .then(data => setViewData(data))
                .finally(() => setViewLoading(false))
        }
    }, [viewId])

    // ✅ Handle Edit Data Fetching (Added this)
    useEffect(() => {
        if (editId) {
            setFetchingData(true)
            teamService.getItem(editId)
                .then(data => setExistingData(data))
                .finally(() => setFetchingData(false))
        } else {
            setExistingData(null)
        }
    }, [editId])

    const handleCreate = async (data: any) => {
        setLoading(true)
        try {
            if (data.photoUrl instanceof File) {
                const storageRes = await uploadImageToStorage(data.photoUrl, "admin-123", "5c2e248a-36dc-43cb-aa99-b3a78b238924", "admin,internal")
                if (storageRes?.url) data.photoUrl = storageRes.url
            }
            await teamService.createItem(data)
            toast.success("Team member created successfully")
            setShowCreate(false)
            setRefreshKey((prev) => prev + 1)
        } catch (err: any) {
            toast.error(getApiErrorMessage(err, "Failed to create team member"))

        } finally {
            setLoading(false)
        }
    }

    // ✅ Handle Update Action (Added this)
    const handleUpdate = async (id: string, data: any) => {
        if (!id) return
        setLoading(true)
        try {
            if (data.photoUrl instanceof File) {
                const storageRes = await uploadImageToStorage(data.photoUrl, "admin-123", "5c2e248a-36dc-43cb-aa99-b3a78b238924", "admin,internal")
                if (storageRes?.url) data.photoUrl = storageRes.url
            }
            await teamService.updateItem(id, data)
            toast.success("Team member updated successfully")
            setEditId(null)
            setRefreshKey((prev) => prev + 1)
        } catch (err) {

            toast.error(getApiErrorMessage(err, "Failed to update team member"))
        } finally {
            setLoading(false)
        }
    }



    const handleDelete = async () => {
        if (!deleteId) return
        try {
            await teamService.deleteItem(deleteId)

            toast.success("Team deleted successfully")

            setDeleteId(null)
            setRefreshKey(p => p + 1)
        } catch (err) {
            toast.error(getApiErrorMessage(err, "Failed to delete team"))
        }
    }

    const handleToggleVisibility = async (id: string) => {
        if (!id) return
        try {
            await teamService.toggleItemVisibility(id)
            toast.success("Team visibility updated successfully")
            setRefreshKey(p => p + 1)
        } catch (err) {
            toast.error(getApiErrorMessage(err, "Failed to update team visibility"))
        }
    }


    return (
        <>

            <PlatformLayout
                title="Our Team"
                fetchItems={teamService.fetchItems}
                refreshKey={refreshKey}
                onAddClick={() => setShowCreate(true)}
                onEditClick={(id) => setEditId(id)}
                onDeleteClick={(id) => setDeleteId(id)}
                onViewClick={(id) => setViewId(id)}
                onToggleVisibilityClick={(id) => handleToggleVisibility(id)}
                colSpan={5}
                onSearch={(q) => {
                    // Implement search logic here if your API supports it
                }}
                extraColumns={
                    <>


                        <TableColumn isHeader align="left">Name</TableColumn>
                        <TableColumn isHeader align="left">Photo</TableColumn>
                        <TableColumn isHeader align="left">Employee ID</TableColumn>
                        <TableColumn isHeader align="left">Salary</TableColumn>
                        <TableColumn isHeader align="left">Position</TableColumn>
                        <TableColumn isHeader align="left">Department</TableColumn>


                    </>
                }
                renderExtraCells={(item: any) => (
                    <React.Fragment key={item.id}>


                        <TableColumn title={item?.firstName + " " + item?.lastName} align="center">
                            {
                                (item?.firstName || item?.lastName) ? `${item.firstName || ""} ${item.lastName || ""}`.trim() : <span className="text-gray-300 italic text-xs">No name provided</span>
                            }
                        </TableColumn>

                        <TableColumn title={item?.photoUrl} align="center">
                            {
                                item?.photoUrl ? (
                                    <Image src={item.photoUrl} alt={item?.firstName || "Team Member"} width={50} height={50} className="rounded-full object-cover" />
                                ) : (
                                    <span className="text-gray-300 italic text-xs">No photo</span>
                                )

                            }
                        </TableColumn>
                        <TableColumn title={item?.employeeId} align="center">
                            {
                                item?.employeeId
                            }
                        </TableColumn>
                        <TableColumn title={item?.salary} align="center">
                            {
                                item?.salary ? `$${item.salary}` : <span className="text-gray-300 italic text-xs">No salary info</span>
                            }
                        </TableColumn>
                        <TableColumn title={item?.position} align="center">
                            {
                                item?.position || <span className="text-gray-300 italic text-xs">No position info</span>
                            }
                        </TableColumn>
                        <TableColumn title={item?.department} align="center">
                            {
                                item?.department || <span className="text-gray-300 italic text-xs">No department info</span>
                            }
                        </TableColumn>

                    </React.Fragment>
                )}
            />

            {mounted && (
                <>
                    {/* Create Modal */}
                    <TeamCreateModal
                        isOpen={showCreate}
                        onClose={() => setShowCreate(false)}
                        onCreate={handleCreate}
                        isSubmitting={loading}
                    />

                    {/* ✅ Edit Modal (Connected to new states) */}
                    <TeamEditModal
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
                            message={`Are you sure you want to delete this team?`}
                            onConfirm={handleDelete}

                            onCancel={() => setDeleteId(null)}
                        />
                    )}


                    <TeamViewModal isOpen={!!viewId} onClose={() => setViewId(null)} data={viewData} loading={viewLoading} />
                </>
            )}
        </>
    )
}

export default Page
