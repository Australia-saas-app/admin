"use client"

import React from "react"
import { SearchInput } from "@/src/components/form/search-input"
import type { UserRow } from "./users.types"

interface Props {
  query: string
  onQueryChange: (v: string) => void
  currency: string
  onCurrencyChange: (v: string) => void
  status: string
  onStatusChange: (v: string) => void
  startDate: string
  onStartDateChange: (v: string) => void
  endDate: string
  onEndDateChange: (v: string) => void
}

const UsersToolbar: React.FC<Props> = ({ 
  query, onQueryChange, 
  currency, onCurrencyChange, 
  status, onStatusChange,
  startDate, onStartDateChange,
  endDate, onEndDateChange
}) => {
  return (
    <div className="flex items-center gap-3">
      <div className="w-72">
        <SearchInput value={query} onChange={onQueryChange} placeholder="Search" />
      </div>

      <div className="ml-auto flex items-center gap-3">
        <select value={currency} onChange={(e) => onCurrencyChange(e.target.value)} className="h-11 px-3 rounded-md border bg-white text-sm">
          <option>All</option>
          <option>USD</option>
          <option>JPY</option>
          <option>EUR</option>
          <option>GBP</option>
        </select>

        <input 
          type="date" 
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          className="h-11 px-3 rounded-md border bg-white" 
        />
        <input 
          type="date" 
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          className="h-11 px-3 rounded-md border bg-white" 
        />

        <select value={status} onChange={(e) => onStatusChange(e.target.value)} className="h-11 px-3 rounded-md border bg-white text-sm">
          <option>All</option>
          <option>ACTIVE</option>
          <option>PENDING</option>
          <option>SUSPEND</option>
          <option>DORMANT</option>
          <option>CLOSED</option>
          <option>BLOCK</option>
        </select>
      </div>
    </div>
  )
}

export default UsersToolbar
