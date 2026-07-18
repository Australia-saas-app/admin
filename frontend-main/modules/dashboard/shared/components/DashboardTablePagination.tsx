function getPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) {
    return total >= 10 ? [1, 2, 3, 4, "...", 9, 10] : [1, 2, 3, 4, "...", total - 1, total];
  }
  if (current >= total - 3) return [1, "...", total - 3, total - 2, total - 1, total];
  return [1, "...", current - 1, current, current + 1, "...", total];
}

function getCompactPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 4) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 2) return [1, 2, 3, "...", total];
  if (current >= total - 1) return [1, "...", total - 2, total - 1, total];
  return [1, "...", current, "...", total];
}

interface DashboardTablePaginationProps {
  current: number;
  total: number;
  pageSize: number;
  totalItems: number;
  onChange: (page: number) => void;
  compact?: boolean;
}

export function DashboardTablePagination({
  current,
  total,
  pageSize,
  totalItems,
  onChange,
  compact = false,
}: DashboardTablePaginationProps) {
  const pages = compact ? getCompactPageNumbers(current, total) : getPageNumbers(current, total);
  const start = (current - 1) * pageSize + 1;
  const end = Math.min(current * pageSize, totalItems);

  return (
    <div
      className={`mt-4 flex flex-col gap-2 text-xs font-bold text-gray-500 ${
        compact ? "items-center" : "sm:flex-row sm:items-center sm:justify-between"
      }`}
    >
      {!compact && (
        <span className="shrink-0">
          Showing {start} to {end} of {totalItems} results
        </span>
      )}

      <div className="flex max-w-full flex-wrap items-center justify-center gap-1">
        <button
          type="button"
          onClick={() => onChange(Math.max(1, current - 1))}
          disabled={current === 1}
          className="shrink-0 rounded border border-gray-200 px-2 py-1 hover:bg-gray-50 disabled:opacity-50"
        >
          {compact ? "‹" : "‹ Prev"}
        </button>

        {pages.map((item, idx) =>
          item === "..." ? (
            <span key={`ellipsis-${idx}`} className="px-1 text-gray-400">
              ...
            </span>
          ) : (
            <button
              key={`page-${item}`}
              type="button"
              onClick={() => onChange(item)}
              className={`min-w-7 shrink-0 rounded px-2 py-1 ${
                current === item ? "bg-primary text-white" : "border border-gray-200"
              }`}
            >
              {item}
            </button>
          )
        )}

        <button
          type="button"
          onClick={() => onChange(Math.min(total, current + 1))}
          disabled={current === total}
          className="shrink-0 rounded border border-gray-200 px-2 py-1 hover:bg-gray-50 disabled:opacity-50"
        >
          {compact ? "›" : "Next ›"}
        </button>
      </div>
    </div>
  );
}
