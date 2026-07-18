import Link from "next/link";
import { PageContainer } from "@/src/shared/components/layout/PageContainer";
import { SITEMAP_SECTIONS } from "@/src/shared/constants/site-routes";
import { buildMetadata } from "@/src/lib/seo";

export const metadata = buildMetadata({
  title: "Sitemap",
  description: "Overview of all sections and pages available on the platform.",
  path: "/sitemap",
});

export default function SitemapPage() {
  return (
    <PageContainer size="lg">
      <div className="reveal rounded-3xl border border-border bg-card p-6 shadow-sm md:p-10">
        <header className="mb-8 border-b border-border pb-6">
          <p className="text-xs font-bold uppercase tracking-widest text-primary">Navigation</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
            Sitemap
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Browse all major sections of the platform.
          </p>
        </header>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SITEMAP_SECTIONS.map((section) => (
            <section
              key={section.title}
              className="card-lift rounded-2xl border border-border bg-background/60 p-5"
            >
              <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-primary">
                {section.title}
              </h2>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-foreground/80 transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </PageContainer>
  );
}
