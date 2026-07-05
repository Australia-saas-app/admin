"use client"
import React, { useEffect, useState } from "react"
import Modal from "@/src/components/ui/modal"

import { blogService } from "@/src/modules/dashboard/services/platform"
import type { PlatformItem } from "@/src/modules/dashboard/services/platform"
import BlogForm from "./BlogForm"

interface Props {
    open: boolean
    id: string | null
    onClose: () => void
    onUpdate: (data: any) => void 
}

const BlogEditModal: React.FC<Props> = ({ open, id, onClose, onUpdate }) => {
    const [initialData, setInitialData] = useState<PlatformItem | null>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (open && id) {
            setLoading(true)
            blogService.getItem(id)
                .then((data) => setInitialData(data))
                .finally(() => setLoading(false))
        }
    }, [open, id])

    return (
        <Modal isOpen={open} onClose={onClose} title="Edit Blog" size="md">
            <div className="">
                {loading ? (
                    <div className="p-8 text-center text-gray-500 italic">Loading blog info...</div>
                ) : initialData ? (
                    <BlogForm
                        initial={initialData}
                        onCancel={onClose}
                        onSubmit={(data: any) => onUpdate(data)} // Sends data back to Page.tsx
                    />
                ) : (
                    <div className="p-8 text-center text-red-500">Failed to load blog info.</div>
                )}
            </div>
        </Modal>
    )
}

export default BlogEditModal