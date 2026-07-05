"use client"

import Modal from "@/src/components/ui/modal"
import React from "react"
import CompanyForm from "./CompanyForm"

interface Props {
  open: boolean
  onClose: () => void
  onCreate: (data: {
    contentName: string
    contentDescription?: string
  }) => void
}

const CompanyCreateModal: React.FC<Props> = ({ open, onClose, onCreate }) => {
  return (
    <Modal isOpen={open} onClose={onClose} title="Add Company" size="lg">
      <CompanyForm
        onCancel={onClose}
        onSubmit={(data) => {
          onCreate(data)
          onClose()
        }}
      />
    </Modal>
  )
}

export default CompanyCreateModal
