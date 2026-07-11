"use client"

import { Form } from "@/src/shared/ui/form/form"
import { FormTextInput } from "@/src/shared/ui/form/form-text-input"
import { FormActions } from "@/src/shared/ui/form/FormActions"
import { RichTextEditor } from "@/src/shared/ui/form/RichTextEditor"
import { UploadFile } from "@/src/shared/ui/form/UploadFile"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

type NoticeFormData = {
  title: string
  description?: string
  file?: File | string | null
}

type Props = {
  onSubmit: (data: NoticeFormData, file: File | null) => void
  onCancel?: () => void
  initialTitle?: string
  initialDescription?: string
  isSubmitting?: boolean
}

const NoticeForm: React.FC<Props> = ({ onSubmit, onCancel, initialTitle = "", isSubmitting = false }) => {
  const form = useForm<NoticeFormData>({ defaultValues: { title: initialTitle,  file: null } })
  const { handleSubmit, reset, getValues, watch, setValue, control } = form

  // Keep a preview URL for file preview (image)
  const fileVal = watch("file")
  const [preview, setPreview] = useState<null | { type: "image" | "file"; url?: string; name?: string }>(null)


  useEffect(() => {
    if (!fileVal) {
      setPreview(null)
      return
    }

    if (fileVal instanceof File) {
      if (fileVal.type.startsWith("image/")) {
        const url = URL.createObjectURL(fileVal)
        setPreview({ type: "image", url })
        return () => {
          URL.revokeObjectURL(url)
        }
      }
      setPreview({ type: "file", name: fileVal.name })
      return
    }

    // If field is a string (uploaded URL), show as file link
    if (typeof fileVal === "string" && fileVal.length > 0) {
      setPreview({ type: "file", name: fileVal })
      return
    }

    setPreview(null)
  }, [fileVal])

  const submit = handleSubmit((vals) => {
    const fv = getValues("file")
    const fileObj = fv instanceof File ? fv : null
    onSubmit({ title: vals.title, description: vals.description }, fileObj)
    reset()
    setPreview(null)
  })

  return (
    <Form {...form}>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">File</label>
          <div >
            <UploadFile control={control} name="file"   accept="image/*,application/pdf" uploadImmediately={false} />
            {preview && preview.type === "image" && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview.url} alt="preview" className="w-20 h-16 object-cover rounded shadow-sm" />
            )}
            {preview && preview.type === "file" && (
              <div className="px-3 py-2 bg-gray-100 rounded text-sm">{preview.name}</div>
            )}
          </div>
        </div>

        <div>
          <FormTextInput control={control} name="title" placeholder="Notice Title" />
        </div>



        <div className="flex justify-end">
          <FormActions onCancel={onCancel} submitLabel="Save" isSubmitting={isSubmitting} />
        </div>
      </form>
    </Form>
  )
}

export default NoticeForm
