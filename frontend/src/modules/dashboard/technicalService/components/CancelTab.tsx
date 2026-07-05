"use client"

import { Form } from "@/src/components/form/form"
import { FormInput } from "@/src/components/form/form-input"
import { FormTextArea } from "@/src/components/form/form-textarea"
import { Button } from "@/src/components/ui/button"
import React from "react"
import { UseFormReturn } from "react-hook-form"

type CancelFormValues = {
  penaltyFee: string
  penaltyReason: string
}

interface CancelTabProps {
  form: UseFormReturn<CancelFormValues>
  onSubmit: () => void
}

export const CancelTab: React.FC<CancelTabProps> = ({ form, onSubmit }) => {
  return (
    <div className="flex justify-center items-center">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(() => onSubmit())} className="space-y-6 shadown border rounded-lg p-8 w-full md:w-2/3 mt-5">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">Penalty Fee</label>
            <div className="relative">
              <FormInput control={form.control} name="penaltyFee" placeholder="0" className="h-11 pr-10 border-gray-300" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">Penalty Reason</label>
            <FormTextArea control={form.control} name="penaltyReason" placeholder="Enter penalty reason" className="h-32 border-gray-300" />
          </div>

          <div className="flex justify-center gap-4 pt-4">
            <Button type="button" variant="outline" className="px-10 py-2 min-w-[120px]">Cancel</Button>
            <Button 
              type="submit"
              className="bg-red-500 hover:bg-red-600 text-white px-10 py-2 min-w-[120px]"
            >
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
