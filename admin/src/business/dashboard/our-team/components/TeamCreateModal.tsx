"use client"

import { Modal } from "@/src/shared/ui/ui/modal"
import TeamForm from "./TeamForm"
import React from "react"

type Props = {
    isOpen: boolean
    onClose: () => void
    onCreate: (data: any) => void
    isSubmitting?: boolean
}

const TeamCreateModal: React.FC<Props> = ({ isOpen, onClose, onCreate, isSubmitting }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add Team Member" size="lg">
            <TeamForm onSubmit={onCreate} onCancel={onClose} isSubmitting={isSubmitting} />
        </Modal>
    )
}

export default TeamCreateModal
