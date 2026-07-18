"use client";

import React from "react";

interface Props {
  fileUrl: string;
  fileType: "image" | "pdf";
  onView: (fileUrl: string, fileType: "image" | "pdf") => void;
}

export default function NoticeTableActionColumn({ fileUrl, fileType, onView }: Props) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onView(fileUrl, fileType)}
        className="px-3 py-1 bg-secondary text-white rounded text-sm hover:opacity-90"
      >
        View
      </button>
    </div>
  );
}