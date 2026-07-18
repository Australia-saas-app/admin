"use client";

import { Input } from "@/src/components/ui/input";
import { FormControl, FormField, FormItem, FormMessage } from "./form";
import type { Control, FieldPath, FieldValues } from "react-hook-form";

interface FormTextInputProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  placeholder: string;
  type?: "text" | "email" | "number" | "password" | "date";
}

export function FormTextInput<T extends FieldValues>({
  control,
  name,
  placeholder,
  type = "text",
}: FormTextInputProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Input
              type={type}
              placeholder={placeholder}
              {...field}
              value={
                typeof field.value === "string" || typeof field.value === "number"
                  ? field.value
                  : ""
              }
              className="bg-white text-slate-900 placeholder:text-slate-500 border-0"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
