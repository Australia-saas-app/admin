"use client"

import React, { useState } from "react"
import Modal from "@/src/components/ui/modal"
import { Button } from "@/src/components/ui/button"
import FileUpload from "@/src/components/form/FileUpload"
import { uploadImageToStorage, addImagesToGalleryCategory } from "@/src/modules/dashboard/services/gallery"
import { toast } from "sonner"

interface Props {
    open: boolean
    categoryId: string | null
    onClose: () => void
    onSuccess: () => void
}

const FOLDER_ID = "f7bcfedc-ca1b-452a-9810-97e6434e46fc"
const OWNER_ID = "admin-123"

const GalleryUploadModal: React.FC<Props> = ({ open, categoryId, onClose, onSuccess }) => {
    const [file, setFile] = useState<File | null>(null)
    const [uploading, setUploading] = useState(false)

    const handleUpload = async () => {
        if (!file || !categoryId) return

        setUploading(true)
        try {
            // Step 1: Upload to storage
            const storageRes = await uploadImageToStorage(file, OWNER_ID, FOLDER_ID, "admin,internal")

            if (!storageRes || !storageRes.url) {
                throw new Error("Failed to get image URL from storage")
            }

            // Step 2: Associate with gallery category
            await addImagesToGalleryCategory(categoryId, [
                {
                    imageUrl: storageRes.url,
                    altText: file.name,
                    displayOrder: 1
                }
            ])

            toast.success("Image uploaded successfully")
            onSuccess()
            onClose()
        } catch (err: any) {
            toast.error(err.message || "Failed to upload image")
        } finally {
            setUploading(false)
        }
    }

    return (
        <Modal isOpen={open} onClose={onClose} title="Upload Gallery Image" size="md">
            <div className="p-4 space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center">
                    <FileUpload
                        accept="image/*"
                        onFileChange={(f) => setFile(f)}
                    />
                    {file && (
                        <p className="mt-2 text-sm text-gray-600 font-medium">Selected: {file.name}</p>
                    )}
                </div>

                <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={onClose} disabled={uploading}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleUpload}
                        disabled={!file || uploading}
                        className="bg-[#ffc529] text-gray-900 hover:bg-[#e0ad21]"
                    >
                        {uploading ? "Uploading..." : "Upload"}
                    </Button>
                </div>
            </div>
        </Modal>
    )
}

export default GalleryUploadModal
