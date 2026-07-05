"use client";

import React, { ReactNode } from "react";

interface TableRowProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export const TableRow: React.FC<TableRowProps> = ({
  children,
  className = "border-b border-gray-200 hover:bg-gray-50",
  onClick,
}) => {
  return (
    <tr
      className={`${className} ${onClick ? "cursor-pointer" : ""}`}
      onClick={onClick}
    >
      {children}
    </tr>
  );
};

export default TableRow;