"use client";

import React from "react";
import { Button } from "@/src/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showPageNumbers?: number; // How many page numbers to show
  className?: string;
  pageSize?: number;
  totalResults?: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  showPageNumbers = 5,
  className = "",
  pageSize = 10,
  totalResults,
}) => {
  // Calculate which page numbers to show
  const getPageNumbers = () => {
    const pages: number[] = [];
    let startPage = Math.max(1, currentPage - Math.floor(showPageNumbers / 2));
    const endPage = Math.min(totalPages, startPage + showPageNumbers - 1);

    // Adjust start if we're near the end
    if (endPage - startPage + 1 < showPageNumbers) {
      startPage = Math.max(1, endPage - showPageNumbers + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  // Calculate start and end item numbers for the summary
  const startResult = (currentPage - 1) * pageSize + 1;
  const endResult = totalResults !== undefined ? Math.min(totalResults, currentPage * pageSize) : Math.min(totalPages * pageSize, currentPage * pageSize);

  return (
    <div className={`flex flex-row justify-between items-center gap-2 ${className}`}>
      {typeof totalResults === "number" && (
        <div className="text-sm text-gray-700">{
          `Showing ${startResult} to ${endResult} of ${totalResults} results`
        }</div>
      )}

      <div className="flex justify-end items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="bg-gray-200 text-gray-700 cursor-pointer hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          PREV
        </Button>
        {pageNumbers.map((page) => (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(page)}
            className={
              currentPage === page
                ? "bg-secondary text-base-400 cursor-pointer hover:text-white"
                : "bg-white text-gray-700 border-gray-300 cursor-pointer hover:text-white"
            }
          >
            {page}
          </Button>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="bg-gray-200 text-gray-700 cursor-pointer hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          NEXT
        </Button>
      </div>
    </div>
  );
};
