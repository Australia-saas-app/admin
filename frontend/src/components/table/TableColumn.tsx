"use client";

import React, { ReactNode } from "react";

interface TableColumnProps {
  children: ReactNode;
  align?: "left" | "center" | "right";
  className?: string;
  isHeader?: boolean;
  title?: string;
}

export const TableColumn: React.FC<TableColumnProps> = ({
  children,
  align = "left",
  className = "",
  isHeader = false,
  title = "",
}) => {
  const alignClass =
    align === "center"
      ? "text-center"
      : align === "right"
        ? "text-right"
        : "text-left";

  const baseClass = isHeader
    ? `px-4 md:px-6 py-2 md:py-3 ${alignClass} text-xs md:text-sm font-semibold whitespace-nowrap border-r border-gray-200 last:border-r-0`
    : `px-4 md:px-6 py-3 md:py-4 ${alignClass} text-xs md:text-sm border-r border-gray-200 last:border-r-0`;

  if (isHeader) {
    return <th className={`${baseClass} ${className}`}>{children}</th>;
  }

  return <td className={`${baseClass} ${className} text-nowrap`}>
   {
    title ? ( <div title={title} className='max-w-[190px] truncate whitespace-nowrap'>
      {children}
    </div>) : children
   }
  </td>;
};

export default TableColumn;