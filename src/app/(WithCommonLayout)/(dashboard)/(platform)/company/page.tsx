"use client"

import { useState, useEffect } from 'react'
import PlatformLayout from '@/src/business/dashboard/shared/components/PlatformLayout'
import { companyService } from '@/src/business/dashboard/services/platform'
import CompanyCreateModal from '@/src/business/dashboard/company/components/CompanyCreateModal'
import CompanyEditModal from '@/src/business/dashboard/company/components/CompanyEditModal'
import { CompanyViewModal } from '@/src/business/dashboard/company/components/CompanyViewModal'

import { TableColumn } from '@/src/shared/ui/table'
import { toast } from 'sonner'
import { getApiErrorMessage } from '@/src/shared/utils/ApiErrorMessage'
import ConfirmDeleteModal from '@/src/shared/ui/modals/confirm-delete-modal'

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
            companyService.getItem(editId).then(data => setEditData(data))
        } else {
            setEditData(null)
        }
    }, [editId])

    useEffect(() => {
        if (viewId) {
            setViewLoading(true)
            companyService.getItem(viewId)
                .then(data => setViewData(data))
                .finally(() => setViewLoading(false))
        } else {
            setViewData(null)
        }
    }, [viewId])

    const handleCreate = async (data: any) => {
        setLoading(true)
        try {
            await companyService.createItem(data)
            toast.success("Company created successfully")
            setShowCreate(false)
            setRefreshKey((prev) => prev + 1)
        } catch (err) {
            toast.error(getApiErrorMessage(err, "Failed to create company"))
        } finally {
            setLoading(false)
        }
    }

    const handleUpdate = async (id: string, data: any) => {
        if (!id) return
        setLoading(true)
        try {
        
            await companyService.updateItem(id, data)
            toast.success("Company updated successfully")
            setEditId(null)
            setRefreshKey((prev) => prev + 1)
        } catch (err) {
            toast.error(getApiErrorMessage(err, "Failed to update company"))
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!deleteId) return
        setLoading(true)
        try {
            await companyService.deleteItem(deleteId)
            toast.success("Company deleted successfully")
            setDeleteId(null)
            setRefreshKey((prev) => prev + 1)
        } catch (err) {
            toast.error(getApiErrorMessage(err, "Failed to delete company"))
        } finally {
            setLoading(false)
        }
    }

    const handleToggleVisibility = async (id: string) => {
        if (!id) return
        try {
            await companyService.toggleItemVisibility(id)
            toast.success("Company visibility updated successfully")
            setRefreshKey(p => p + 1)
        } catch (err) {
            toast.error(getApiErrorMessage(err, "Failed to update company visibility"))
        }
    }

    return (
        <>
            <PlatformLayout
                title="Company"
                fetchItems={companyService.fetchItems}
                onToggleVisibilityClick={(id) => handleToggleVisibility(id)}
                onAddClick={() => setShowCreate(true)}
                onEditClick={(id) => setEditId(id)}
                onDeleteClick={(id) => setDeleteId(id)}
                onViewClick={(id) => setViewId(id)}
                refreshKey={refreshKey}
                // ✅ Added Columns
                extraColumns={
                    <>
                        <TableColumn isHeader>Name</TableColumn>
                        <TableColumn isHeader>Description</TableColumn>
                    </>
                }
                // ✅ Render logic for Photo and Description
                renderExtraCells={(item) => (
                    <>
                        <TableColumn title={item.name} >
                            {item.name}
                        </TableColumn>
                        <TableColumn title={item.description} >
                            <div

                                className="text-gray-700 text-base leading-relaxed "
                                dangerouslySetInnerHTML={{ __html: item.description || "<i>No description</i>" }}
                            ></div>
                        </TableColumn>
                    </>
                )}
            />

            {mounted && (
                <>
                    <CompanyCreateModal
                        isOpen={showCreate}
                        onClose={() => setShowCreate(false)}
                        onCreate={handleCreate}
                        isSubmitting={loading}
                    />

                    <CompanyEditModal
                        isOpen={!!editId}
                        id={editId}
                        onClose={() => setEditId(null)}
                         onUpdate={(data:any) => {
                            if (editId) {
                                handleUpdate(editId, data);
                            }
                        }}
                        isSubmitting={loading}
                    />

                    <CompanyViewModal
                        isOpen={!!viewId}
                        onClose={() => setViewId(null)}
                        data={viewData}
                        loading={viewLoading}
                    />

                     {deleteId && (
                        <ConfirmDeleteModal
                            message={`Are you sure you want to delete this company?`}
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
