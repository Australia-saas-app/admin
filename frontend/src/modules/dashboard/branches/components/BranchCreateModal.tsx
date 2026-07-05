"use client"

import { Modal } from "@/src/components/ui/modal"
import BranchForm from "./BranchForm"
import React from "react"

type Props = {
    isOpen: boolean
    onClose: () => void
    onCreate: (data: any) => void
    isSubmitting?: boolean
}

const BranchCreateModal: React.FC<Props> = ({ isOpen, onClose, onCreate, isSubmitting }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add Branch" size="lg">
            <BranchForm onSubmit={onCreate} onCancel={onClose} isSubmitting={isSubmitting} />
        </Modal>
    )
}

export default BranchCreateModal
