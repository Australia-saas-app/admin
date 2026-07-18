import { Skeleton, SkeletonCard } from "@/src/components/ui/SkeletonCard";

export default function BlogsLoading() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl px-4 py-8 md:px-6" aria-busy="true">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="mt-3 h-4 w-80" />
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </main>
  );
}
