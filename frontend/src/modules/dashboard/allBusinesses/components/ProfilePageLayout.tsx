"use client"

import { useState } from 'react'
import { BuesinessProfileTab } from './BuesinessProfileTab'
import { BusinessLogTab } from './BusinessLogTab'
import { BusinessDeleteTab } from './BusinessDeleteTab'


interface ProfilePageLayoutProps {
  affiliateId?: string
  fullName?: string
  status?: "ACTIVE" | "SUSPEND" | "DORMANT" | "CLOSED" | "BLOCK"
  joiningDate?: string
  currentLevel?: string
  rank?: string
  progress?: string
  nationality?: string
  dateOfBirth?: string
  nationalIdentity?: string
  phoneNumber?: string
  email?: string
  secondaryEmail?: string
  preferredCurrency?: string
  profileImage?: string
  scanFaceImage?: string
  passportImage?: string
  isVerified?: boolean
}

function ProfilePageLayout({
  affiliateId = "10001",
  fullName = "Mr jack",
  status = "ACTIVE",
  joiningDate = "2025/07/29 10:15:30 (EST)",
  currentLevel = "Level - 2",
  rank = "T265",
  progress = "45.71%",
  nationality = "Japan",
  dateOfBirth = "02 Jun 2003",
  nationalIdentity = "4464649464495554",
  phoneNumber = "+4415426250",
  email = "abc@gmail.com",
  secondaryEmail = "abc@gmail.com",
  preferredCurrency = "United States US Dollar",
  profileImage = "https://lh3.googleusercontent.com/a-/ALV-UjUcIWda3ZrzBMAJl37_GUwH9bvPyroMBoqo3x1hKRyIO-LD96s=s240-p-k-rw-no",
  scanFaceImage = "https://lh3.googleusercontent.com/a-/ALV-UjUcIWda3ZrzBMAJl37_GUwH9bvPyroMBoqo3x1hKRyIO-LD96s=s240-p-k-rw-no",
  passportImage = "https://lh3.googleusercontent.com/a-/ALV-UjUcIWda3ZrzBMAJl37_GUwH9bvPyroMBoqo3x1hKRyIO-LD96s=s240-p-k-rw-no",
  isVerified = true,
}: ProfilePageLayoutProps) {
  const [activeTab, setActiveTab] = useState<"profile" | "accountDelete" | "affiliateLog">("profile")

  return (
    <div className="p-4 md:p-6">
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setActiveTab("profile")}
          className={`px-4 md:px-6 py-2 rounded-md font-medium transition-colors ${
            activeTab === "profile"
              ? "bg-blue-500 text-white"
              : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
          }`}
        >
          profile
        </button>
        <button
          onClick={() => setActiveTab("accountDelete")}
          className={`px-4 md:px-6 py-2 rounded-md font-medium transition-colors ${
            activeTab === "accountDelete"
              ? "bg-blue-500 text-white"
              : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
          }`}
        >
          Account Delete
        </button>
        <button
          onClick={() => setActiveTab("affiliateLog")}
          className={`px-4 md:px-6 py-2 rounded-md font-medium transition-colors ${
            activeTab === "affiliateLog"
              ? "bg-blue-500 text-white"
              : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
          }`}
        >
          Business log
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "profile" && (
        <BuesinessProfileTab
          affiliateId={affiliateId}
          fullName={fullName}
          status={status}
          joiningDate={joiningDate}
          currentLevel={currentLevel}
          rank={rank}
          progress={progress}
          nationality={nationality}
          dateOfBirth={dateOfBirth}
          nationalIdentity={nationalIdentity}
          phoneNumber={phoneNumber}
          email={email}
          secondaryEmail={secondaryEmail}
          preferredCurrency={preferredCurrency}
          profileImage={profileImage}
          scanFaceImage={scanFaceImage}
          passportImage={passportImage}
          isVerified={isVerified}
        />
      )}

      {activeTab === "accountDelete" && <BusinessDeleteTab />}

      {activeTab === "affiliateLog" && <BusinessLogTab />}
    </div>
  )
}

export default ProfilePageLayout
