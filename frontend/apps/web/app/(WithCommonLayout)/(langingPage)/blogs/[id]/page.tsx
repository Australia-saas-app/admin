import type { Metadata } from "next";
import BlogDetailsLayout from "@/src/modules/blogs/components/BlogDetailsLayout";
import { RelatedBlogs } from "@/src/modules/blogs/components/RelatedBlogs";
import { getBlogById } from "@/src/server/BlogService";
import { getMockBlogById, MOCK_BLOGS } from "@/src/modules/blogs/data/mock-blogs";
import { notFound } from "next/navigation";
import { buildMetadata, SITE_URL } from "@/src/lib/seo";
import { JsonLd, articleJsonLd, breadcrumbJsonLd } from "@/src/shared/components/seo/JsonLd";
import { TrackView } from "@/src/shared/components/TrackView";

async function resolveBlog(id: string) {
  const data = await getBlogById(id);
  return data?.data ?? getMockBlogById(id) ?? MOCK_BLOGS.find((b) => b.id === id);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const blog = await resolveBlog(id);
  if (!blog) return buildMetadata({ title: "Blog not found", noIndex: true });

  return buildMetadata({
    title: blog.title,
    description: blog.excerpt || blog.content?.slice(0, 160),
    path: `/blogs/${blog.id}`,
    image: blog.featuredImage || undefined,
    type: "article",
    publishedTime: blog.createdAt,
    keywords: blog.tags?.length ? blog.tags : undefined,
  });
}

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const blog = await resolveBlog(id);

  if (!blog) {
    notFound();
  }

  return (
    <main className="min-h-screen px-4 max-w-5xl mx-auto py-6 md:py-8">
      <JsonLd
        data={articleJsonLd({
          title: blog.title,
          description: blog.excerpt,
          url: `${SITE_URL}/blogs/${blog.id}`,
          image: blog.featuredImage || undefined,
          datePublished: blog.createdAt,
          authorName: blog.author?.fullName,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "Blogs", url: `${SITE_URL}/blogs` },
          { name: blog.title, url: `${SITE_URL}/blogs/${blog.id}` },
        ])}
      />
      <TrackView
        id={blog.id}
        type="blog"
        title={blog.title}
        href={`/blogs/${blog.id}`}
        image={blog.featuredImage || undefined}
      />
      <BlogDetailsLayout blog={blog} />
      <RelatedBlogs current={blog} allBlogs={MOCK_BLOGS} />
    </main>
  );
};

export default Page;
