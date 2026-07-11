"use client"
import React, { useEffect, useState } from "react"
import Modal from "@/src/shared/ui/ui/modal"
import NoticeForm from "./NoticeForm"
import { noticeService } from "@/src/business/dashboard/services/platform"
import type { PlatformItem } from "@/src/business/dashboard/services/platform"

interface Props {
    open: boolean
    id: string | null
    onClose: () => void
    onUpdate: (data: any) => void 
}

const NoticeEditModal: React.FC<Props> = ({ open, id, onClose, onUpdate }) => {
    const [initialData, setInitialData] = useState<PlatformItem | null>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (open && id) {
            setLoading(true)
            noticeService.getItem(id)
                .then((data) => setInitialData(data))
                .finally(() => setLoading(false))
        }
    }, [open, id])

    return (
        <Modal isOpen={open} onClose={onClose} title="Edit Notice" size="md">
            <div className="">
                {loading ? (
                    <div className="p-8 text-center text-gray-500 italic">Loading notice info...</div>
                ) : initialData ? (
                    <NoticeForm
                        initial={initialData}
                        onCancel={onClose}
                        onSubmit={(data: any) => onUpdate(data)} // Sends data back to Page.tsx
                    />
                ) : (
                    <div className="p-8 text-center text-red-500">Failed to load notice info.</div>
                )}
            </div>
        </Modal>
    )
}

export default NoticeEditModal