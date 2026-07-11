"use client"

import React from "react"
import { SearchInput } from "@/src/shared/ui/form/search-input"

interface Props {
  query: string
  onQueryChange: (v: string) => void
  country: string
  onCountryChange: (v: string) => void
  businessType: string
  onBusinessTypeChange: (v: string) => void
  status: string
  onStatusChange: (v: string) => void
}

const AffiliatesToolbar: React.FC<Props> = ({ query, onQueryChange, country, onCountryChange, businessType, onBusinessTypeChange, status, onStatusChange }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="w-72">
        <SearchInput value={query} onChange={onQueryChange} placeholder="Search" />
      </div>

      <div className="ml-auto flex items-center gap-3">
        <select value={country} onChange={(e) => onCountryChange(e.target.value)} className="h-11 px-3 rounded-md border bg-white text-sm">
          <option>All</option>
          <option>Japan</option>
          <option>USA</option>
        </select>

        <input type="date" className="h-11 px-3 rounded-md border bg-white" />
        <input type="date" className="h-11 px-3 rounded-md border bg-white" />

        <select value={businessType} onChange={(e) => onBusinessTypeChange(e.target.value)} className="h-11 px-3 rounded-md border bg-white text-sm">
          <option>All</option>
          <option>Technology</option>
          <option>Construction</option>
          <option>Retail</option>
        </select>

        <select value={status} onChange={(e) => onStatusChange(e.target.value)} className="h-11 px-3 rounded-md border bg-white text-sm">
          <option>All</option>
          <option>ACTIVE</option>
          <option>SUSPEND</option>
          <option>DORMANT</option>
          <option>CLOSED</option>
          <option>BLOCK</option>
        </select>
      </div>
    </div>
  )
}

export default AffiliatesToolbar
