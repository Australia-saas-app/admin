"use client";

import { cn } from "@/src/lib/utils";
import React from "react";


export type DataColumn<T> = {
  header: React.ReactNode;
  accessor?: keyof T | string;
  width?: string;
  className?: string;
  render?: (row: T, index: number) => React.ReactNode;
};

type DataTableProps<T> = {
  data: T[];
  columns: DataColumn<T>[];
  rowKey?: (row: T, index: number) => string;
  className?: string;
  empty?: React.ReactNode;
  compact?: boolean;
};

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  rowKey,
  className,
  empty,
  compact = false,
}: DataTableProps<T>) {
  const getKey = (row: T, idx: number) => {
    if (rowKey) return rowKey(row, idx);
    if ((row as any).id) return String((row as any).id);
    return `${idx}`;
  };

  if (!data || data.length === 0) {
    return (
      <div className={cn("w-full", className)}>
        {empty ?? <div className="text-center py-4 text-sm text-muted-foreground">No data</div>}
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      <table className={cn(
        "w-full border-collapse table-fixed",
        compact ? "text-[10px]" : "text-[10px] sm:text-xs"
      )}>
        <thead className="bg-accent text-white">
          <tr>
            {columns.map((col, idx) => (
              <th
                key={idx}
                style={col.width ? { width: col.width } : undefined}
                className={cn(
                  compact ? "p-5  text-left align-middle truncate" : "p-5 text-left align-middle truncate",
                  col.className
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-accent">
          {data.map((row, rIdx) => (
            <tr 
              key={getKey(row, rIdx)} 
              className="hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
            >
              {columns.map((col, cIdx) => {
                const cell =
                  col.render !== undefined
                    ? col.render(row, rIdx)
                    : col.accessor
                    ? String((row as any)[col.accessor])
                    : null;
                return (
                  <td 
                    key={cIdx} 
                    className={cn(
                        compact ? "p-5 align-top truncate" : "p-5 align-top truncate",
                        col.className
                      )}
                  >
                    {cell}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;