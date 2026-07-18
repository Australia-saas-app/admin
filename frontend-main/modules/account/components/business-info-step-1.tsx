"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/src/components/ui/button"
import { FormTextInput } from "@/src/components/form/form-text-input"
import { FormSelect } from "@/src/components/form/form-select"
import { Form } from "@/src/components/form/form"
import { UploadFile } from "@/src/components/form/UploadFile"
import { FormMultiSelect } from "@/src/components/form/form-multiselect"
import { OnboardingStepFrame } from "./onboarding-step-frame"

const schema = z.object({
  businessType: z.string().min(1, "Business type is required"),
  businessName: z.string().min(2, "Business name is required"),
  logo: z.any().optional(),
  categories: z.array(z.string()).min(1, "Select at least one category"),
  subcategories: z.array(z.string()).optional(),
  requiredSkills: z.array(z.string()).optional(),
})

type FormValues = z.infer<typeof schema>

interface Props {
  onNext: (data: Partial<FormValues>) => void
  onBack: () => void
  initialData?: any
}

export function BusinessInfoStep1({ onNext, onBack, initialData = {} }: Props) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      businessType: initialData.businessType || "Technology",
      businessName: initialData.businessName || "",
      logo: initialData.logo || "",
      categories: initialData.categories || [],
      subcategories: initialData.subcategories || [],
      requiredSkills: initialData.requiredSkills || [],
    } as any,
  })

  const onSubmit = (data: FormValues) => onNext(data)

  const categoryOptions = [
    { value: "Technology", label: "Technology" },
    { value: "SaaS", label: "SaaS" },
    { value: "Marketing", label: "Marketing" },
    { value: "Finance", label: "Finance" },
    { value: "Healthcare", label: "Healthcare" },
  ]

  const subcategoryOptions = [
    { value: "Web Development", label: "Web Development" },
    { value: "Mobile App", label: "Mobile App" },
    { value: "UI/UX", label: "UI/UX" },
    { value: "Data Science", label: "Data Science" },
  ]

  const skillOptions = [
    { value: "React", label: "React" },
    { value: "Node", label: "Node.js" },
    { value: "Python", label: "Python" },
    { value: "Design", label: "Design" },
  ]

  return (
    <OnboardingStepFrame
      title="Business details"
      description="Enter your company name, type, logo, and service categories."
    >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Business Type</label>
              <FormSelect control={form.control as any} name="businessType" placeholder="Select type" options={[
                { value: "Technology", label: "Technology" },
                { value: "Construction", label: "Construction" },
                { value: "Real Estate", label: "Real Estate" },
                { value: "Commercial & Industrial", label: "Commercial & Industrial" },
                { value: "Visa & Travel", label: "Visa & Travel" },
                { value: "Education", label: "Education" },
                { value: "Careers", label: "Careers" },
                { value: "Healthcare", label: "Healthcare" },
                { value: "Marketplace", label: "Marketplace" },
                { value: "Business", label: "Business" },
                { value: "Investment", label: "Investment" },
                { value: "Donations", label: "Donations" },
              ]} />
            </div>

            <div>
              <label className="text-sm font-medium">Business Name</label>
              <FormTextInput control={form.control as any} name="businessName" placeholder="Business name" />
            </div>

            <div>
              <UploadFile control={form.control as any} name="logo" label="Upload Logo (50–150px; PNG/SVG)" accept="image/*" uploadImmediately={false} />
            </div>

            <div>
              <label className="text-sm font-medium">Categories</label>
              <FormMultiSelect control={form.control as any} name="categories" options={categoryOptions} placeholder="Select categories" />
            </div>

            <div>
              <label className="text-sm font-medium">Subcategories</label>
              <FormMultiSelect control={form.control as any} name="subcategories" options={subcategoryOptions} placeholder="Select subcategories" />
            </div>

            <div>
              <label className="text-sm font-medium">Required Skills</label>
              <FormMultiSelect control={form.control as any} name="requiredSkills" options={skillOptions} placeholder="Select skills" />
            </div>

            <div className="flex gap-3 pt-6">
              <Button type="button" variant="outline" onClick={onBack} className="flex-1">Back</Button>
              <Button type="submit" className="flex-1">Continue</Button>
            </div>
          </form>
        </Form>
    </OnboardingStepFrame>
  )
}
