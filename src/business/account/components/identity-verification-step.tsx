"use client"

import type React from "react"

import { useRef, useState } from "react"
import { Button } from "@/src/shared/ui/ui/button"
import { Camera, Upload, Check } from "lucide-react"
import { Card , CardContent, CardDescription, CardHeader, CardTitle} from "@/src/shared/ui/ui/card"
import FileUpload from "@/src/shared/ui/form/FileUpload"


interface IdentityVerificationStepProps {
  onNext: (data: any) => void
  onBack: () => void
  initialData?: any
  accountType: string
  isLastStep: boolean
}

export function IdentityVerificationStep({ onNext, onBack, initialData = {} }: IdentityVerificationStepProps) {
  const [facePhoto, setFacePhoto] = useState<string | null>(initialData.facePhoto || null)
  const [idFront, setIdFront] = useState<string | null>(initialData.idFront || null)
  const [idBack, setIdBack] = useState<string | null>(initialData.idBack || null)
  const [idVerified, setIdVerified] = useState(false)

  const faceRef = useRef<HTMLInputElement>(null)
  const frontRef = useRef<HTMLInputElement>(null)
  const backRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (file: File, setterFunction: (value: string) => void) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      setterFunction(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (value: string) => void) => {
    if (e.target.files?.[0]) {
      handleFileUpload(e.target.files[0], setter)
    }
  }

  const handleSubmit = () => {
    if (facePhoto && idFront && idBack) {
      onNext({
        facePhoto,
        idFront,
        idBack,
      })
    }
  }

  const canSubmit = facePhoto && idFront && idBack

  return (
    <Card className="w-full shadow-none bg-base-100 md:w-1/3 py-20 mx-auto border-2 border-border/50">
      <CardHeader>
        <CardTitle>Identity Verification</CardTitle>
        <CardDescription>Please upload your face photo and ID documents</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Face Photo */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Face ID</h3>
            <p className="text-xs text-muted-foreground mb-3">
              Position your face in the camera frame. Then show all angles of your face please.
            </p>
            <FileUpload
              accept="image/*"
              onFileChange={(file) => {
                if (!file) return setFacePhoto(null)
                const reader = new FileReader()
                reader.onloadend = () => setFacePhoto(reader.result as string)
                reader.readAsDataURL(file)
              }}
            />
            {facePhoto && <img src={facePhoto} alt="Face preview" className="mt-3 w-full h-40 object-cover rounded" />}
          </div>

          {/* ID Documents */}
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold mb-3">ID Information</h3>
              <p className="text-xs text-muted-foreground mb-3">
                Upload a valid and readable information (Passport/ Driving License/ Alternate ID)
              </p>
            </div>

            <FileUpload
              accept="image/*"
              onFileChange={(file) => {
                if (!file) return setIdFront(null)
                const reader = new FileReader()
                reader.onloadend = () => setIdFront(reader.result as string)
                reader.readAsDataURL(file)
              }}
            />
            {idFront && <img src={idFront} alt="ID front" className="mt-3 w-full h-28 object-cover rounded" />}

            <FileUpload
              accept="image/*"
              onFileChange={(file) => {
                if (!file) return setIdBack(null)
                const reader = new FileReader()
                reader.onloadend = () => setIdBack(reader.result as string)
                reader.readAsDataURL(file)
              }}
            />
            {idBack && <img src={idBack} alt="ID back" className="mt-3 w-full h-28 object-cover rounded" />}

            {idFront && idBack && (
              <div className="flex items-center gap-2 text-green-600 text-sm">
                <Check className="w-4 h-4" />
                <span>Verified</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 pt-6">
          <Button type="button" variant="outline" onClick={onBack} className="flex-1 bg-transparent">
            Back
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={!canSubmit} className="flex-1">
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
