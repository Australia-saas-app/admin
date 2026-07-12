"use client"

import { Form } from "@/src/shared/ui/form/form"
import { FormInput } from "@/src/shared/ui/form/form-input"
import { FormTextArea } from "@/src/shared/ui/form/form-textarea"
import { Button } from "@/src/shared/ui/ui/button"
import React from "react"
import { UseFormReturn } from "react-hook-form"

type RefundFormValues = {
  penaltyFee: string
  penaltyReason: string
}

interface RefundTabProps {
  form: UseFormReturn<RefundFormValues>
  onSubmit: () => void
}

export const RefundTab: React.FC<RefundTabProps> = ({ form, onSubmit }) => {
  return (
    <div className="flex justify-center items-center">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(() => onSubmit())} className="space-y-6 shadown border rounded-lg p-8 w-full md:w-2/3 mt-5">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">Refund Amount</label>
            <div className="relative">
              <FormInput control={form.control} name="penaltyFee" placeholder="0"  />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">Reasons</label>
            <FormTextArea control={form.control} name="penaltyReason" placeholder="Enter refund reason" className="h-32 bg-white" />
          </div>

          <div className="flex justify-center gap-4 pt-4">
            <Button type="button" variant="outline" className="px-10 py-2 min-w-[120px]">Cancel</Button>
            <Button 
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-2 min-w-[120px]"
            >
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
