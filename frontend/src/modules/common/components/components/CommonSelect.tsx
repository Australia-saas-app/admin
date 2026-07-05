"use client"
import Select, { type MultiValue, type StylesConfig, components } from "react-select"
import { X } from "lucide-react"
// import { cn } from "@/lib/utils"
import { type Control, Controller, type FieldPath, type FieldValues } from "react-hook-form"
import { cn } from "@/src/lib/utils"

export interface Option {
  value: string
  label: string
  color?: string
}

interface MultiSelectProps {
  options: Option[]
  value?: Option[]
  onChange?: (selected: Option[]) => void
  placeholder?: string
  className?: string
  isDisabled?: boolean
  isLoading?: boolean
}

interface MultiSelectFormProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<MultiSelectProps, "value" | "onChange"> {
  control: Control<TFieldValues>
  name: TName
}

const MultiValueRemove = (props: any) => {
  return (
    <components.MultiValueRemove {...props}>
      <X className="h-3 w-3" />
    </components.MultiValueRemove>
  )
}

const customStyles: StylesConfig<Option, true> = {
  control: (provided, state) => ({
    ...provided,
    minHeight: "44px",
    border: "2px solid #e2e8f0",
    borderRadius: "8px",
    borderColor: state.isFocused ? "#3b82f6" : "#e2e8f0",
    boxShadow: state.isFocused ? "0 0 0 1px #3b82f6" : "none",
    "&:hover": {
      borderColor: state.isFocused ? "#3b82f6" : "#cbd5e1",
    },
    backgroundColor: "white",
    cursor: "text",
  }),
  multiValue: (provided, { data }) => ({
    ...provided,
    backgroundColor: data.color ? `${data.color}20` : "#dbeafe",
    borderRadius: "6px",
    border: `1px solid ${data.color || "#3b82f6"}40`,
    margin: "2px",
  }),
  multiValueLabel: (provided, { data }) => ({
    ...provided,
    color: data.color || "#1e40af",
    fontWeight: "500",
    fontSize: "14px",
    padding: "4px 8px",
  }),
  multiValueRemove: (provided, { data }) => ({
    ...provided,
    color: data.color || "#1e40af",
    ":hover": {
      backgroundColor: data.color ? `${data.color}40` : "#bfdbfe",
      color: data.color || "#1e40af",
    },
    borderRadius: "0 4px 4px 0",
    paddingLeft: "4px",
    paddingRight: "8px",
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#64748b",
    fontSize: "14px",
  }),
  input: (provided) => ({
    ...provided,
    color: "#1e293b",
    fontSize: "14px",
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    zIndex: 9999,
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? "#3b82f6" : state.isFocused ? "#f1f5f9" : "white",
    color: state.isSelected ? "white" : "#1e293b",
    ":active": {
      backgroundColor: "#3b82f6",
      color: "white",
    },
    fontSize: "14px",
    padding: "8px 12px",
  }),
  clearIndicator: (provided) => ({
    ...provided,
    color: "#64748b",
    ":hover": {
      color: "#374151",
    },
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    color: "#64748b",
    ":hover": {
      color: "#374151",
    },
  }),
}

export function MultiSelect({
  options,
  value = [],
  onChange,
  placeholder = "Search and select options...",
  className,
  isDisabled = false,
  isLoading = false,
}: MultiSelectProps) {
  const handleChange = (selectedOptions: MultiValue<Option>) => {
    onChange?.(selectedOptions as Option[])
  }

  return (
    <div  className={cn("w-full z-50", className)}>
      <Select
        isMulti
        options={options}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        isDisabled={isDisabled}
        isLoading={isLoading}
        isSearchable
        isClearable
        closeMenuOnSelect={false}
        hideSelectedOptions={false}
        styles={customStyles}
        components={{
          MultiValueRemove,
        }}
        classNamePrefix="react-select"
      />
    </div>
  )
}

export function CommonSelect<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  options,
  placeholder = "Search and select options...",
  className,
  isDisabled = false,
  isLoading = false,
}: MultiSelectFormProps<TFieldValues, TName>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <div className={cn("w-full", className)}>
          <MultiSelect
            options={options}
            value={value || []}
            onChange={onChange}
            placeholder={placeholder}
            isDisabled={isDisabled}
            isLoading={isLoading}
          />
          {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
        </div>
      )}
    />
  )
}
