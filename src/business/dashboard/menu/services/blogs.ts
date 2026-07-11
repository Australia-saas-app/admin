import type { Blog } from "@/src/business/dashboard/menu/types/blog"

const demoBlogs: Blog[] = [
  {
    id: "b1",
    title: "Stunning Design Trends 2026",
    publishDate: "2026-03-01",
    coverUrl: "/image/placeholder-1.jpg",
    tag: ["design", "2026"],
    excerpt: "A quick look at the top design trends for 2026.",
    content: "<p>Full article content goes here...</p>",
    active: true,
  },
  {
    id: "b2",
    title: "How to Improve UX",
    publishDate: "2026-02-20",
    coverUrl: "/image/placeholder-2.jpg",
    tag: ["ux", "tips"],
    excerpt: "Practical tips to improve user experience.",
    content: "<p>Full article content goes here...</p>",
    active: true,
  },
  {
    id: "b3",
    title: "System Maintenance Recap",
    publishDate: "2026-01-15",
    coverUrl: "/image/placeholder-3.jpg",
    tag: ["maintenance"],
    excerpt: "What changed during last maintenance window.",
    content: "<p>Full article content goes here...</p>",
    active: false,
  },
]

export const fetchBlogs = async (): Promise<Blog[]> => {
  await new Promise((r) => setTimeout(r, 0))
  return demoBlogs
}

export default { fetchBlogs }
