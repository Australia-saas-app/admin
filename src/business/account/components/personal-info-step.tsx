"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/src/shared/ui/ui/button"
import { Card, CardContent } from "@/src/shared/ui/ui/card"
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/ui/ui/form"
import { RadioGroup, RadioGroupItem } from "@/src/shared/ui/ui/radio-group"
import { FormTextInput } from "@/src/shared/ui/form/form-text-input"
import { FormSelect } from "@/src/shared/ui/form/form-select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/src/shared/ui/form/form"


const personalInfoSchema = z.object({
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

type PersonalInfoFormValues = z.infer<typeof personalInfoSchema>

interface PersonalInfoStepProps {
  onNext: (data: PersonalInfoFormValues) => void
  onBack: () => void
  initialData?: any
  accountType: string
  isLastStep: boolean
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

export function PersonalInfoStep({ onNext, onBack, initialData = {}, accountType, isLastStep }: PersonalInfoStepProps) {
  const form = useForm<PersonalInfoFormValues>({
    resolver: zodResolver(personalInfoSchema),
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
    <Card className="w-full shadow-none bg-base-100 md:w-1/3 py-20 mx-auto border-2 border-border/50">
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium">{accountType === "business" ? "Business Owner Full Name" : "Owner Full Name"}</label>
                <FormTextInput control={form.control} name="fullName" placeholder="Full name" />
              </div>

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <FormControl>
                      <RadioGroup value={field.value} onValueChange={field.onChange}>
                        <div className="flex gap-4">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="male" id="male" />
                            <label htmlFor="male" className="text-sm cursor-pointer">
                              Male
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="female" id="female" />
                            <label htmlFor="female" className="text-sm cursor-pointer">
                              Female
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="other" id="other" />
                            <label htmlFor="other" className="text-sm cursor-pointer">
                              Other
                            </label>
                          </div>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium">Date of Birth</label>
                <FormTextInput control={form.control} name="dateOfBirth" type="date" placeholder="" />
              </div>

              <FormField
                control={form.control}
                name="nationality"
                render={({ field }) => (
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
              <FormField
                control={form.control}
                name="nationalIdentity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>National Identity</FormLabel>
                    <FormControl>
                      <RadioGroup value={field.value} onValueChange={field.onChange}>
                        <div className="flex gap-4 flex-wrap">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="nationalId" id="nationalId" />
                            <label htmlFor="nationalId" className="text-sm cursor-pointer">
                              National ID
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="passport" id="passport" />
                            <label htmlFor="passport" className="text-sm cursor-pointer">
                              Passport
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="driverLicense" id="driverLicense" />
                            <label htmlFor="driverLicense" className="text-sm cursor-pointer">
                              Driver License
                            </label>
                          </div>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="passportNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Passport Number</FormLabel>
                    <FormControl>
                      <FormTextInput control={form.control} name="passportNumber" placeholder="Enter passport number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-4">Permanent Address</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormSelect control={form.control} name="country" placeholder="Select country" options={countries} />

                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <FormTextInput control={form.control} name="state" placeholder="State" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <FormTextInput control={form.control} name="city" placeholder="City" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Zip/Postal Code</FormLabel>
                      <FormControl>
                        <FormTextInput control={form.control} name="zipCode" placeholder="12345" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="mt-6">
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <FormTextInput control={form.control} name="address" placeholder="Street address" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-3 pt-6">
              <Button type="button" variant="outline" onClick={onBack} className="flex-1 bg-transparent">
                Back
              </Button>
              <Button type="submit" className="flex-1">
                Next
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

