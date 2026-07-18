import Link from "next/link";
import { PageContainer } from "@/src/shared/components/layout/PageContainer";
import { Button } from "@/src/components/ui/button";

export default function NotFound() {
  return (
    <PageContainer size="sm" className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm md:p-12">
        <p className="text-xs font-bold uppercase tracking-widest text-primary">Error 404</p>
        <h1 className="mt-3 text-3xl font-bold text-gray-900 md:text-4xl">Page not found</h1>
        <p className="mt-3 text-sm leading-relaxed text-gray-600">
          The page you are looking for may have been moved, deleted, or never existed.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild className="bg-primary hover:bg-primary/90">
            <Link href="/">Back to Home</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/sitemap">View Sitemap</Link>
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}
