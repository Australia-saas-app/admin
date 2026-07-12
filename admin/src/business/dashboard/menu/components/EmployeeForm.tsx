"use client"

import { Form } from "@/src/shared/ui/form/form"
import { FormCheckbox } from "@/src/shared/ui/form/form-checkbox"
import { FormTextInput } from "@/src/shared/ui/form/form-text-input"
import { FormActions } from "@/src/shared/ui/form/FormActions"
import { UploadFile } from "@/src/shared/ui/form/UploadFile"
import { Button } from "@/src/shared/ui/ui/button"
import type { Employee } from "@/src/business/dashboard/menu/types/employee"
import { Facebook, Instagram, Linkedin, Trash2, Twitter, Youtube } from "lucide-react"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
type SocialLink = { platform: string; url: string }

interface EmployeeCreatePayload {
  name: string
  title?: string
  officeAddress?: string
  socialLinks?: SocialLink[]
  file?: File | null
  active?: boolean
}

interface EmployeeFormProps {
  initial?: Partial<Employee>
  onCancel?: () => void
  onSubmit: (data: EmployeeCreatePayload) => void
}

const SOCIAL_PLATFORMS = [
  { id: "facebook", label: "Facebook", icon: Facebook },
  { id: "twitter", label: "Twitter", icon: Twitter },
  { id: "instagram", label: "Instagram", icon: Instagram },
  { id: "linkedin", label: "LinkedIn", icon: Linkedin },
  { id: "youtube", label: "YouTube", icon: Youtube },
]

export const EmployeeForm: React.FC<EmployeeFormProps> = ({ initial = {}, onCancel, onSubmit }) => {
  type FormValues = {
    name: string
    title?: string
    officeAddress?: string
    file?: File | string | null
    active: boolean
  }

  const defaultValues: FormValues = {
    name: initial.name ?? "",
    title: initial.title ?? "",
    officeAddress: initial.officeAddress ?? "",
    file: null,
    active: initial.active ?? true,
  }

  const form = useForm<FormValues>({ defaultValues })
  const { control, handleSubmit, reset, watch } = form

  const [tempPlatform, setTempPlatform] = useState(initial.socialLinks?.[0]?.platform ?? "")
  const [tempUrl, setTempUrl] = useState("")
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(initial.socialLinks ?? [])

  const fileVal = watch("file")
  const [previewUrl, setPreviewUrl] = useState<string | null>(initial.photoUrl ?? null)

  useEffect(() => {
    if (!fileVal) {
      setPreviewUrl(initial.photoUrl ?? null)
      return
    }
    if (fileVal instanceof File) {
      const url = URL.createObjectURL(fileVal)
      setPreviewUrl(url)
      return () => URL.revokeObjectURL(url)
    }
    if (typeof fileVal === "string") setPreviewUrl(fileVal)
  }, [fileVal, initial.photoUrl])

  const onFormSubmit = (vals: FormValues) => {
    const fv = vals.file instanceof File ? vals.file : null
    onSubmit({ name: vals.name, title: vals.title, officeAddress: vals.officeAddress, socialLinks, file: fv, active: vals.active })
    reset(defaultValues)
    setPreviewUrl(null)
    setSocialLinks([])
    setTempPlatform("")
    setTempUrl("")
  }

  const addSocial = () => {
    if (!tempPlatform || !tempUrl.trim()) return
    setSocialLinks((prev) => [...prev, { platform: tempPlatform, url: tempUrl.trim() }])
    setTempPlatform("")
    setTempUrl("")
  }

  const removeSocial = (idx: number) => {
    setSocialLinks((prev) => prev.filter((_, i) => i !== idx))
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <div >
          <UploadFile control={control} name="file" label="" accept="image/*" uploadImmediately={false} />
          {previewUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={previewUrl} alt="preview" className="w-28 h-28 object-cover rounded mt-2" />
          )}
        </div>

        <div>
          <FormTextInput control={control} name="name" placeholder="Full name" />

        </div>

        <div>
          <FormTextInput control={control} name="title" placeholder="Title" />
        </div>

        <div>

        </div>

        <div className="flex items-center gap-3">
          <FormCheckbox control={control} name="active" label="Active" />
        </div>

      <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-800">Social Links</h3>
          <div className="flex flex-col sm:flex-row gap-1">
            <select
              value={tempPlatform}
              onChange={(e) => setTempPlatform(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
            >
              <option value="">Select</option>
              {SOCIAL_PLATFORMS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>

            <input
              type="url"
              value={tempUrl}
              onChange={(e) => setTempUrl(e.target.value)}
              placeholder="URL"
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <Button
              type="button"
              onClick={addSocial}
            >
              Add
            </Button>
          </div>

          {socialLinks.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-3">
              {socialLinks.map((link, idx) => {
                const platform = SOCIAL_PLATFORMS.find((p) => p.id === link.platform)
                const IconComponent = platform?.icon
                return (
                  <div
                    key={`${link.platform}-${idx}`}
                    className="flex items-center gap-2 bg-white/80 rounded-full px-3 py-2 shadow-sm border border-gray-200"
                  >
                    {IconComponent && <IconComponent className="w-4 h-4 text-orange-500" />}
                   
                    <button
                      type="button"
                      onClick={() => removeSocial(idx)}
                      className="ml-1 text-red-500 hover:text-red-700 cursor-pointer"
                      aria-label="Remove social link"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <FormActions onCancel={onCancel} submitLabel={initial ? "Update" : "Save"} />
        </div>
      </form>
    </Form>
  )
}

export default EmployeeForm
