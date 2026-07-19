"use client"

import { useRef, useState } from "react"
import { CheckCircle } from "lucide-react"
import { toast } from "sonner"
import ProfileInfoGrid from "../../shared/components/profile/ProfileInfoGrid"
import DocumentCards, { DocumentUploadButton } from "../../shared/components/profile/DocumentCards"
import ProfileEditModal from "../../shared/components/profile/ProfileEditModal"
import { addProfileDocument } from "@/src/shared/utils/profile-storage"
import { useProfileDisplay } from "../../shared/hooks/use-profile-display"

export default function ProfilePageLayout() {
  const { userId, accountLabel, email, joiningDate, avatarUrl, fields, updateProfile } = useProfileDisplay()
  const [editOpen, setEditOpen] = useState(false)
  const uploadRef = useRef<HTMLInputElement>(null)

  return (
    <div className="w-full">
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col items-start justify-between gap-4 border-b border-gray-100 p-6 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 overflow-hidden rounded-full border border-gray-200">
              <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
            </div>
            <div>
              <div className="mb-1 flex items-center gap-3">
                <h2 className="text-2xl font-bold text-[#2f3d58]">{accountLabel}</h2>
                <span className="flex items-center gap-1 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  Active
                </span>
              </div>
              <p className="text-sm text-gray-500">Joining date — {joiningDate}</p>
              <p className="text-sm text-gray-500">{email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 rounded bg-green-50 px-4 py-2 text-sm font-medium text-green-600">
              <CheckCircle className="h-4 w-4" />
              Verified Account
            </span>
            <button
              type="button"
              onClick={() => setEditOpen(true)}
              className="rounded border border-gray-300 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Edit
            </button>
            <input
              ref={uploadRef}
              type="file"
              className="hidden"
              accept="image/*,application/pdf"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (!file) return
                addProfileDocument(userId, {
                  id: `doc-${Date.now()}`,
                  type: "UPLOADED",
                  name: file.name,
                  sizeLabel: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
                  uploadedAt: new Date().toLocaleDateString(),
                })
                toast.success(`${file.name} uploaded successfully.`)
                e.target.value = ""
              }}
            />
            <DocumentUploadButton onClick={() => uploadRef.current?.click()} />
          </div>
        </div>
        <ProfileInfoGrid fields={fields} />
        <DocumentCards userId={userId} />
      </div>

      <ProfileEditModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        scope="limited"
        initialLabel={accountLabel}
        initialEmail={email}
        onSave={(nextLabel, nextEmail) => {
          updateProfile({ accountLabel: nextLabel, email: nextEmail, fullName: nextLabel })
          toast.success("Profile updated successfully.")
        }}
      />
    </div>
  )
}
