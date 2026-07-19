import GalleryLayout from "@/src/modules/gallery/components/GalleryLayout";
import { buildMetadata } from "@/src/lib/seo";

export const revalidate = 60;

export const metadata = buildMetadata({
  title: "Gallery",
  description: "Photos and highlights from our projects, events, and community.",
  path: "/gallery",
});

const Page = () => {
  return (
    <main className="min-h-screen w-full max-w-7xl mx-auto px-4 py-8 md:py-12 md:px-6">
      <GalleryLayout />
    </main>
  );
};

export default Page;
