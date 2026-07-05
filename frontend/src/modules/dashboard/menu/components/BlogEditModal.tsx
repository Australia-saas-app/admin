"use client"

import Modal from "@/src/components/ui/modal"
import React from "react"
import BlogForm from "./BlogForm"

type Props = {
    isOpen: boolean
    id: string | null
    onClose: () => void
    onUpdate: (data: any) => void
    initialData?: any
    loading?: boolean
}

const BlogEditModal: React.FC<Props> = ({ isOpen, id, onClose, onUpdate, initialData, loading }) => {
    if (!id) return null

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Edit Blog" size="lg">
            <BlogForm
                onSubmit={onUpdate}
                onCancel={onClose}
                initial={initialData}
                isSubmitting={loading}
            />
        </Modal>
    )
}

export default BlogEditModal
