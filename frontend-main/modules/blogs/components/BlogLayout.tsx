import BlogList from "./BlogList"
import { getBlogs } from "@/src/server/BlogService"
import { MOCK_BLOGS } from "../data/mock-blogs"
import type { BlogProps } from "../types/blog.type"

export default async function BlogLayout() {
  const data = await getBlogs()
  const apiBlogs = (data?.data as BlogProps[] | undefined) ?? []
  const blogs = apiBlogs.length > 0 ? apiBlogs : MOCK_BLOGS

  return <BlogList initialData={blogs} />
}
