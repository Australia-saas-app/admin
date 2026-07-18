"use client";

import Link from "next/link";
import { formatBlogCardDate } from "../data/mock-blogs";
import type { BlogProps } from "../types/blog.type";

export default function BlogCard({ blog }: { blog: BlogProps }) {
  return (
    <article className="card-lift group overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <Link href={`/blogs/${blog.id}`} className="block p-2.5">
        <div className="aspect-[4/3] w-full rounded-xl overflow-hidden relative mb-2 bg-muted">
          <img
            src={blog.featuredImage || "/technology-team-meeting.jpg"}
            alt={blog.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        <div className="space-y-1 px-0.5">
          <span className="text-[10px] font-bold text-muted-foreground/70 block tracking-wider uppercase">
            {formatBlogCardDate(blog.createdAt)}
          </span>
          <h3 className="text-sm font-bold text-foreground leading-snug line-clamp-2 transition-colors group-hover:text-primary">
            {blog.title}
          </h3>
          <p className="text-[10px] text-muted-foreground line-clamp-3 leading-relaxed">
            {blog.excerpt}
          </p>
        </div>
      </Link>
    </article>
  );
}
