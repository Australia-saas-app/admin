"use client"

import { Form } from "@/src/components/form/form"
import { FormActions } from "@/src/components/form/FormActions"
import { RichTextEditor } from "@/src/components/form/RichTextEditor"
import type { Company } from "@/src/modules/dashboard/menu/types/company"
import React from "react"
import { useForm } from "react-hook-form"

interface CompanyCreatePayload {
  contentName: string
  contentDescription?: string
}

interface CompanyFormProps {
  initial?: Partial<Company>
  onCancel?: () => void
  onSubmit: (data: CompanyCreatePayload) => void
}

const CONTENT_OPTIONS = [
  { value: "Privacy Policy", label: "Privacy Policy" },
  { value: "Terms & Conditions", label: "Terms & Conditions" },
  { value: "Refund Policy", label: "Refund Policy" },
  { value: "Cookie Policy", label: "Cookie Policy" },
]

export const CompanyForm: React.FC<CompanyFormProps> = ({ initial = {}, onCancel, onSubmit }) => {
  type FormValues = {
    contentName: string
    contentDescription?: string
  }

  const defaultValues: FormValues = {
    contentName: initial.contentName ?? "",
    contentDescription: initial.contentDescription ?? "",
  }

  const [contentOptions, setContentOptions] = React.useState(CONTENT_OPTIONS)
  const [isAddingNew, setIsAddingNew] = React.useState(false)
  const [newContentName, setNewContentName] = React.useState("")

  const form = useForm<FormValues>({ defaultValues })
  const { control, handleSubmit, reset, watch, setValue } = form

  const onFormSubmit = (vals: FormValues) => {
    onSubmit({
      contentName: vals.contentName,
      contentDescription: vals.contentDescription,
    })
    reset(defaultValues)
    setIsAddingNew(false)
    setNewContentName("")
  }

  const handleAddNewContent = () => {
    if (newContentName.trim()) {
      const newOption = { value: newContentName.trim(), label: newContentName.trim() }
      setContentOptions((prev) => [...prev, newOption])
      setValue("contentName", newContentName.trim())
      setNewContentName("")
      setIsAddingNew(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Content Name</label>
          {isAddingNew ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={newContentName}
                onChange={(e) => setNewContentName(e.target.value)}
                placeholder="Enter new content name"
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
              <button
                type="button"
                onClick={handleAddNewContent}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAddingNew(false)
                  setNewContentName("")
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <select
                value={watch("contentName") || ""}
                onChange={(e) => setValue("contentName", e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="">Select content type</option>
                {contentOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setIsAddingNew(true)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
              >
                Add New
              </button>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Content Description</label>
          <RichTextEditor value={watch("contentDescription") ?? ""} onChange={(v) => setValue("contentDescription", v)} />
        </div>

        <FormActions onCancel={onCancel} submitLabel={initial ? "Update" : "Save"} />
      </form>
    </Form>
  )
}

export default CompanyForm
