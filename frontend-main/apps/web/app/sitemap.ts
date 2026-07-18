import type { MetadataRoute } from "next";
import { SITE_URL } from "@/src/lib/seo";
import { MOCK_BLOGS } from "@/src/modules/blogs/data/mock-blogs";
import associatesDemo from "@/src/modules/associate/demoData";
import { getBlogs } from "@/src/server/BlogService";

export const revalidate = 3600;

const STATIC_ROUTES: {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
}[] = [
  { path: "", priority: 1, changeFrequency: "daily" },
  { path: "/blogs", priority: 0.9, changeFrequency: "daily" },
  { path: "/marketplace", priority: 0.9, changeFrequency: "daily" },
  { path: "/real-estate", priority: 0.8, changeFrequency: "daily" },
  { path: "/visa", priority: 0.8, changeFrequency: "weekly" },
  { path: "/visa-travel", priority: 0.8, changeFrequency: "weekly" },
  { path: "/courses", priority: 0.8, changeFrequency: "weekly" },
  { path: "/careers", priority: 0.8, changeFrequency: "weekly" },
  { path: "/technical", priority: 0.8, changeFrequency: "weekly" },
  { path: "/transport", priority: 0.7, changeFrequency: "weekly" },
  { path: "/associate", priority: 0.7, changeFrequency: "weekly" },
  { path: "/our-teams", priority: 0.6, changeFrequency: "monthly" },
  { path: "/gallery", priority: 0.6, changeFrequency: "monthly" },
  { path: "/branch", priority: 0.6, changeFrequency: "monthly" },
  { path: "/notice", priority: 0.6, changeFrequency: "weekly" },
  { path: "/contact", priority: 0.6, changeFrequency: "yearly" },
  { path: "/advertising", priority: 0.5, changeFrequency: "monthly" },
  { path: "/online-banking", priority: 0.5, changeFrequency: "monthly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/sitemap", priority: 0.3, changeFrequency: "monthly" },
  { path: "/service/construction", priority: 0.7, changeFrequency: "weekly" },
  { path: "/service/healthcare", priority: 0.7, changeFrequency: "weekly" },
  { path: "/service/investment", priority: 0.7, changeFrequency: "weekly" },
  { path: "/service/donations", priority: 0.7, changeFrequency: "weekly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  // Blog detail pages: real data when the backend is available, demo seeds otherwise.
  const blogsResponse = await getBlogs().catch(() => null);
  const blogs: { id: string; updatedAt?: string }[] = blogsResponse?.data?.length
    ? blogsResponse.data
    : MOCK_BLOGS;

  for (const blog of blogs) {
    entries.push({
      url: `${SITE_URL}/blogs/${blog.id}`,
      lastModified: blog.updatedAt ? new Date(blog.updatedAt) : new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    });
  }

  for (const associate of associatesDemo) {
    entries.push({
      url: `${SITE_URL}/associate/${associate.id}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    });
  }

  return entries;
}
