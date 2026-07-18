"use client"

import React from "react"
import { RadioGroup as RadioGroupUI, RadioGroupItem } from "@/src/components/ui/radio-group"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "./form"
import type { Control, FieldPath, ControllerRenderProps, FieldValues } from "react-hook-form"

interface Option {
  value: string
  label: string
}

interface FormRadioGroupProps<T extends FieldValues> {
  control: Control<T>
  name: FieldPath<T>
  options: Option[]
  label?: string
}

export function FormRadioGroup<T extends FieldValues>({ control, name, options, label }: FormRadioGroupProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={(props) => {
        const maybe = props as unknown as { field?: ControllerRenderProps<any, FieldPath<any>> } | ControllerRenderProps<any, FieldPath<any>>
        const field: ControllerRenderProps<any, FieldPath<any>> =
          "field" in maybe && maybe.field ? maybe.field : (maybe as ControllerRenderProps<any, FieldPath<any>>)

        return (
          <FormItem>
            {label && <FormLabel>{label}</FormLabel>}
            <FormControl>
              <RadioGroupUI value={field.value} onValueChange={field.onChange}>
                <div className="flex gap-4">
                  {options.map((opt) => (
                    <div key={opt.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={opt.value} id={String(opt.value)} />
                      <label htmlFor={String(opt.value)} className="text-sm cursor-pointer">
                        {opt.label}
                      </label>
                    </div>
                  ))}
                </div>
              </RadioGroupUI>
            </FormControl>
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}

export default FormRadioGroup
