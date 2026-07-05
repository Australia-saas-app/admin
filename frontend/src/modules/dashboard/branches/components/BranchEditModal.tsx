"use client"

import { Modal } from "@/src/components/ui/modal"
import BranchForm from "./BranchForm"
import React from "react"

type Props = {
    isOpen: boolean
    onClose: () => void
    onUpdate: (data: any) => void
    initialData: any | null
    isSubmitting?: boolean
}

const BranchEditModal: React.FC<Props> = ({ isOpen, onClose, onUpdate, initialData, isSubmitting }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Edit Branch" size="lg">
            <BranchForm onSubmit={onUpdate} onCancel={onClose} initial={initialData} isSubmitting={isSubmitting} />
        </Modal>
    )
}

export default BranchEditModal
