import { Skeleton, SkeletonCard } from "@/src/components/ui/SkeletonCard";

export default function MarketplaceLoading() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl px-4 py-8 md:px-6" aria-busy="true">
      <Skeleton className="h-8 w-56" />
      <div className="mt-6 flex gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-24 rounded-full" />
        ))}
      </div>
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </main>
  );
}
