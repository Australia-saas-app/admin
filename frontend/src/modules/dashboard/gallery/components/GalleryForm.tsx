"use client"

import EditorHTML from "@/src/components/form/EditorHTML"
import { Form } from "@/src/components/form/form"
import { FormCheckbox } from "@/src/components/form/form-checkbox"
import { FormCreatableSelect } from "@/src/components/form/form-creatable-select"
import { FormTextInput } from "@/src/components/form/form-text-input"
import { FormActions } from "@/src/components/form/FormActions"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

import { galleryService } from "../../services/platform"



interface FormValues {
    title: string
    description: string
    category: string
    isVisible: boolean
    file: File | null
}

type CategoryOption = { label: string; value: string }

interface GalleryFormProps {
    initial?: Partial<FormValues> & { id?: string }
    onCancel?: () => void
    onSubmit: (data: FormValues) => void
}

export const GalleryForm = ({ initial = {}, onCancel, onSubmit }: GalleryFormProps) => {

    const [categories, setCategories] = useState<CategoryOption[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true)
        const res = await galleryService.fetchCategories()

        const raw = Array.isArray(res) ? res : (res?.data ?? [])
        const options = raw.map((cat: string) => ({ label: cat, value: cat }))

        setCategories(options)
      } catch (error) {
        console.error("Failed to load gallery categories:", error)
        setCategories([])
      } finally {
        setLoading(false)
      }
    }

    loadCategories()
  }, [])
  

    const form = useForm<FormValues>({
        defaultValues: {
            title: initial?.title ?? "",
            description: initial?.description ?? "",
            category: initial?.category ?? "",
            isVisible: initial?.isVisible ?? true,
        }
    })


    const { control, handleSubmit, setValue } = form

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-4">
                    {/* Title */}
                    <div>
                        <label className="text-sm font-medium mb-1 block">Title</label>
                        <FormTextInput control={control} name="title" placeholder="Blog Title" />
                    </div>

                    {/* Content */}

                    <div>
                        <label className="text-sm font-medium mb-1 block">Content</label>
                        <EditorHTML
                            value={form.watch("description")}
                            onChange={(value) => form.setValue("description", value)}
                            placeholder="Enter Gallery description..."
                            className="w-full"
                        />

                    </div>


                    {/* File Upload */}
                    <div>
                        <label className="text-sm font-medium mb-1 block">Attachment</label>
                        <input
                            type="file"
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90 cursor-pointer"
                            onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                    setValue("file", file)
                                }
                            }}
                        />
                    </div>
                   
                </div>

                 {/* Category - FIXED SECTION */}
                    <div>
                        <label className="text-sm font-medium mb-1 block">Category</label>
                        <FormCreatableSelect
                            control={control}
                            name="category"
                            placeholder={loading ? "Loading categories..." : "Select or type category"}
                            options={categories}
                        />
                    </div>

                <div className="flex items-center justify-between">
                    <FormCheckbox control={control} name="isVisible" label="Is Visible" />
                </div>

                <FormActions onCancel={onCancel} submitLabel={initial.id ? "Update" : "Save"} />
            </form>
        </Form>
    )
}

export default GalleryForm