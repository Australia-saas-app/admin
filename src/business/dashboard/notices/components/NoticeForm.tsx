"use client"

import React from "react"
import { useForm } from "react-hook-form"
import { Form } from "@/src/shared/ui/form/form"
import { FormTextInput } from "@/src/shared/ui/form/form-text-input"
import { FormCheckbox } from "@/src/shared/ui/form/form-checkbox"
import { FormSelect } from "@/src/shared/ui/form/form-select" // Ensure this path is correct
import { FormActions } from "@/src/shared/ui/form/FormActions"
import EditorHTML from "@/src/shared/ui/form/EditorHTML"

const priorityOptions = [
    { value: "high", label: "High" },
    { value: "medium", label: "Medium" },
    { value: "low", label: "Low" },
]

interface NoticeFormValues {
    title: string
    priority: string
    isVisible: boolean
    publishDate: string
    file: File | null
    description: string
}

export const NoticeForm = ({ initial = {}, onCancel, onSubmit }: any) => {
    const form = useForm<NoticeFormValues>({
        defaultValues: {
            title: initial.title ?? "",
            description: initial.description ?? "",
            priority: initial.priority ?? "medium",
            isVisible: initial.isVisible ?? true,
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
                        <FormTextInput control={control} name="title" placeholder="Notice Title" />
                    </div>
                    {/* Description */}

                    <div>
                        <label className="text-sm font-medium mb-1 block">Description</label>
                        <EditorHTML
                            value={form.watch("description")}
                            onChange={(value) => form.setValue("description", value)}
                            placeholder="Enter notice description..."
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

                    {/* Priority - FIXED SECTION */}
                    <div>
                        <label className="text-sm font-medium mb-1 block">Priority</label>
                        <FormSelect
                            control={control}
                            name="priority"
                            placeholder="Select priority"
                            options={priorityOptions}
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <FormCheckbox control={control} name="isVisible" label="Is Visible" />
                </div>

                <FormActions onCancel={onCancel} submitLabel={initial.id ? "Update" : "Save"} />
            </form>
        </Form>
    )
}

export default NoticeForm