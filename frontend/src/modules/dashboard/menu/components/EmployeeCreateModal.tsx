"use client"

import React from "react"
import Modal from "@/src/components/ui/modal"
import EmployeeForm from "./EmployeeForm"

interface Props {
  open: boolean
  onClose: () => void
  onCreate: (data: any) => void
}

const EmployeeCreateModal: React.FC<Props> = ({ open, onClose, onCreate }) => {
  return (
    <Modal isOpen={open} onClose={onClose} title="Add Employee" size="lg">
      <EmployeeForm
        onCancel={onClose}
        onSubmit={(data) => {
          onCreate(data)
          onClose()
        }}
      />
    </Modal>
  )
}

export default EmployeeCreateModal
