"use client"

import { Form } from "@/src/shared/ui/form/form"
import { FormActions } from "@/src/shared/ui/form/FormActions"
import { FormTextInput } from "@/src/shared/ui/form/form-text-input"
import { UploadFile } from "@/src/shared/ui/form/UploadFile"
import React from "react"
import { useForm } from "react-hook-form"
import EditorHTML from "@/src/shared/ui/form/EditorHTML"
import { FormCheckbox } from "@/src/shared/ui/form/form-checkbox"

type TeamFormData = {
    firstName: string
    lastName: string
    position: string
    department: string
    bio?: string
    photoUrl?: string | null
    email: string
    linkedinUrl?: string
    isVisible: boolean
}

type Props = {
    onSubmit: (data: any) => void
    onCancel?: () => void
    initial?: any
    isSubmitting?: boolean
    initialData?: any
}


const TeamForm: React.FC<Props> = ({ initial = {}, onCancel, onSubmit }) => {
    

    const form = useForm<TeamFormData>({
        defaultValues: {
            firstName: initial?.firstName ?? "",
            lastName: initial?.lastName ?? "",
            position: initial?.position ?? "",
            department: initial?.department ?? "",
            bio: initial?.bio ?? "",
            photoUrl: initial?.photoUrl ?? null,
            email: initial?.employeeId ?? "",
            linkedinUrl: initial?.linkedinUrl ?? "",
            isVisible: initial?.isVisible ?? true,
        }
    })

    const { control, handleSubmit, } = form

    return (
        <Form {...form}>
           
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1gap-4">

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium mb-1 block">First Name</label>
                            <FormTextInput control={control} name="firstName" placeholder="First Name" />
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-1 block">Last Name</label>
                            <FormTextInput control={control} name="lastName" placeholder="Last Name" />
                        </div>
                    </div>

                    <div>
                        <UploadFile
                            control={control}
                            name="photoUrl"
                            label="Profile Photo"
                            uploadImmediately={false}
                        />
                    </div>
                </div>

                <div>
                    <label className="text-sm font-medium mb-1 block">Position</label>
                    <FormTextInput control={control} name="position" placeholder="CEO" />
                </div>
                <div>
                    <label className="text-sm font-medium mb-1 block">Email</label>
                    <FormTextInput control={control} name="email" placeholder="email@example.com" type="email" />
                </div>

                    <div>
                    <label className="text-sm font-medium mb-1 block">Department</label>
                    <FormTextInput control={control} name="department" placeholder="Department" />
                </div>

                <div>
                    <label className="text-sm font-medium mb-1 block">LinkedIn Profile</label>
                    <FormTextInput control={control} name="linkedinUrl" placeholder="https://linkedin.com/..." />
                </div>



                <div>
                    <label className="text-sm font-medium mb-1 block">Bio</label>
                    <EditorHTML
                        value={form.watch("bio")!}
                        onChange={(value) => form.setValue("bio", value)}
                        placeholder="Enter team member bio..."
                        className="w-full"
                    />

                </div>

                <div className="flex items-center justify-between">
                    <FormCheckbox control={control} name="isVisible" label="Is Visible" />
                </div>

                <FormActions onCancel={onCancel} submitLabel={initial?.id ? "Update" : "Save"} />
            </form>
        </Form>
    )
}

export default TeamForm
