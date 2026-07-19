import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock3 } from "lucide-react";
import { HOME_BLOGS_CARD_DATA } from "../constants/home.constants";
import type { BlogCard } from "../types/home.type";

export default function BlogSection() {
  const blogs = HOME_BLOGS_CARD_DATA.slice(0, 3);

  return (
    <section className="bg-muted/40 py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="relative mb-8 text-center md:mb-10">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#2563EB]">Our Blog</p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground md:text-[1.85rem]">
            Latest News & Articles
          </h2>
          <Link
            href="/blogs"
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[#2563EB] transition hover:text-[#1D4ED8] md:absolute md:right-0 md:top-1/2 md:mt-0 md:-translate-y-1/2"
          >
            View All Posts
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-4 md:gap-5 lg:grid-cols-3">
          {blogs.map((blog) => (
            <BlogNewsCard key={blog.id} blog={blog} />
          ))}
        </div>
      </div>
    </section>
  );
}

function BlogNewsCard({ blog }: { blog: BlogCard }) {
  const href = blog.href ?? `/blogs/${blog.id}`;

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_4px_16px_rgba(15,23,42,0.04)] transition hover:shadow-[0_8px_24px_rgba(15,23,42,0.07)]">
      <div className="flex h-full min-h-[148px]">
        <Link
          href={href}
          className="relative w-[42%] shrink-0 self-stretch sm:w-[44%]"
          aria-label={blog.title}
        >
          <Image
            src={blog.image}
            alt=""
            fill
            sizes="(max-width: 1024px) 40vw, 16vw"
            className="object-cover"
          />
        </Link>

        <div className="flex min-w-0 flex-1 flex-col p-3.5 sm:p-4">
          {blog.category && (
            <span className="inline-flex w-fit rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
              {blog.category}
            </span>
          )}

          <Link href={href} className="mt-2 block">
            <h3 className="line-clamp-3 text-sm font-bold leading-snug text-foreground transition hover:text-[#2563EB] sm:text-[15px]">
              {blog.title}
            </h3>
          </Link>

          {blog.date && (
            <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock3 className="h-3.5 w-3.5 shrink-0" aria-hidden />
              {blog.date}
            </p>
          )}

          <Link
            href={href}
            className="mt-auto inline-flex items-center gap-1 pt-3 text-sm font-semibold text-[#2563EB] transition hover:text-[#1D4ED8]"
          >
            Read More
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
