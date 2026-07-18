"use client"

import { Input } from "@/src/components/ui/input"
import { Button } from "@/src/components/ui/button"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import Select from "react-select"
import CreatableSelect from "react-select/creatable"
import { Form, FormField, FormItem, FormControl, FormLabel, FormMessage } from "@/src/components/form/form"
import { OnboardingStepFrame } from "./onboarding-step-frame"

const affiliateInfoSchema = z.object({
  brandName: z.string().min(2, "Brand name is required"),
  industryType: z.string().min(1, "Industry type is required"),
  marketingPlatform: z.string().min(1, "Marketing platform is required"),
  phoneNumber: z.string().min(10, "Phone number is required"),
  email: z.string().email("Invalid email address"),
  marketingUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  targetCountries: z.array(z.string()).min(1, "Select at least one country"),
  targetStates: z.array(z.string()).min(1, "Select at least one state"),
})

type AffiliateInfoFormValues = z.infer<typeof affiliateInfoSchema>

interface AffiliateInfoStepProps {
  onNext: (data: AffiliateInfoFormValues) => void
  onBack: () => void
  initialData?: any
  accountType: string
  isLastStep: boolean
}

const industryTypes = [
  { value: "ecommerce", label: "E-Commerce" },
  { value: "saas", label: "SaaS" },
  { value: "marketing", label: "Digital Marketing" },
  { value: "other", label: "Other" },
]

const marketingPlatforms = [
  { value: "website", label: "Website" },
  { value: "mobile", label: "Mobile App" },
  { value: "url", label: "Personal URL" },
]

const countries = [
  { value: "usa", label: "United States" },
  { value: "canada", label: "Canada" },
  { value: "uk", label: "United Kingdom" },
  { value: "australia", label: "Australia" },
]

const states = [
  { value: "ca", label: "California" },
  { value: "ny", label: "New York" },
  { value: "tx", label: "Texas" },
  { value: "fl", label: "Florida" },
]

export function AffiliateInfoStep({ onNext, onBack, initialData = {} }: AffiliateInfoStepProps) {
  const form = useForm<AffiliateInfoFormValues>({
    resolver: zodResolver(affiliateInfoSchema),
    defaultValues: {
      brandName: initialData.brandName || "",
      industryType: initialData.industryType || "",
      marketingPlatform: initialData.marketingPlatform || "",
      phoneNumber: initialData.phoneNumber || "",
      email: initialData.email || "",
      marketingUrl: initialData.marketingUrl || "",
      targetCountries: initialData.targetCountries || [],
      targetStates: initialData.targetStates || [],
    },
  })

  const onSubmit = (data: AffiliateInfoFormValues) => {
    onNext(data)
  }

  return (
    <OnboardingStepFrame
      title="Affiliate information"
      description="Tell us about your brand, marketing channels, and target regions."
    >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="brandName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your brand name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="industryType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Industry Type</FormLabel>
                    <FormControl>
                      <Select
                        options={industryTypes}
                        value={industryTypes.find((i) => i.value === field.value)}
                        onChange={(option) => field.onChange(option?.value)}
                        classNamePrefix="react-select"
                        className="react-select-container"
                        styles={{
                          control: (base) => ({
                            ...base,
                            borderColor: "hsl(var(--color-input))",
                            backgroundColor: "hsl(var(--color-background))",
                            minHeight: "40px",
                          }),
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="marketingPlatform"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marketing Platform</FormLabel>
                    <FormControl>
                      <Select
                        options={marketingPlatforms}
                        value={marketingPlatforms.find((m) => m.value === field.value)}
                        onChange={(option) => field.onChange(option?.value)}
                        classNamePrefix="react-select"
                        className="react-select-container"
                        styles={{
                          control: (base) => ({
                            ...base,
                            borderColor: "hsl(var(--color-input))",
                            backgroundColor: "hsl(var(--color-background))",
                            minHeight: "40px",
                          }),
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 (555) 000-0000" type="tel" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="your@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="marketingUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Marketing URL (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://www.yoursite.com/affiliate" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-4">Target Location</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="targetCountries"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <CreatableSelect
                          isMulti
                          options={countries}
                          value={field.value?.map((val) => ({
                            value: val,
                            label: countries.find((c) => c.value === val)?.label || val,
                          }))}
                          onChange={(options) => field.onChange(options ? options.map((o) => o.value) : [])}
                          classNamePrefix="react-select"
                          className="react-select-container"
                          styles={{
                            control: (base) => ({
                              ...base,
                              borderColor: "hsl(var(--color-input))",
                              backgroundColor: "hsl(var(--color-background))",
                            }),
                            multiValue: (base) => ({
                              ...base,
                              backgroundColor: "hsl(var(--color-primary))",
                            }),
                            multiValueLabel: (base) => ({
                              ...base,
                              color: "hsl(var(--color-primary-foreground))",
                            }),
                            multiValueRemove: (base) => ({
                              ...base,
                              color: "hsl(var(--color-primary-foreground))",
                              cursor: "pointer",
                            }),
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="targetStates"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <CreatableSelect
                          isMulti
                          options={states}
                          value={field.value?.map((val) => ({
                            value: val,
                            label: states.find((s) => s.value === val)?.label || val,
                          }))}
                          onChange={(options) => field.onChange(options ? options.map((o) => o.value) : [])}
                          classNamePrefix="react-select"
                          className="react-select-container"
                          styles={{
                            control: (base) => ({
                              ...base,
                              borderColor: "hsl(var(--color-input))",
                              backgroundColor: "hsl(var(--color-background))",
                            }),
                            multiValue: (base) => ({
                              ...base,
                              backgroundColor: "hsl(var(--color-primary))",
                            }),
                            multiValueLabel: (base) => ({
                              ...base,
                              color: "hsl(var(--color-primary-foreground))",
                            }),
                            multiValueRemove: (base) => ({
                              ...base,
                              color: "hsl(var(--color-primary-foreground))",
                              cursor: "pointer",
                            }),
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-6">
              <Button type="button" variant="outline" onClick={onBack} className="flex-1 bg-transparent">
                Back
              </Button>
              <Button type="submit" className="flex-1">
                Continue
              </Button>
            </div>
          </form>
        </Form>
    </OnboardingStepFrame>
  )
}
