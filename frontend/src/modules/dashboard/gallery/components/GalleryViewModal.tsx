"use client"

import { Badge } from "@/src/components/ui/badge"
import { Modal } from "@/src/components/ui/modal"
import { FileText, Image as ImageIcon } from "lucide-react"
import Image from "next/image"
import React from "react"

interface GalleryMedia {
    url?: string
    size?: number
    type?: string
    fileName?: string
    mimeType?: string
}

interface GalleryImage {
    altText?: string
    imageUrl?: string
    displayOrder?: number
}

interface GalleryImageWithUrl extends GalleryImage {
    imageUrl: string
}

interface GalleryCreator {
    fullName?: string
    email?: string
}

interface GalleryItem {
    title?: string | null
    description?: string | null
    category?: string | null
    media?: GalleryMedia | null
    images?: GalleryImage[]
    isVisible?: boolean
    createdAt?: string
    updatedAt?: string
    creator?: GalleryCreator | null
}

interface ViewModalProps {
    isOpen: boolean
    onClose: () => void
    data: GalleryItem | null
    loading?: boolean
}

const formatDateTime = (iso?: string) => {
    if (!iso) return "N/A"
    const date = new Date(iso)
    if (Number.isNaN(date.getTime())) return "N/A"

    return date.toLocaleString()
}

const formatFileSize = (bytes?: number) => {
    if (!bytes || bytes <= 0) return "Unknown"
    const units = ["B", "KB", "MB", "GB"]
    let size = bytes
    let unitIndex = 0

    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024
        unitIndex += 1
    }

    return `${size.toFixed(size >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`
}

export const GalleryViewModal: React.FC<ViewModalProps> = ({ isOpen, onClose, data, loading }) => {
    if (!isOpen) return null

    const title = data?.title || "Untitled Gallery"
    const category = data?.category || "Uncategorized"
    const descriptionHtml = data?.description || "<i>No description available</i>"
    const mainMediaUrl = data?.media?.url || ""
    const hasMainMedia = mainMediaUrl.length > 0
    const extraImages: GalleryImageWithUrl[] = Array.isArray(data?.images)
        ? data.images.filter((img): img is GalleryImageWithUrl => typeof img?.imageUrl === "string" && img.imageUrl.length > 0)
        : []

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="View Gallery Item" size="lg">
            <div className="flex flex-col gap-6 py-4">
                {loading ? (
                    <div className="text-center py-10 text-gray-500 italic">Loading gallery item details...</div>
                ) : !data ? (
                    <div className="text-center py-10 text-red-500">Failed to load gallery item details.</div>
                ) : (
                    <>
                        <div className="space-y-2">
                            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                            <div className="flex flex-wrap gap-2 items-center">
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                    Category: {category}
                                </Badge>
                                <Badge className={data.isVisible ? "bg-green-500 text-white" : "bg-gray-600 text-white"}>
                                    {data?.isVisible ? "Visible" : "Hidden"}
                                </Badge>
                            </div>
                        </div>

                        <div className="border rounded-lg p-4 space-y-3 bg-gray-50">
                            <h2 className="text-sm font-semibold text-gray-700">Main Media</h2>
                            {hasMainMedia ? (
                                <div className="space-y-3">
                                    <Image
                                        src={mainMediaUrl}
                                        alt={title}
                                        width={1200}
                                        height={500}
                                        unoptimized
                                        className="w-full max-h-72 object-contain rounded-md bg-white border"
                                    />
                                    <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                                        <Badge variant="outline">File: {data.media?.fileName || "Unknown"}</Badge>
                                        <Badge variant="outline">Type: {data.media?.mimeType || data.media?.type || "Unknown"}</Badge>
                                        <Badge variant="outline">Size: {formatFileSize(data.media?.size)}</Badge>
                                    </div>
                                    <a
                                        href={data.media?.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors inline-flex"
                                        title="Open media"
                                    >
                                        <FileText size={18} />
                                    </a>
                                </div>
                            ) : (
                                <span className="text-gray-500 italic text-sm">No main media available</span>
                            )}
                        </div>

                        <div className="prose prose-sm max-w-none space-y-2 text-gray-800 border-t pt-4">
                            <h2 className="text-sm font-semibold text-gray-700 not-prose">Description</h2>
                            <div dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
                        </div>

                        {extraImages.length > 0 && (
                            <div className="space-y-3 border-t pt-4">
                                <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                    <ImageIcon size={16} />
                                    Additional Images ({extraImages.length})
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {extraImages.map((img, index) => (
                                        <a
                                            key={`${img.imageUrl}-${index}`}
                                            href={img.imageUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="border rounded-md p-2 bg-gray-50 hover:bg-gray-100 transition-colors"
                                        >
                                            <Image
                                                src={img.imageUrl}
                                                alt={img.altText || `Gallery image ${index + 1}`}
                                                width={700}
                                                height={280}
                                                unoptimized
                                                className="w-full h-40 object-cover rounded"
                                            />
                                            <p className="text-xs text-gray-600 mt-2 truncate">
                                                {img.altText || `Image ${index + 1}`}
                                            </p>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="border-t pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
                            <p><span className="font-semibold">Created At:</span> {formatDateTime(data.createdAt)}</p>
                            <p><span className="font-semibold">Updated At:</span> {formatDateTime(data.updatedAt)}</p>
                            <p><span className="font-semibold">Created By:</span> {data.creator?.fullName || "N/A"}</p>
                            <p><span className="font-semibold">Creator Email:</span> {data.creator?.email || "N/A"}</p>
                        </div>
                    </>
                )}
            </div>
        </Modal>
    )
}
