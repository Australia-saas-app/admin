import Link from "next/link";
import { ArrowLeft, Map } from "lucide-react";
import { PageContainer } from "@/src/shared/components/layout/PageContainer";

interface InfoPageLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function InfoPageLayout({ title, subtitle, children }: InfoPageLayoutProps) {
  return (
    <PageContainer size="md">
      <div className="reveal rounded-3xl border border-border bg-card p-6 shadow-sm md:p-10">
        <header className="mb-8 border-b border-border pb-6">
          <p className="text-xs font-bold uppercase tracking-widest text-primary">
            Company Information
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
              {subtitle}
            </p>
          )}
        </header>
        <div className="prose prose-sm max-w-none text-foreground/80 prose-headings:text-foreground prose-a:text-primary dark:prose-invert">
          {children}
        </div>
        <footer className="mt-10 flex flex-wrap gap-4 border-t border-border pt-6 text-sm">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 font-semibold text-primary transition-colors hover:text-primary/80"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <Link
            href="/sitemap"
            className="inline-flex items-center gap-1.5 font-semibold text-primary transition-colors hover:text-primary/80"
          >
            <Map className="h-4 w-4" />
            View Sitemap
          </Link>
        </footer>
      </div>
    </PageContainer>
  );
}
