"use client";

export default function DashboardError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <h2 className="text-lg font-semibold text-gray-900">Something went wrong</h2>
      <p className="mt-2 text-sm text-gray-500">
        We could not load this dashboard page. Please try again.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
      >
        Try again
      </button>
    </div>
  );
}
