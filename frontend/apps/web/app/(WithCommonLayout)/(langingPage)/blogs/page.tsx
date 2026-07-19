import BlogLayout from "@/src/modules/blogs/components/BlogLayout";
import { buildMetadata } from "@/src/lib/seo";

export const revalidate = 60;

export const metadata = buildMetadata({
  title: "Blogs",
  description: "News, insights, and updates from our global maritime and services network.",
  path: "/blogs",
});

export default function BlogsPage() {
  return <BlogLayout />;
}
