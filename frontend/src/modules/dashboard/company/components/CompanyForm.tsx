"use client"

import { Form } from "@/src/components/form/form"
import { FormActions } from "@/src/components/form/FormActions"
import { FormTextInput } from "@/src/components/form/form-text-input"

import { useForm } from "react-hook-form"

import EditorHTML from "@/src/components/form/EditorHTML"
import { FormCheckbox } from "@/src/components/form/form-checkbox"

type CompanyFormData = {
    name: string
    description: string
    isVisible: boolean
}



const CompanyForm = ({ initial = {}, onCancel, onSubmit }: any) => {
 

     const form = useForm<CompanyFormData>({
            defaultValues: {
                name: initial?.name || "",
                description: initial?.description || "",
                isVisible: initial?.isVisible ?? true,
            }
        })
    
        const { control, handleSubmit } = form
    
        return (
            <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-4">
                        {/* Title */}
                        <div>
                            <label className="text-sm font-medium mb-1 block">Name</label>
                            <FormTextInput control={control} name="name" placeholder="Company Name" />
                        </div>
                        {/* Description */}
    
                        <div>
                            <label className="text-sm font-medium mb-1 block">Description</label>
                            <EditorHTML
                                value={form.watch("description")}
                                onChange={(value) => form.setValue("description", value)}
                                placeholder="Enter company description..."
                                className="w-full"
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

export default CompanyForm