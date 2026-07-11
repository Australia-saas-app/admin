"use client"

import { Form } from "@/src/shared/ui/form/form"
import { FormActions } from "@/src/shared/ui/form/FormActions"
import { FormTextInput } from "@/src/shared/ui/form/form-text-input"
import React, { useEffect } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { FormCheckbox } from "@/src/shared/ui/form/form-checkbox"
import { Button } from "@/src/shared/ui/ui/button"

type BranchFormData = {
    branchName: string
    countryFlag: string
    address: string
    phone: string
    email: string
    workingHours: string
    workingDaysText: string
    servicesText: string
    socialLinks: { name: string; url: string }[]
    isVisible: boolean
}

type Props = {
    onSubmit: (data: any) => void
    onCancel?: () => void
    initial?: any
    isSubmitting?: boolean
}

const BranchForm: React.FC<Props> = ({ onSubmit, onCancel, initial, isSubmitting = false }) => {
    const defaultValues: BranchFormData = {
        branchName: initial?.branchName || "",
        countryFlag: initial?.countryFlag || "",
        address: initial?.address || "",
        phone: initial?.phone || "",
        email: initial?.email || initial?.emailAddress || "",
        workingHours: initial?.workingHours || "",
        workingDaysText: Array.isArray(initial?.workingDays) ? initial.workingDays.join(", ") : "",
        servicesText: Array.isArray(initial?.services) ? initial.services.join(", ") : "",
        socialLinks:
            Array.isArray(initial?.socialLinks) && initial.socialLinks.length > 0
                ? initial.socialLinks
                : [{ name: "", url: "" }],
        isVisible: initial?.isVisible ?? true,
    }

    const form = useForm<BranchFormData>({ defaultValues })
    const { handleSubmit, control, reset, register } = form

    const { fields, append, remove } = useFieldArray({
        control,
        name: "socialLinks",
    })

    useEffect(() => {
        if (initial && Object.keys(initial).length > 0) {
            reset(defaultValues)
        }
    }, [initial, reset])

    const handleFormSubmit = (data: BranchFormData) => {
        const payload = {
            branchName: data.branchName,
            countryFlag: data.countryFlag,
            address: data.address,
            phone: data.phone,
            email: data.email,
            workingHours: data.workingHours,
            workingDays: data.workingDaysText
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean),
            services: data.servicesText
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean),
            socialLinks: (data.socialLinks || [])
                .map((s) => ({ name: (s?.name || "").trim(), url: (s?.url || "").trim() }))
                .filter((s) => s.name && s.url),
            isVisible: String(data.isVisible), // API expects "true"/"false"
        }

        onSubmit(payload)
    }

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                <div>
                    <label className="text-sm font-medium mb-1 block">Branch Name</label>
                    <FormTextInput control={control} name="branchName" placeholder="Branch Name" />
                </div>
                <div>
                    <label className="text-sm font-medium mb-1 block">Country Flag</label>
                    <FormTextInput control={control} name="countryFlag" placeholder="Country Flag (e.g. US)" />
                </div>
                <div>
                    <label className="text-sm font-medium mb-1 block">Address</label>
                    <FormTextInput control={control} name="address" placeholder="Address" />
                </div>
                <div>
                    <label className="text-sm font-medium mb-1 block">Phone</label>
                    <FormTextInput control={control} name="phone" placeholder="+1-555-123-4567" />
                </div>
                <div>
                    <label className="text-sm font-medium mb-1 block">Email</label>
                    <FormTextInput control={control} name="email" placeholder="mainoffice@example.com" type="email" />
                </div>
                <div>
                    <label className="text-sm font-medium mb-1 block">Working Hours</label>
                    <FormTextInput control={control} name="workingHours" placeholder="9:00 AM - 6:00 PM" />
                </div>

                <div>
                        <label className="text-sm font-medium mb-1 block">Working Days</label>
                    <FormTextInput
                    control={control}
                    name="workingDaysText"
                    placeholder="Monday, Tuesday, Wednesday, Thursday, Friday"
                />
                </div>

                <div>
                    <label className="text-sm font-medium mb-1 block">Services</label>
                    <FormTextInput
                        control={control}
                        name="servicesText"
                        placeholder="Consulting, Sales, Support"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Social Links</label>
                    {fields.map((field, index) => (
                        <div key={field.id} className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <input
                                {...register(`socialLinks.${index}.name`)}
                                placeholder="Platform (facebook, twitter)"
                                className="border rounded px-3 py-2 text-sm"
                            />
                            <div className="flex gap-2">
                                <input
                                    {...register(`socialLinks.${index}.url`)}
                                    placeholder="https://..."
                                    className="border rounded px-3 py-2 text-sm w-full"
                                />
                                <Button type="button" variant="outline" onClick={() => remove(index)}>
                                    Remove
                                </Button>
                            </div>
                        </div>
                    ))}
                    <Button type="button" variant="outline" onClick={() => append({ name: "", url: "" })}>
                        Add Social Link
                    </Button>
                </div>

                <div className="flex items-center justify-between">
                    <FormCheckbox control={control} name="isVisible" label="Is Visible" />
                </div>

                <FormActions onCancel={onCancel} isSubmitting={isSubmitting} />
            </form>
        </Form>
    )
}

export default BranchForm