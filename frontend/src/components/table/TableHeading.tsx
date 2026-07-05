"use client";

import React, { ReactNode } from "react";


interface TableHeadingProps {
  children: ReactNode;
  className?: string;
}

export const TableHeading: React.FC<TableHeadingProps> = ({
  children,
  className = "bg-secondary text-base-400",
}) => {
  return (
    <thead className={className}>
      <tr className="border-b-2 border-gray-300">{children}</tr>
    </thead>
  );
};

export default TableHeading;