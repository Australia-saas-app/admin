"use client";

import Image from "next/image";
import { useState } from "react";
import { formatDateShort } from "@/src/utils/formatters";
import type { BlogProps } from "../types/blog.type";

const DEFAULT_AUTHOR = {
  fullName: "Editorial Team",
  email: "news@demo.com",
};

const BlogDetailsLayout = ({ blog }: { blog: BlogProps }) => {
  const [copied, setCopied] = useState(false);
  const author = blog.author ?? DEFAULT_AUTHOR;
  const tags = blog.tags ?? [];

  const pageUrl = typeof window !== "undefined" ? window.location.href : `/blogs/${blog.id}`;

  const handleCopy = async () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(pageUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // ignore
      }
    }
  };

  const imageSrc = blog.featuredImage || "/technology-team-meeting.jpg";
  const isExternalImage = imageSrc.startsWith("http");

  return (
    <div className="max-w-5xl mx-auto px-2 py-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <article className="lg:col-span-2">
          <div className="relative overflow-hidden rounded-xl shadow-md">
            {isExternalImage ? (
              <img src={imageSrc} alt={blog.title} className="object-cover w-full h-56 sm:h-72" />
            ) : (
              <Image
                src={imageSrc}
                alt={blog.title}
                width={1400}
                height={700}
                className="object-cover w-full h-56 sm:h-72"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>

          <header className="mt-5">
            <h1 className="text-2xl md:text-3xl font-extrabold leading-tight text-foreground">
              {blog.title}
            </h1>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">By {author.fullName}</span>
                <span className="text-xs text-muted-foreground/70">•</span>
                <span className="text-sm text-muted-foreground">
                  {formatDateShort(blog.createdAt)}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopy}
                className="text-sm text-blue-500 hover:underline"
              >
                {copied ? "Copied!" : "Copy link"}
              </button>
            </div>
          </header>

          <div className="prose prose-sm mt-5 max-w-none space-y-4 text-foreground/80">
            {blog.content
              .split(/\n\s*\n/)
              .map((paragraph) => paragraph.trim())
              .filter(Boolean)
              .map((paragraph) => (
                <p key={paragraph.slice(0, 48)}>{paragraph}</p>
              ))}
          </div>

          {tags.length > 0 && (
            <section className="mt-6">
              <h2 className="text-lg font-semibold text-foreground">Tags</h2>
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-muted text-foreground/80 text-xs px-3 py-1 rounded-full shadow-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </section>
          )}
        </article>

        <aside className="lg:col-span-1">
          <div className="sticky top-10 space-y-4">
            <div className="bg-card rounded-lg shadow-md p-4 border border-border">
              <h3 className="text-base font-semibold text-foreground">Author</h3>
              <div className="mt-3">
                <p className="text-sm text-muted-foreground font-medium">{author.fullName}</p>
                <p className="text-sm text-muted-foreground">{author.email}</p>
              </div>
            </div>

            <div className="bg-card rounded-lg shadow-md p-4 border border-border">
              <h3 className="text-base font-semibold text-foreground">Statistics</h3>
              <div className="mt-3 space-y-1">
                <p className="text-sm text-muted-foreground">Views: {blog.viewCount ?? 0}</p>
                <p className="text-sm text-muted-foreground">Likes: {blog.likeCount ?? 0}</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default BlogDetailsLayout;
