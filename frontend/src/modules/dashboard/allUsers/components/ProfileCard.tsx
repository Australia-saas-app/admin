"use client"

import { Badge } from "@/src/components/ui/badge"
import { Button } from "@/src/components/ui/button"
import Image from "next/image"
import React from "react"

interface ProfileCardProps {
  userId: string
  fullName: string
  status: "ACTIVE" | "SUSPEND" | "DORMANT" | "CLOSED" | "BLOCK"
  joiningDate: string
  email: string
  nationality?: string
  dateOfBirth?: string
  nationalIdentity?: string
  phoneNumber?: string
  secondaryEmail?: string
  preferredCurrency?: string
  profileImage?: string
  idImage?: string
  onEdit?: () => void
  onDelete?: () => void
}

const statusVariant = (s: ProfileCardProps["status"]) => {
  switch (s) {
    case "ACTIVE":
      return "bg-green-100 text-green-700"
    case "SUSPEND":
      return "bg-pink-100 text-pink-700"
    case "DORMANT":
      return "bg-gray-200 text-gray-700"
    case "CLOSED":
      return "bg-yellow-100 text-yellow-800"
    case "BLOCK":
      return "bg-red-100 text-red-700"
    default:
      return ""
  }
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  userId,
  fullName,
  status,
  joiningDate,
  email,
  nationality,
  dateOfBirth,
  nationalIdentity,
  phoneNumber,
  secondaryEmail,
  preferredCurrency,
  profileImage,
  idImage,
}) => {


    const onEdit = () =>{
        console.log("hello")
    }
    const onDelete = () =>{
        console.log("delete")
    }

  return (
    <div className=" p-6">
        {/* Top Section - Info & Buttons */}
        <div className="flex justify-end gap-4 items-start mb-8">
            <Button variant="outline" onClick={onEdit}>
              Info
            </Button>
            <Button variant="outline" onClick={onDelete}>
              Status
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Save
            </Button>
        </div>

        {/* Profile Tabs */}
        <div className="flex gap-4 mb-6">
          <Button>
            Profile
          </Button>
          <Button variant={'outline'}>
            Account Delete
          </Button>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">

            <div className="flex gap-8 items-start mb-6">
              {/* Profile Image */}
              <div className="flex-shrink-0">
                <div className="w-24 h-24 bg-gray-300 rounded-full overflow-hidden border-2 border-gray-400">
                  {profileImage ? (
                    <Image width={96} height={96} src={profileImage} alt={fullName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                      {fullName.charAt(0)}
                    </div>
                  )}
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1">
                <div className="mb-2">
                  <p className="text-sm text-green-600 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                    {status}
                  </p>
                </div>
                <p className="text-gray-600 text-sm mb-4">Joining date: {joiningDate}</p>
                <p className="text-gray-600 text-sm mb-1">{email} (primary)</p>
                <div className="flex gap-3 mt-3">
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                    Verified Account
                  </span>
                  <button className="px-3 py-1 text-gray-700 underline text-sm hover:text-gray-900">
                    Edit
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* User Details Grid */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <label className="text-sm text-gray-600 font-medium">Full Name</label>
                <p className="text-gray-800">{fullName}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600 font-medium">Date of Birth</label>
                <p className="text-gray-800">{dateOfBirth || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600 font-medium">Phone Number</label>
                <p className="text-gray-800">{phoneNumber || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600 font-medium">Email Address</label>
                <p className="text-gray-800">{email}</p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div>
                <label className="text-sm text-gray-600 font-medium">Nationality</label>
                <p className="text-gray-800">{nationality || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600 font-medium">National Identity</label>
                <p className="text-gray-800">{nationalIdentity || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600 font-medium">Secondary Email</label>
                <p className="text-gray-800">{secondaryEmail || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600 font-medium">Preferred Currency</label>
                <p className="text-gray-800">{preferredCurrency || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* ID Document Section */}
          {idImage && (
            <div className="border-t pt-8">
              <h3 className="text-sm font-semibold text-gray-600 mb-4">Document</h3>
              <div className="flex gap-4">
                <div className="w-32 h-20 bg-gray-200 rounded border-2 border-gray-300 overflow-hidden">
                  <img src={idImage} alt="ID" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          )}
        </div>
     
    </div>
  )
}

export default ProfileCard
