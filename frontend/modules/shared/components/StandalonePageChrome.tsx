import Link from "next/link";

export function StandalonePageChrome({ title }: { title: string }) {
  return (
    <header className="border-b border-gray-200 bg-white px-4 py-3">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <Link href="/" className="text-sm font-semibold text-primary hover:underline shrink-0">
            ← Main Site
          </Link>
          <span className="text-gray-300 hidden sm:inline">|</span>
          <span className="text-sm font-medium text-gray-700 truncate">{title}</span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/sitemap"
            className="text-xs text-gray-500 hover:text-primary hidden sm:inline"
          >
            Sitemap
          </Link>
          <Link
            href="/account/user/login"
            className="text-xs font-semibold bg-primary text-white px-3 py-1.5 rounded-md hover:bg-primary/90"
          >
            Login
          </Link>
        </div>
      </div>
    </header>
  );
}
