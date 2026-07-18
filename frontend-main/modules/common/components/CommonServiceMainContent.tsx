"use client";
import React, { useState } from "react";
import CommonServiceCard, { CommonServiceCardProps } from "./CommonServiceCard";
import CommonProjectCard, { CommonProjectCardProps } from "./CommonProjectCard";
// import CommonPagination from "./CommonPagination";
// import { ChevronDown } from "lucide-react";
// import CommonProjectCard, { CommonProjectCardProps } from "./CommonProjectCard";
// import CommonServiceCard, { CommonServiceCardProps } from "./CommonServiceCard";

const sortOptions = [
  { value: "relevance", label: "Relevance" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "newest", label: "Newest" },
];

import { ChevronDown } from "lucide-react";
type CommonServiceMainContentProps = {
  role: "agency" | "freelancer";
  mainContentData: CommonServiceCardProps[] | CommonProjectCardProps[];
  isSidebarOpen: boolean;
  sortBy: string;
  onSortChange: (newSort: string) => void;
};

const CommonServiceMainContent = ({
  role,
  mainContentData,
  isSidebarOpen,
  sortBy,
  onSortChange,
}: CommonServiceMainContentProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalItems = 97;
  const itemsPerPage = 12;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const totalServices = 300;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const currentSort = sortOptions.find((option) => option.value === sortBy);

  return (
    <main
      className={`transition-all duration-300 ease-in-out ${isSidebarOpen ? "flex-1" : "w-full"}`}
    >
      {/* Results Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <p className="text-muted-foreground">
            Top results • {mainContentData.length} of {totalServices}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-between w-40 px-3 py-2 text-sm bg-card border border-border rounded-md shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <span>{currentSort?.label}</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-md shadow-lg">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      onSortChange(option.value);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-sm text-left hover:bg-muted/60 first:rounded-t-md last:rounded-b-md ${
                      sortBy === option.value ? "bg-purple-50 text-purple-700" : "text-foreground"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Service Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2  gap-5">
        {role === "agency"
          ? (mainContentData as CommonServiceCardProps[] | undefined)?.map((item, index) => (
              <CommonServiceCard key={index} data={item} />
            ))
          : (mainContentData as CommonProjectCardProps[] | undefined)?.map((item, index) => (
              <CommonProjectCard key={index} data={item} />
            ))}
      </div>

      {/* Pagination */}
      {/* <CommonPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      /> */}
    </main>
  );
};

export default CommonServiceMainContent;
