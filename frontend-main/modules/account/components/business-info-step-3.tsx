"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/src/components/ui/button";
import { FormTextInput } from "@/src/components/form/form-text-input";
import { Form } from "@/src/components/form/form";
import { UploadFile } from "@/src/components/form/UploadFile";
import { OnboardingStepFrame } from "./onboarding-step-frame";

const schema = z.object({
  registrationNumber: z.string().optional(),
  registrationCertificate: z.any().optional(),
  taxId: z.any().optional(),
  taxCertificate: z.any().optional(),
  utilityBill: z.any().optional(),
  partnershipAgreement: z.any().optional(),
  description: z.string().min(10, "Provide a short description of services"),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  onNext: (data: Partial<FormValues>) => void;
  onBack: () => void;
  initialData?: any;
}

export function BusinessInfoStep3({ onNext, onBack, initialData = {} }: Props) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      registrationNumber: initialData.registrationNumber || "",
      registrationCertificate: initialData.registrationCertificate || "",
      taxId: initialData.taxId || "",
      taxCertificate: initialData.taxCertificate || "",
      utilityBill: initialData.utilityBill || "",
      partnershipAgreement: initialData.partnershipAgreement || "",
      description: initialData.description || "",
    } as any,
  });

  const onSubmit = (data: FormValues) => onNext(data);

  return (
    <OnboardingStepFrame
      title="Documents & services"
      description="Upload registration documents and describe the services your business offers."
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Business Registration Number</label>
            <FormTextInput
              control={form.control}
              name="registrationNumber"
              placeholder="Registration number"
            />
          </div>

          <div>
            <UploadFile
              control={form.control}
              name="registrationCertificate"
              label="Registration Certificate (PDF/Image)"
              accept="application/pdf,image/*"
              uploadImmediately={false}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Tax Identification Number</label>
            <FormTextInput control={form.control} name="taxId" placeholder="Tax ID" />
          </div>

          <div>
            <UploadFile
              control={form.control}
              name="taxCertificate"
              label="Tax/VAT Certificate"
              accept="application/pdf,image/*"
              uploadImmediately={false}
            />
          </div>

          <div>
            <UploadFile
              control={form.control}
              name="utilityBill"
              label="Utility Bill / Bank Statement"
              accept="application/pdf,image/*"
              uploadImmediately={false}
            />
          </div>

          <div>
            <UploadFile
              control={form.control}
              name="partnershipAgreement"
              label="Partnership Agreement (Optional)"
              accept="application/pdf,image/*"
              uploadImmediately={false}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Description of Services</label>
            <textarea
              {...form.register("description")}
              className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
              rows={4}
              placeholder="Describe your services, expertise, and delivery approach..."
            />
          </div>

          <div className="flex gap-3 pt-6">
            <Button type="button" variant="outline" onClick={onBack} className="flex-1">
              Back
            </Button>
            <Button type="submit" className="flex-1">
              Continue
            </Button>
          </div>
        </form>
      </Form>
    </OnboardingStepFrame>
  );
}
