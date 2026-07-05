"use client"
import Modal from "@/src/components/ui/modal"
import { NoticeForm } from "./NoticeForm"

const NoticeCreateModal = ({ open, onClose, onCreate }: any) => {
  return (
    <Modal isOpen={open} onClose={onClose} title="Add New Notice">
      <NoticeForm
        onCancel={onClose}
        onSubmit={(data: any) => {
          onCreate(data) // ✅ RAW DATA
          onClose()
        }}
      />
    </Modal>
  )
};
export default NoticeCreateModal;