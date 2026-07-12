"use client"

import { Modal } from "@/src/shared/ui/ui/modal"
import { Badge } from "@/src/shared/ui/ui/badge"
import React from "react"

interface BlogViewModalProps {
    isOpen: boolean
    onClose: () => void
    data: any | null
    loading?: boolean
}

export const BlogViewModal: React.FC<BlogViewModalProps> = ({ isOpen, onClose, data, loading }) => {
    if (!isOpen) return null

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="View Blog" size="lg">
            <div className="flex flex-col gap-6 py-4">
                {loading ? (
                    <div className="text-center py-10 text-gray-500 italic">Loading blog details...</div>
                ) : !data ? (
                    <div className="text-center py-10 text-red-500">Failed to load blog details.</div>
                ) : (
                    <>
                        <div className="space-y-2">
                            <h1 className="text-2xl font-bold text-gray-900">{data.title}</h1>
                            <div className="flex flex-wrap gap-2 items-center">
                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                    {data.category || "General"}
                                </Badge>
                                <Badge className={data.isVisible ? "bg-green-500 text-white" : "bg-gray-600 text-white"}>
                                    {data.isVisible ? "Visible" : "Hidden"}
                                </Badge>
                            </div>
                        </div>

                        {data.tags && data.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                                {data.tags.map((tag: string, index: number) => (
                                    <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        {data.excerpt && (
                            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-primary">
                                <p className="text-gray-700 italic">"{data.excerpt}"</p>
                            </div>
                        )}

                        <div className="prose prose-sm max-w-none text-gray-800 border-t pt-4">
                            <div dangerouslySetInnerHTML={{ __html: data.content || "" }} />
                        </div>
                    </>
                )}
            </div>
        </Modal>
    )
}
