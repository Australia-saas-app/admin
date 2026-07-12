"use client"

import Modal from "@/src/shared/ui/ui/modal"
import React from "react"
import BlogForm from "./BlogForm"

type Props = {
  isOpen: boolean
  onClose: () => void
  onCreate: (data: any) => void
  isSubmitting?: boolean
}

const BlogCreateModal: React.FC<Props> = ({ isOpen, onClose, onCreate, isSubmitting }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Blog" size="lg">
      <BlogForm onSubmit={onCreate} onCancel={onClose} isSubmitting={isSubmitting} />
    </Modal>
  )
}

export default BlogCreateModal
