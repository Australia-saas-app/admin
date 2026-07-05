"use client"

import { useState } from 'react'
import UserProfileTab from './UserProfileTab'
import { UserDeleteTab } from './UserDeleteTab'
import { UserLogTab } from './UserLogTab'
import { Button } from '@/src/components/ui/button'


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
    currentLevel = "Level - 1",
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
    const [activeTab, setActiveTab] = useState<"profile" | "accountDelete" | "userLog">("profile")

    return (
        <div className="p-4 md:p-6">
            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
                <Button
                    onClick={() => setActiveTab("profile")}
                    variant={activeTab === "profile" ? 'default' : "outline"}
                >
                    profile
                </Button>
                <Button
                    onClick={() => setActiveTab("accountDelete")}
                    variant={activeTab === "accountDelete" ? 'default' : "outline"}
                >
                    Account Delete
                </Button>
                <Button
                    onClick={() => setActiveTab("userLog")}
                    variant={activeTab === "userLog" ? 'default' : "outline"}
                >
                    User Log
                </Button>
            </div>

            {/* Tab Content */}
            {activeTab === "profile" && (
                <UserProfileTab
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

            {activeTab === "accountDelete" && <UserDeleteTab />}

            {activeTab === "userLog" && <UserLogTab />}
        </div>
    )
}

export default ProfilePageLayout
