"use client"

import { Form } from "@/src/shared/ui/form/form"
import { FormTextInput } from "@/src/shared/ui/form/form-text-input"
import { FormActions } from "@/src/shared/ui/form/FormActions"
import { RichTextEditor } from "@/src/shared/ui/form/RichTextEditor"
import { UploadFile } from "@/src/shared/ui/form/UploadFile"
import React, { useEffect } from "react"
import { useForm } from "react-hook-form"

type BlogFormData = {
  title: string
  excerpt?: string
  content?: string
  category: string
  tags: string
  isVisible: boolean
  // cover?: File | string | null // Removed
}

type Props = {
  onSubmit: (data: { title: string; excerpt?: string; content?: string; category: string; tags: string[]; isVisible: boolean }) => void
  onCancel?: () => void
  initial?: any
  isSubmitting?: boolean
}

const BlogForm: React.FC<Props> = ({ onSubmit, onCancel, initial = {}, isSubmitting = false }) => {
  const defaultValues: BlogFormData = {
    title: initial?.title ?? "",
    excerpt: initial?.excerpt ?? "",
    content: initial?.content ?? "",
    category: initial?.category ?? "",
    tags: Array.isArray(initial?.tags) ? initial.tags.join(", ") : (initial?.tags ?? ""),
    isVisible: initial?.isVisible ?? true,
    // cover: null, // Removed
  }

  const form = useForm<BlogFormData>({ defaultValues })
  const { handleSubmit, reset, watch, setValue, control } = form // Removed getValues

  useEffect(() => {
    if (initial) {
      reset({
        title: initial.title ?? "",
        excerpt: initial.excerpt ?? "",
        content: initial.content ?? "",
        category: initial.category ?? "",
        tags: Array.isArray(initial.tags) ? initial.tags.join(", ") : (initial.tags ?? ""),
        isVisible: initial.isVisible ?? true,
      })
    }
  }, [initial, reset])

  const submit = handleSubmit((vals) => {
    // const fv = getValues("cover") // Removed
    // const coverFile = fv instanceof File ? fv : null // Removed
    const tagsArray = vals.tags.split(",").map(t => t.trim()).filter(t => t !== "")
    onSubmit({
      title: vals.title,
      excerpt: vals.excerpt,
      content: vals.content,
      category: vals.category,
      tags: tagsArray,
      isVisible: vals.isVisible
    }) // Removed coverFile parameter
    reset(defaultValues)
  })

  return (
    <Form {...form}>
      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Removed UploadFile component */}
          {/* Simplified layout */}
          <FormTextInput control={control} name="title" placeholder="Blog title" />
          <FormTextInput control={control} name="category" placeholder="e.g. News, Tech" />
        </div>

        <FormTextInput control={control} name="tags" placeholder="e.g. tag1, tag2" />

        <FormTextInput control={control} name="excerpt" placeholder="Short description" />

        <div className="flex items-center gap-2 py-2">
          <input
            type="checkbox"
            id="isVisible"
            checked={watch("isVisible")}
            onChange={(e) => setValue("isVisible", e.target.checked)}
            className="w-4 h-4"
          />
          <label htmlFor="isVisible" className="text-sm font-medium">Visible to public</label>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Content</label>
          <RichTextEditor value={watch("content") ?? ""} onChange={(v) => setValue("content", v)} className="bg-white" />
        </div>

        <div className="flex justify-end">
          <FormActions onCancel={onCancel} submitLabel="Save Blog" isSubmitting={isSubmitting} />
        </div>
      </form>
    </Form>
  )
}

export default BlogForm
