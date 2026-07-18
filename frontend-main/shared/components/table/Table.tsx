"use client";

import React, { ReactNode } from "react";

interface TableProps {
  children: ReactNode;
  className?: string;
  headerClassName?: string;
  /** CSS min-width value for the table (e.g. '700px' or '60rem'). When the viewport is narrower, horizontal scrolling will appear. */
  minWidth?: string;
}

export const Table: React.FC<TableProps> = ({
  children,
  className = "",
  headerClassName = "bg-secondary text-base-400",
  minWidth = "800px",
}) => {
  return (
    <div className={`bg-white rounded-lg overflow-hidden shadow border border-gray-200 ${className}`}>
      <div className="overflow-x-auto">
        <table
          className="w-full"
          style={{ minWidth }}
          data-header-class={headerClassName}
        >
          {children}
        </table>
      </div>
    </div>
  );
};

export default Table;