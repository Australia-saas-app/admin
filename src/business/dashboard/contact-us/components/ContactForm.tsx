"use client"

import React from "react"
import { useForm } from "react-hook-form"
import { Form } from "@/src/shared/ui/form/form"
import { FormTextInput } from "@/src/shared/ui/form/form-text-input"
import { FormActions } from "@/src/shared/ui/form/FormActions"

type ContactFormData = {
    name: string
    email: string
    subject: string
    message: string
}

type Props = {
    onSubmit: (data: ContactFormData) => void
    onCancel?: () => void
    initial?: any
    isSubmitting?: boolean
}

const ContactForm: React.FC<Props> = ({ onSubmit, onCancel, initial = {}, isSubmitting = false }) => {
    const defaultValues: ContactFormData = {
        name: initial?.name ?? "",
        email: initial?.email ?? "",
        subject: initial?.subject ?? "",
        message: initial?.message ?? "",
    }

    const form = useForm<ContactFormData>({ defaultValues })
    const { handleSubmit, control } = form

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <FormTextInput control={control} name="name" placeholder="Full Name" />
                <FormTextInput control={control} name="email" placeholder="email@example.com" type="email" />
                <FormTextInput control={control} name="subject" placeholder="Inquiry Subject" />

                <div className="space-y-2">
                    <label className="text-sm font-medium">Message</label>
                    <textarea
                        {...control.register("message")}
                        className="w-full min-h-[100px] p-3 rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Message content..."
                    />
                </div>

                <FormActions onCancel={onCancel} isSubmitting={isSubmitting} />
            </form>
        </Form>
    )
}

export default ContactForm
