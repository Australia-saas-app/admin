"use client"

import { Modal } from "@/src/shared/ui/ui/modal"
import React from "react"

interface ContactViewModalProps {
    isOpen: boolean
    onClose: () => void
    data: any | null
    loading?: boolean
}

export const ContactViewModal: React.FC<ContactViewModalProps> = ({ isOpen, onClose, data, loading }) => {
    if (!isOpen) return null

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="View Contact Submission" size="md">
            <div className="flex flex-col gap-4 py-4">
                {loading ? (
                    <div className="text-center py-10 text-gray-500 italic">Loading details...</div>
                ) : !data ? (
                    <div className="text-center py-10 text-red-500">Failed to load details.</div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 gap-4 border-b pb-4">
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-semibold">Name</p>
                                <p className="text-sm font-medium">{data.name}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-semibold">Email</p>
                                <p className="text-sm font-medium">{data.email}</p>
                            </div>
                        </div>

                        <div>
                            <p className="text-xs text-gray-500 uppercase font-semibold">Subject</p>
                            <p className="text-sm font-bold text-gray-900">{data.subject}</p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                            <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Message</p>
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">{data.message}</p>
                        </div>

                        <div className="text-right text-[10px] text-gray-400">
                            Submitted on: {new Date(data.createdAt).toLocaleString()}
                        </div>
                    </>
                )}
            </div>
        </Modal>
    )
}
