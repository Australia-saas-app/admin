"use client"

import { Modal } from "@/src/shared/ui/ui/modal"
import { Badge } from "@/src/shared/ui/ui/badge"
import React from "react"
import { FileText } from "lucide-react"

interface NoticeViewModalProps {
    isOpen: boolean
    onClose: () => void
    data: any | null
    loading?: boolean
}

export const NoticeViewModal: React.FC<NoticeViewModalProps> = ({ isOpen, onClose, data, loading }) => {
    if (!isOpen) return null

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="View Notice" size="lg">
            <div className="flex flex-col gap-6 py-4">
                {loading ? (
                    <div className="text-center py-10 text-gray-500 italic">Loading notice details...</div>
                ) : !data ? (
                    <div className="text-center py-10 text-red-500">Failed to load notice details.</div>
                ) : (
                    <>
                        <div className="space-y-2">
                            <h1 className="text-2xl font-bold text-gray-900">{data.title}</h1>
                            <div className="flex flex-wrap gap-2 items-center">
                                {data.priority && (
                                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                                        Priority: {data.priority}
                                    </Badge>
                                )}
                                <Badge className={data.isVisible ? "bg-green-500 text-white" : "bg-gray-600 text-white"}>
                                    {data.isVisible ? "Visible" : "Hidden"}
                                </Badge>
                            </div>
                            {data?.file ? (
                                <a href={data?.file?.url} target="_blank" rel="noreferrer"
                                    className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors inline-flex">
                                    <FileText size={18} />
                                </a>
                            ) : (
                                <span className="text-gray-300 italic text-xs">No file available</span>
                            )}
                        </div>

                        <div className="prose prose-sm max-w-none text-gray-800 border-t pt-4">
                            <div dangerouslySetInnerHTML={{ __html: data.content || data.description || "" }} />
                        </div>
                    </>
                )}
            </div>
        </Modal>
    )
}
