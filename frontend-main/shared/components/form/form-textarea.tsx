"use client"

import { Textarea } from "@/src/components/ui/textarea"
import { FormControl, FormField, FormItem, FormMessage } from "./form"
import type { Control, FieldPath, FieldValues } from "react-hook-form"
import React from "react"

interface FormTextareaProps<T extends FieldValues> {
  control: Control<T>
  name: FieldPath<T>
  placeholder?: string
  className?: string
}

export function FormTextarea<T extends FieldValues>({ control, name, placeholder = "", className = "" }: FormTextareaProps<T>) {
  return (
    <FormField control={control} name={name} render={({ field }) => (
      <FormItem>
        <FormControl>
          <Textarea placeholder={placeholder} {...field} className={className} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )} />
  )
}

export default FormTextarea
