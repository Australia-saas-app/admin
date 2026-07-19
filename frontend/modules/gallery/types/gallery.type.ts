export type GalleryItem = {
  id: string;
  categoryName: string;
  description: string;
  isVisible: boolean;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  images: {
    altText: string;
    imageUrl: string;
    displayOrder: number;
  }[];
};