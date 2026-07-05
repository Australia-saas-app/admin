"use client"
import Modal from "@/src/components/ui/modal"
import { GalleryForm } from "./GalleryForm";



const GalleryCreateModal = ({ open, onClose, onCreate }: any) => {
  return (
    <Modal isOpen={open} onClose={onClose} title="Add New Gallery Item">
      <GalleryForm
        onCancel={onClose}
        onSubmit={(data: any) => {
          onCreate(data) // ✅ RAW DATA
          onClose()
        }}
      />
    </Modal>
  )
};
export default GalleryCreateModal;