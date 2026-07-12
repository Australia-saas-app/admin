import axiosInstanceClient from "@/src/infra/lib/axiosInstance/client"
import envConfig from "@/src/infra/config";
import type { GalleryImage } from "@/src/business/dashboard/types/gallery"

export const fetchGalleryImages = async (page: number = 1, limit: number = 20): Promise<{ data: GalleryImage[], total: number }> => {
  try {
    const response = await axiosInstanceClient.get(`${envConfig.platformBaseUrl}/gallery`, {
      params: { page, limit }
    })
    return {
      data: response.data?.data || [],
      total: response.data?.meta?.total || (response.data?.data?.length || 0)
    }
  } catch (error) {
    console.error("Failed to fetch gallery categories:", error)
    return { data: [], total: 0 }
  }
}

export const createGalleryCategory = async (data: Omit<GalleryImage, "id">): Promise<void> => {
  try {
    await axiosInstanceClient.post(`${envConfig.platformBaseUrl}/admin/gallery`, data)
  } catch (error) {
    console.error("Failed to create gallery category:", error)
    throw error
  }
}

export const getGalleryCategory = async (id: string): Promise<GalleryImage | null> => {
  try {
    const response = await axiosInstanceClient.get(`${envConfig.platformBaseUrl}/gallery/${id}`)
    return response.data?.data || null
  } catch (error) {
    console.error(`Failed to fetch gallery category ${id}:`, error)
    return null
  }
}

export const updateGalleryCategory = async (id: string, data: Partial<GalleryImage>): Promise<void> => {
  try {
    await axiosInstanceClient.patch(`${envConfig.platformBaseUrl}/admin/gallery/${id}`, data)
  } catch (error) {
    console.error(`Failed to update gallery category ${id}:`, error)
    throw error
  }
}

export const uploadImageToStorage = async (file: File, ownerId: string, folderId: string, tags: string | null): Promise<{ url: string } | null> => {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("ownerId", ownerId)
  formData.append("folderId", folderId)
  if (tags) formData.append("tags", tags)

  try {
    const response = await axiosInstanceClient.post(envConfig.storageUrl, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    })
    return response.data || null
  } catch (error) {
    console.error("Storage upload error:", error)
    return null
  }
}
export const deleteGalleryCategory = async (id: string) => {
  // your API call here
}

export const addImagesToGalleryCategory = async (categoryId: string, images: { imageUrl: string; altText: string; displayOrder: number }[]): Promise<void> => {
  try {
    await axiosInstanceClient.post(`${envConfig.platformBaseUrl}/admin/gallery/${categoryId}/images`, { images })
  } catch (error) {
    console.error(`Failed to add images to gallery category ${categoryId}:`, error)
    throw error
  }
}
