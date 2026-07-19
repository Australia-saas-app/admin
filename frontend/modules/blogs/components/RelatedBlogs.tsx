import Link from "next/link";
import Image from "next/image";
import type { BlogProps } from "../types/blog.type";

/**
 * "Related articles" section shown under a blog post — same-category posts
 * first, then recent ones to fill up to `limit`.
 */
export function RelatedBlogs({
  current,
  allBlogs,
  limit = 3,
}: {
  current: BlogProps;
  allBlogs: BlogProps[];
  limit?: number;
}) {
  const others = allBlogs.filter((b) => b.id !== current.id);
  const sameCategory = others.filter((b) => b.category === current.category);
  const rest = others.filter((b) => b.category !== current.category);
  const related = [...sameCategory, ...rest].slice(0, limit);

  if (related.length === 0) return null;

  return (
    <section aria-label="Related articles" className="mt-12 border-t border-border pt-8">
      <h2 className="text-xl font-bold text-foreground md:text-2xl">Related articles</h2>
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {related.map((blog) => (
          <Link
            key={blog.id}
            href={`/blogs/${blog.id}`}
            className="card-lift group overflow-hidden rounded-2xl border border-border bg-card"
          >
            <div className="relative h-40 w-full bg-muted">
              {blog.featuredImage && (
                <Image
                  src={blog.featuredImage}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              )}
            </div>
            <div className="p-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
                {blog.category}
              </p>
              <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-foreground">
                {blog.title}
              </h3>
              <p className="mt-1.5 line-clamp-2 text-xs text-muted-foreground">{blog.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
