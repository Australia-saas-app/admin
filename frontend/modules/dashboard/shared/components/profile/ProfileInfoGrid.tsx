"use client"

import type { ProfileField } from "@/src/shared/utils/profile-storage"

interface ProfileInfoGridProps {
  fields?: ProfileField[]
}

export default function ProfileInfoGrid({ fields }: ProfileInfoGridProps) {
  if (!fields?.length) return null

  return (
    <div className="grid grid-cols-1 gap-y-8 gap-x-12 p-6 pt-4 md:grid-cols-2 md:gap-x-16 md:p-8">
      {fields.map((field) => (
        <div key={field.label} className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-[#828b9c] md:text-sm">{field.label}</span>
          <span className="text-sm font-medium text-[#2f3d58] md:text-base">{field.value}</span>
        </div>
      ))}
    </div>
  )
}
