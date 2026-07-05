"use client"

import React, { useState, useEffect } from 'react'
import PlatformLayout from '@/src/modules/dashboard/shared/components/PlatformLayout'
import { branchService } from '@/src/modules/dashboard/services/platform'
import BranchCreateModal from '@/src/modules/dashboard/branches/components/BranchCreateModal'
import BranchEditModal from '@/src/modules/dashboard/branches/components/BranchEditModal'
import { BranchViewModal } from '@/src/modules/dashboard/branches/components/BranchViewModal'
import { TableColumn } from '@/src/components/table'
import { getApiErrorMessage } from '@/src/utils/ApiErrorMessage'
import { toast } from 'sonner'
import ConfirmDeleteModal from '@/src/components/modals/confirm-delete-modal'
import FormatDate from '@/src/utils/FormatDate'

const Page = () => {
    const [showCreate, setShowCreate] = useState(false)
    const [editId, setEditId] = useState<string | null>(null)
    const [editData, setEditData] = useState<any | null>(null)
    const [viewId, setViewId] = useState<string | null>(null)
    const [deleteId, setDeleteId] = useState<string | null>(null)
    const [refreshKey, setRefreshKey] = useState(0)
    const [loading, setLoading] = useState(false)
    const [viewLoading, setViewLoading] = useState(false)
    const [viewData, setViewData] = useState<any | null>(null)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (editId) {
            branchService.getItem(editId).then(data => setEditData(data))
        } else {
            setEditData(null)
        }
    }, [editId])

    useEffect(() => {
        if (viewId) {
            setViewLoading(true)
            branchService.getItem(viewId)
                .then(data => setViewData(data))
                .finally(() => setViewLoading(false))
        } else {
            setViewData(null)
        }
    }, [viewId])

    const handleCreate = async (data: any) => {
        setLoading(true)
        try {
            await branchService.createItem(data)
            toast.success("Branch created successfully")
            setShowCreate(false)
            setRefreshKey((prev) => prev + 1)
        } catch (err) {

            toast.error(getApiErrorMessage(err, "Failed to add branch"))
        } finally {
            setLoading(false)
        }
    }

    const handleUpdate = async (data: any) => {
        if (!editId) return
        setLoading(true)
        try {
            await branchService.updateItem(editId, data)
            toast.success("Branch updated successfully")

            setEditId(null)
            setRefreshKey((prev) => prev + 1)
        } catch (err) {
            toast.error(getApiErrorMessage(err, "Failed to update branch"))
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!deleteId) return
        setLoading(true)
        try {
            await branchService.deleteItem(deleteId)
            toast.success("Branch deleted successfully")
            setDeleteId(null)
            setRefreshKey((prev) => prev + 1)
        } catch (err) {
            toast.error(getApiErrorMessage(err, "Failed to delete branch"))
        } finally {
            setLoading(false)
        }
    }

    const handleToggleVisibility = async (id: string) => {
        if (!id) return
        try {
            await branchService.toggleItemVisibility(id)
            toast.success("Branch visibility updated successfully")

            setRefreshKey(p => p + 1)
        } catch (err) {
            toast.error(getApiErrorMessage(err, "Failed to update branch visibility"))
        }
    }

    return (
        <>
            <PlatformLayout
                title="Branches"
                fetchItems={branchService.fetchItems}
                onAddClick={() => setShowCreate(true)}
                onEditClick={(id) => setEditId(id)}
                onDeleteClick={(id) => setDeleteId(id)}
                onToggleVisibilityClick={(id) => handleToggleVisibility(id)}
                onViewClick={(id) => setViewId(id)}
                refreshKey={refreshKey}
                // ✅ Add the new columns here
                extraColumns={
                    <>
                        <TableColumn title='Email' isHeader>Email</TableColumn>
                        <TableColumn title='Phone' isHeader>Phone</TableColumn>
                        <TableColumn title='Address' isHeader>Address</TableColumn>
                        <TableColumn title='Created At' isHeader>Created At</TableColumn>
                    </>
                }
                // ✅ Add the new data cells here
                renderExtraCells={(item) => (
                    <>
                        <TableColumn title={item?.email} className="text-xs">{item.emailAddress || item.email || "N/A"}</TableColumn>
                        <TableColumn title={item?.phone} className="text-xs whitespace-nowrap">{item.phone || "N/A"}</TableColumn>
                        <TableColumn title={item?.address} className="max-w-[150px] truncate text-xs">{item.address || "N/A"}</TableColumn>
                        <TableColumn title={item?.createdAt} className="text-gray-500 text-xs">
                            {item.createdAt ? FormatDate(item.createdAt) : "N/A"}
                        </TableColumn>
                    </>
                )}
            />

            {mounted && (
                <>
                    <BranchCreateModal
                        isOpen={showCreate}
                        onClose={() => setShowCreate(false)}
                        onCreate={handleCreate}
                        isSubmitting={loading}
                    />

                    <BranchEditModal
                        isOpen={!!editId}
                        onClose={() => setEditId(null)}
                        onUpdate={handleUpdate}
                        initialData={editData}
                        isSubmitting={loading}
                    />

                    <BranchViewModal
                        isOpen={!!viewId}
                        onClose={() => setViewId(null)}
                        data={viewData}
                        loading={viewLoading}
                    />

                    {deleteId && (
                        <ConfirmDeleteModal
                            message={`Are you sure you want to delete this branch?`}
                            onConfirm={handleDelete}

                            onCancel={() => setDeleteId(null)}
                        />
                    )}
                </>
            )}
        </>
    )
}

export default Page
