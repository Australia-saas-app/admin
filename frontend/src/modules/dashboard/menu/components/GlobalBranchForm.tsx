"use client"

import { Form } from "@/src/components/form/form"
import { FormTextInput } from "@/src/components/form/form-text-input"
import { FormActions } from "@/src/components/form/FormActions"
import { UploadFile } from "@/src/components/form/UploadFile"
import { Button } from "@/src/components/ui/button"
import { Facebook, Instagram, Linkedin, Trash2, Twitter, Youtube } from "lucide-react"
import React, { useState } from "react"
import { useForm } from "react-hook-form"

const SOCIAL_PLATFORMS = [
  { id: "facebook", label: "Facebook", icon: Facebook },
  { id: "twitter", label: "Twitter", icon: Twitter },
  { id: "instagram", label: "Instagram", icon: Instagram },
  { id: "linkedin", label: "LinkedIn", icon: Linkedin },
  { id: "youtube", label: "YouTube", icon: Youtube },
]

type FormData = {
  name: string
  call?: string
  email?: string
  officeAddress?: string
  photo?: File | string | null
}

type SocialLink = { platform: string; url: string }

type Props = {
  onSubmit: (data: FormData, flag?: File | null, socialLinks?: SocialLink[]) => void
  onCancel?: () => void
  initial?: Partial<FormData & { socialLinks?: SocialLink[] }>
}

const GlobalBranchForm: React.FC<Props> = ({ onSubmit, onCancel, initial = {} }) => {
  const initialTyped = initial as Partial<FormData & { socialLinks?: SocialLink[] }>
  const form = useForm<FormData>(
    { defaultValues: 
      { name: "", call: "", email: "", officeAddress: "", photo: null, ...initialTyped } }
  )
  const { handleSubmit, reset, getValues } = form
  const [tempPlatform, setTempPlatform] = useState("")
  const [tempUrl, setTempUrl] = useState("")
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(initialTyped?.socialLinks ?? [])

  const submit = handleSubmit((vals) => {
    const photoVal = getValues("photo")
    const photoFile = photoVal instanceof File ? photoVal : null
    onSubmit(vals, photoFile, socialLinks)
    reset()
    setSocialLinks([])
    setTempPlatform("")
    setTempUrl("")
  })

  const addSocial = () => {
    if (!tempPlatform || !tempUrl.trim()) return
    const nextLink: SocialLink = { platform: tempPlatform, url: tempUrl.trim() }
    setSocialLinks((s) => [...s, nextLink])
    setTempPlatform("")
    setTempUrl("")
  }

  const removeSocial = (i: number) => setSocialLinks((s) => s.filter((_, idx) => idx !== i))

  return (
     <Form {...form}>
      <form onSubmit={submit} className="space-y-4">
      <div>
        <div>
          <UploadFile control={form.control} name="photo" label="Photo" accept="image/*" uploadImmediately={false} />
        </div>
      </div>

      <div>
        <FormTextInput control={form.control} name="name" placeholder="Branch name" />
      </div>

      <div>
        <FormTextInput control={form.control} name="call" placeholder="Phone" />
      </div>

      <div>
        <FormTextInput control={form.control} name="email" placeholder="Email" />
      </div>

      <div>
        <FormTextInput control={form.control} name="officeAddress" placeholder="Address" />
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

      <div className="flex justify-end ">
        <FormActions onCancel={onCancel} submitLabel="Save" />
      </div>
    </form>
     </Form>
  )
}

export default GlobalBranchForm
