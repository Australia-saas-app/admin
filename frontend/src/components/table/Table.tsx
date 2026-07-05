"use client";

import React, { ReactNode } from "react";

interface TableProps {
  children: ReactNode;
  className?: string;
  headerClassName?: string;
}

export const Table: React.FC<TableProps> = ({
  children,
  className = "",
  headerClassName = "bg-secondary text-base-400",
}) => {
  return (
    <div
      className={`bg-white rounded-lg w-container overflow-hidden shadow border border-gray-200 ${className}`}
    >
      <div className="overflow-x-auto">
        <table
          className="w-full min-w-[800px] border-collapse"
          data-header-class={headerClassName}
        >
          {children}
        </table>
      </div>
    </div>
  );
};

export default Table;