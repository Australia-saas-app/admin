"use client";

import React from "react";
import { Button } from "@/src/shared/ui/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showPageNumbers?: number;
  className?: string;
  pageSize?: number;
  totalResults?: number;
  onPageSizeChange?: (size: number) => void; // NEW: per-page dropdown
  pageSizeOptions?: number[];                // NEW: options list
}

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  showPageNumbers = 5,
  className = "",
  pageSize = 10,
  totalResults,
  onPageSizeChange,
  pageSizeOptions = PAGE_SIZE_OPTIONS,
}) => {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();
  const startResult = (currentPage - 1) * pageSize + 1;
  const endResult = totalResults !== undefined
    ? Math.min(totalResults, currentPage * pageSize)
    : Math.min(totalPages * pageSize, currentPage * pageSize);

  return (
    <div className={`flex flex-col md:flex-row justify-between items-center gap-4 md:gap-2 w-full ${className}`}>
      {/* Left: results summary + per-page selector */}
      <div className="flex items-center gap-3 text-sm text-slate-500 font-medium">
        {typeof totalResults === "number" && (
          <span>
            Showing {startResult}–{endResult} of {totalResults} results
          </span>
        )}

        {onPageSizeChange && (
          <div className="flex items-center gap-2 ml-1">
            <span className="text-slate-400 text-xs">Rows:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                onPageSizeChange(Number(e.target.value));
                onPageChange(1); // reset to page 1 when page size changes
              }}
              className="h-8 px-2 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 cursor-pointer hover:border-blue-300 transition-colors"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Right: page navigation */}
      <div className="flex flex-wrap justify-center md:justify-end items-center gap-2 w-full md:w-auto">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          PREV
        </Button>

        {pageNumbers.map((page, index) => {
          if (page === "...") {
            return (
              <span key={`ellipsis-${index}`} className="px-2 text-slate-500 font-medium tracking-widest">
                ...
              </span>
            );
          }
          return (
            <Button
              key={`page-${page}`}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(page as number)}
              className={
                currentPage === page
                  ? "bg-blue-600 text-white border-none shadow-sm font-bold cursor-pointer hover:bg-blue-700 transition-all"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-all shadow-sm"
              }
            >
              {page}
            </Button>
          );
        })}

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          NEXT
        </Button>
      </div>
    </div>
  );
};
