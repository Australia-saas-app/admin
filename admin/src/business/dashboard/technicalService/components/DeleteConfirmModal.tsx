"use client"

import { Button } from "@/src/shared/ui/ui/button"
import { Modal } from "@/src/shared/ui/ui/modal"
import { AlertCircle } from "lucide-react"
import React from "react"

interface DeleteConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({ isOpen, onClose, onConfirm }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirmation" size="sm">
      <div className="flex flex-col items-center gap-6 py-6">
        <AlertCircle className="w-16 h-16 text-red-500" />
        <p className="text-center text-gray-800 text-lg font-medium">Do you want to delete the order?</p>
        <div className="flex gap-4 w-full px-4">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1 h-11 border-gray-300">
            No
          </Button>
          <Button type="button" className="flex-1 h-11 bg-red-500 hover:bg-red-600 text-white" onClick={onConfirm}>
            Yes
          </Button>
        </div>
      </div>
    </Modal>
  )
}
