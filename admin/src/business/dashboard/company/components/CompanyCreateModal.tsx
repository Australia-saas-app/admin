"use client"

import { Modal } from "@/src/shared/ui/ui/modal"
import CompanyForm from "./CompanyForm"
import React from "react"

type Props = {
    isOpen: boolean
    onClose: () => void
    onCreate: (data: any) => void
    isSubmitting?: boolean
}

const CompanyCreateModal: React.FC<Props> = ({ isOpen, onClose, onCreate, isSubmitting }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add Company" size="lg">
            <CompanyForm onSubmit={onCreate} onCancel={onClose} isSubmitting={isSubmitting} />
        </Modal>
    )
}

export default CompanyCreateModal
