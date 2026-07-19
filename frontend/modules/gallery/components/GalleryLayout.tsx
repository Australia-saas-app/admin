import React from "react";
import GalleryList from "./GalleryList";
import { getGallery } from "@/src/server/GalleryService";
import { MOCK_GALLERY_ITEMS } from "../data/mock-gallery";

const GalleryLayout = async () => {
  const data = await getGallery();
  const galleryItems = data.data?.length ? data.data : MOCK_GALLERY_ITEMS;
  return <GalleryList initialData={galleryItems} />;
};

export default GalleryLayout;
