"use client"

import React, { useEffect, useState } from "react"
import Modal from "@/src/components/ui/modal"
import { getGalleryCategory } from "@/src/modules/dashboard/services/gallery"
import Image from "next/image"

interface Props {
    open: boolean
    categoryId: string | null
    onClose: () => void
}

const GalleryViewImagesModal: React.FC<Props> = ({ open, categoryId, onClose }) => {
    const [category, setCategory] = useState<any>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (open && categoryId) {
            setLoading(true)
            getGalleryCategory(categoryId).then((data) => {
                setCategory(data)
                setLoading(false)
            }).catch(() => {
                setLoading(false)
            })
        } else {
            setCategory(null)
        }
    }, [open, categoryId])

    return (
        <Modal isOpen={open} onClose={onClose} title={category ? `Images in ${category.categoryName}` : "View Images"} size="lg">
            <div className="p-4">
                {loading ? (
                    <div className="py-10 text-center text-gray-500 italic">Loading images...</div>
                ) : category?.images?.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {category.images.map((img: any, idx: number) => (
                            <div key={idx} className="group relative aspect-square border rounded-lg overflow-hidden bg-gray-50">
                                <Image
                                    src={img.imageUrl}
                                    alt={img.altText || "Gallery Image"}
                                    fill
                                    className="object-cover transition-transform group-hover:scale-105"
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-1 text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                    {img.altText}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-10 text-center text-gray-500">
                        No images found in this category.
                    </div>
                )}
            </div>
        </Modal>
    )
}

export default GalleryViewImagesModal
