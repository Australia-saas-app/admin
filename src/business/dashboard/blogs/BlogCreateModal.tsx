"use client"
import Modal from "@/src/shared/ui/ui/modal"
import BlogForm from "./BlogForm";


const BlogCreateModal = ({ open, onClose, onCreate }: any) => {
  return (
    <Modal isOpen={open} onClose={onClose} title="Add New Blog">
      <BlogForm
        onCancel={onClose}
        onSubmit={(data: any) => {
          onCreate(data) // ✅ RAW DATA
          onClose()
        }}
      />
    </Modal>
  )
};
export default BlogCreateModal;