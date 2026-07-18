"use client"
import { useForm, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/src/components/ui/button"
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { FormRadioGroup } from "@/src/components/form/form-radio-group"
import { FormTextInput } from "@/src/components/form/form-text-input"
import { FormSelect } from "@/src/components/form/form-select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/src/components/form/form"
import { FormRow } from "@/src/components/form/form-row"
import { OnboardingStepFrame } from "./onboarding-step-frame"


// Two variants of the personal info schema: one where `fullName` is required (user),
// and one where `fullName` is optional (affiliate/business).
const userPersonalInfoSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["male", "female", "other"]),
  nationality: z.string().min(1, "Nationality is required"),
  nationalIdentity: z.enum(["nationalId", "passport", "driverLicense"]),
  passportNumber: z.string().optional(),
  country: z.string().min(1, "Country is required"),
  state: z.string().min(1, "State is required"),
  city: z.string().min(1, "City is required"),
  zipCode: z.string().min(1, "Zip code is required"),
  address: z.string().min(5, "Address is required"),
})

const otherPersonalInfoSchema = z.object({
  // fullName left optional for affiliate/business
  fullName: z.string().optional(),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["male", "female", "other"]),
  nationality: z.string().min(1, "Nationality is required"),
  nationalIdentity: z.enum(["nationalId", "passport", "driverLicense"]),
  passportNumber: z.string().optional(),
  country: z.string().min(1, "Country is required"),
  state: z.string().min(1, "State is required"),
  city: z.string().min(1, "City is required"),
  zipCode: z.string().min(1, "Zip code is required"),
  address: z.string().min(5, "Address is required"),
})

type PersonalInfoFormValues = z.infer<typeof userPersonalInfoSchema> | z.infer<typeof otherPersonalInfoSchema>

interface PersonalInfoStepProps {
  onNext: (data: PersonalInfoFormValues) => void
  onBack: () => void
  initialData?: any
  accountType: string
  isLastStep: boolean
  showBack?: boolean
}

const countries = [
  { value: "usa", label: "United States" },
  { value: "canada", label: "Canada" },
  { value: "uk", label: "United Kingdom" },
  { value: "australia", label: "Australia" },
]

const nationalities = [
  { value: "us", label: "American" },
  { value: "ca", label: "Canadian" },
  { value: "uk", label: "British" },
  { value: "au", label: "Australian" },
]

export function PersonalInfoStep({ onNext, onBack, initialData = {}, accountType, showBack = true }: PersonalInfoStepProps) {
  const schema = accountType === "user" ? userPersonalInfoSchema : otherPersonalInfoSchema

  const form = useForm<PersonalInfoFormValues>({
    // cast resolver to avoid TS incompatibilities
    resolver: zodResolver(schema) as unknown as Resolver<PersonalInfoFormValues>,
    defaultValues: {
      fullName: initialData.fullName || "",
      dateOfBirth: initialData.dateOfBirth || "",
      gender: initialData.gender || "male",
      nationality: initialData.nationality || "",
      nationalIdentity: initialData.nationalIdentity || "nationalId",
      passportNumber: initialData.passportNumber || "",
      country: initialData.country || "",
      state: initialData.state || "",
      city: initialData.city || "",
      zipCode: initialData.zipCode || "",
      address: initialData.address || "",
    },
  })

  const onSubmit = (data: PersonalInfoFormValues) => {
    onNext(data)
  }

  return (
    <OnboardingStepFrame
      title="Personal information"
      description="Provide your personal details and permanent address."
    >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormRow label={accountType === "business" ? "Business Owner Full Name" : "Owner Full Name"}>
                <FormTextInput control={form.control} name="fullName" placeholder="Full name" />
              </FormRow>

              <FormRadioGroup
                control={form.control}
                name="gender"
                label="Gender"
                options={[
                  { value: "male", label: "Male" },
                  { value: "female", label: "Female" },
                  { value: "other", label: "Other" },
                ]}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormRow label="Date of Birth">
                <FormTextInput control={form.control} name="dateOfBirth" type="date" placeholder="" />
              </FormRow>

              <FormField
                control={form.control}
                name="nationality"
                render={() => (
                  <FormItem>
                    <FormLabel>Nationality</FormLabel>
                    <FormControl>
                      <FormSelect control={form.control} name="nationality" placeholder="Select nationality" options={nationalities} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormRadioGroup
                control={form.control}
                name="nationalIdentity"
                label="National Identity"
                options={[
                  { value: "nationalId", label: "National ID" },
                  { value: "passport", label: "Passport" },
                  { value: "driverLicense", label: "Driver License" },
                ]}
              />

                <div>
                  <label className="text-sm font-medium">Passport Number</label>
                  <FormTextInput control={form.control} name="passportNumber" placeholder="Enter passport number" />
                </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-4">Permanent Address</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormSelect control={form.control} name="country" placeholder="Select country" options={countries} />

                <div>
                  <label className="text-sm font-medium">State</label>
                  <FormTextInput control={form.control} name="state" placeholder="State" />
                </div>


                <div>
                  <label className="text-sm font-medium">City</label>
                  <FormTextInput control={form.control} name="city" placeholder="City" />
                </div>
                <div>
                  <label className="text-sm font-medium">Zip/Postal Code</label>
                  <FormTextInput control={form.control} name="zipCode" placeholder="Zip/Postal Code" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Address</label>
                <FormTextInput control={form.control} name="address" placeholder="Street address" />
              </div>
            </div>


            <div className="flex gap-3 pt-2">
              {showBack && (
                <Button type="button" variant="outline" onClick={onBack} className="flex-1 bg-transparent">
                  Back
                </Button>
              )}
              <Button type="submit" className={showBack ? "flex-1" : "w-full"}>
                Continue
              </Button>
            </div>
          </form>
        </Form>
    </OnboardingStepFrame>
  )
}
