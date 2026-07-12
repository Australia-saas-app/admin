"use client";

import React, { ReactNode } from "react";

interface TableRowProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export const TableRow: React.FC<TableRowProps> = ({
  children,
  className = "hover:bg-blue-50/40 dark:hover:bg-slate-800/50 transition-colors group",
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