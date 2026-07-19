"use client"

import React from "react"

type Option = { value: string; label: string }

interface SimpleSelectProps {
  options: Option[]
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  className?: string
  placeholder?: string
}

const SimpleSelect: React.FC<SimpleSelectProps> = ({
  options,
  value,
  onChange,
  disabled = false,
  className = "",
  placeholder,
}) => {
  return (
    <select
      className={className}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      aria-label={placeholder ?? "select"}
    >
      {placeholder ? (
        <option className="p-10" value="">{placeholder}</option>
      ) : null}
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  )
}

export default SimpleSelect
