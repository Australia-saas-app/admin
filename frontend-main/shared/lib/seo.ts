/**
 * SEO metadata helpers.
 *
 * Static page:
 *   import { buildMetadata } from "@/src/lib/seo";
 *   export const metadata = buildMetadata({ title: "Blogs", description: "...", path: "/blogs" });
 *
 * Dynamic page:
 *   export async function generateMetadata({ params }): Promise<Metadata> {
 *     const item = await fetchItem(params.id);
 *     return buildMetadata({ title: item.title, description: item.excerpt, path: `/items/${item.id}` });
 *   }
 *
 * The root layout defines a `%s | AppName` title template, so `title` here
 * should be the plain page title (no app-name suffix).
 */
import type { Metadata } from "next";
import envConfig from "@/src/config";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://system-db.example.com";

const DEFAULT_DESCRIPTION =
  "Maritime Database and Management System – connect, collaborate, and grow your maritime business.";

interface SeoOverrides {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  noIndex?: boolean;
  path?: string;
  /** OpenGraph type. Defaults to "website"; use "article" for blog posts. */
  type?: "website" | "article";
  publishedTime?: string;
}

export function buildMetadata(overrides: SeoOverrides = {}): Metadata {
  const appName = envConfig.appName;
  const fullTitle = overrides.title ? `${overrides.title} | ${appName}` : appName;
  const description = overrides.description || DEFAULT_DESCRIPTION;
  const url = overrides.path ? `${SITE_URL}${overrides.path}` : SITE_URL;
  const image = overrides.image || `${SITE_URL}/og-image.png`;

  return {
    ...(overrides.title ? { title: overrides.title } : {}),
    description,
    ...(overrides.keywords ? { keywords: overrides.keywords } : {}),
    alternates: { canonical: url },
    robots: overrides.noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: appName,
      images: [{ url: image, width: 1200, height: 630, alt: fullTitle }],
      type: overrides.type ?? "website",
      ...(overrides.type === "article" && overrides.publishedTime
        ? { publishedTime: overrides.publishedTime }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
    },
  };
}
