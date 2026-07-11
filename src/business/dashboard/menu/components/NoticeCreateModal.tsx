"use client"

import React from "react"
import Modal from "@/src/shared/ui/ui/modal"
import NoticeForm from "./NoticeForm"


type Props = {
  isOpen: boolean
  onClose: () => void
  onCreate: (payload: { title: string;  file?: File | null }) => void
}

const NoticeCreateModal: React.FC<Props> = ({ isOpen, onClose, onCreate }) => {
  const handleSubmit = (data: { title: string; description?: string }, file: File | null) => {
    onCreate({ title: data.title,  file })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Notice" size="md">
      <NoticeForm onSubmit={handleSubmit} onCancel={onClose} />
    </Modal>
  )
}

export default NoticeCreateModal
