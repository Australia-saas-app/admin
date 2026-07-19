"use client"

import { ChevronDown, X } from "lucide-react"

interface AdminActionBarProps {
  className?: string
}

export default function AdminActionBar({ className = "" }: AdminActionBarProps) {
  return (
    <div className={`flex justify-end gap-3 mb-4 items-center ${className}`}>
      <button type="button" className="px-4 py-2 bg-white border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50">
        Admin log
      </button>
      <button type="button" className="px-4 py-2 bg-white border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2">
        Status
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </button>
      <button type="button" className="px-6 py-2 bg-[#2f64ed] text-white rounded text-sm font-medium hover:bg-blue-700">
        Save
      </button>
      <button type="button" className="w-9 h-9 flex items-center justify-center bg-white border border-gray-300 rounded text-red-500 hover:bg-red-50">
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
