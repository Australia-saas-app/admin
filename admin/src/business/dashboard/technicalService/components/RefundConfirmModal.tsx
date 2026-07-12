"use client"

import { Button } from "@/src/shared/ui/ui/button"
import { Modal } from "@/src/shared/ui/ui/modal"
import { AlertCircle } from "lucide-react"
import React from "react"

interface RefundConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  amount?: string
}

export const RefundConfirmModal: React.FC<RefundConfirmModalProps> = ({ isOpen, onClose, onConfirm, amount = "110 USD" }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirmation" size="sm">
      <div className="flex flex-col items-center gap-6 py-6">
        <AlertCircle className="w-16 h-16 text-blue-500" />
        <p className="text-center text-gray-800 text-lg font-medium">Process refund of {amount}?</p>
        <div className="flex gap-4 w-full px-4">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1 h-11 border-gray-300">
            Cancel
          </Button>
          <Button type="button" className="flex-1 h-11 bg-green-500 hover:bg-green-600 text-white" onClick={onConfirm}>
            Confirm
          </Button>
        </div>
      </div>
    </Modal>
  )
}
