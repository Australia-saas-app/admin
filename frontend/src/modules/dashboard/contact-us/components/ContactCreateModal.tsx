"use client"

import { Modal } from "@/src/components/ui/modal"
import ContactForm from "./ContactForm"
import React from "react"

type Props = {
    isOpen: boolean
    onClose: () => void
    onCreate: (data: any) => void
    isSubmitting?: boolean
}

const ContactCreateModal: React.FC<Props> = ({ isOpen, onClose, onCreate, isSubmitting }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add Contact" size="md">
            <ContactForm onSubmit={onCreate} onCancel={onClose} isSubmitting={isSubmitting} />
        </Modal>
    )
}

export default ContactCreateModal
