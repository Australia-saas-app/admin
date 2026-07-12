"use client"

import { Modal } from "@/src/shared/ui/ui/modal"
import { Button } from "@/src/shared/ui/ui/button"
import { AlertCircle } from "lucide-react"
import React from "react"

interface TeamDeleteModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    loading?: boolean
}

export const TeamDeleteModal: React.FC<TeamDeleteModalProps> = ({ isOpen, onClose, onConfirm, loading }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Delete Team Member" size="sm">
            <div className="flex flex-col items-center gap-6 py-6">
                <AlertCircle className="w-16 h-16 text-red-500" />
                <p className="text-center text-gray-800 text-lg font-medium">Are you sure you want to delete this team member?</p>
                <div className="flex gap-4 w-full px-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        className="flex-1 h-11 border-gray-300"
                        disabled={loading}
                    >
                        No
                    </Button>
                    <Button
                        type="button"
                        className="flex-1 h-11 bg-red-500 hover:bg-red-600 text-white"
                        onClick={onConfirm}
                        disabled={loading}
                    >
                        {loading ? "Deleting..." : "Yes"}
                    </Button>
                </div>
            </div>
        </Modal>
    )
}
