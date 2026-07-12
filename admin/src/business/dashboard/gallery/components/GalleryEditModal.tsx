"use client"
import React, { useEffect, useState } from "react"
import Modal from "@/src/shared/ui/ui/modal"

import {  galleryService } from "@/src/business/dashboard/services/platform"
import type { PlatformItem } from "@/src/business/dashboard/services/platform"
import { GalleryForm } from "./GalleryForm"


interface Props {
    open: boolean
    id: string | null
    onClose: () => void
    onUpdate: (data: any) => void 
}

const GalleryEditModal: React.FC<Props> = ({ open, id, onClose, onUpdate }) => {
    const [initialData, setInitialData] = useState<PlatformItem | null>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (open && id) {
            setLoading(true)
            galleryService.getItem(id)
                .then((data) => setInitialData(data))
                .finally(() => setLoading(false))
        }
    }, [open, id])

    return (
        <Modal isOpen={open} onClose={onClose} title="Edit Gallery" size="md">
            <div className="">
                {loading ? (
                    <div className="p-8 text-center text-gray-500 italic">Loading gallery info...</div>
                ) : initialData ? (
                    <GalleryForm
                        initial={initialData}
                        onCancel={onClose}
                        onSubmit={(data: any) => onUpdate(data)} // Sends data back to Page.tsx
                    />
                ) : (
                    <div className="p-8 text-center text-red-500">Failed to load gallery item info.</div>
                )}
            </div>
        </Modal>
    )
}

export default GalleryEditModal