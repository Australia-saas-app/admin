"use client"

import { Modal } from "@/src/shared/ui/ui/modal"
import { Badge } from "@/src/shared/ui/ui/badge"
import React from "react"

interface CompanyViewModalProps {
    isOpen: boolean
    onClose: () => void
    data: any | null
    loading?: boolean
}

export const CompanyViewModal: React.FC<CompanyViewModalProps> = ({ isOpen, onClose, data, loading }) => {
    if (!isOpen) return null

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="View Company" size="lg">
            <div className="flex flex-col gap-6 py-4">
                {loading ? (
                    <div className="text-center py-10 text-gray-500 italic">Loading details...</div>
                ) : !data ? (
                    <div className="text-center py-10 text-red-500">Failed to load details.</div>
                ) : (
                    <div className="space-y-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{data.name || data.title}</h1>
                            </div>
                            <Badge className={data.isVisible ? "bg-green-500" : "bg-gray-500"}>
                                {data.isVisible ? "Visible" : "Hidden"}
                            </Badge>
                        </div>

                        <div className="prose prose-sm max-w-none text-gray-800 border-t pt-4">
                            <div dangerouslySetInnerHTML={{ __html: data.content || data.description || "" }} />
                        </div>

                        <div className="grid grid-cols-2 gap-4 border-t pt-4 text-xs text-gray-400 italic">
                            <p>Created: {new Date(data.createdAt).toLocaleString()}</p>
                            <p className="text-right">Last Updated: {new Date(data.updatedAt).toLocaleString()}</p>
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    )
}
