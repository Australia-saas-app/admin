
import ProfilePageLayout from "@/src/business/dashboard/allAffiliate/components/ProfilePageLayout";

// Mock user data - replace with actual API call
const getMockUserData = (userId: string) => {
  return {
    affiliateId: userId,
    fullName: "Mr jack",
    status: "ACTIVE" as const,
    joiningDate: "2025/07/29 10:15:30 (EST)",
    currentLevel: "Level - 1",
    rank: "T265",
    progress: "45.71%",
    nationality: "Japan",
    dateOfBirth: "02 Jun 2003",
    nationalIdentity: "4464649464495554",
    phoneNumber: "+4415426250",
    email: "abc@gmail.com",
    secondaryEmail: "abc@gmail.com",
    preferredCurrency: "United States US Dollar",
    profileImage: "https://lh3.googleusercontent.com/a-/ALV-UjUcIWda3ZrzBMAJl37_GUwH9bvPyroMBoqo3x1hKRyIO-LD96s=s240-p-k-rw-no",
    scanFaceImage: "https://lh3.googleusercontent.com/a-/ALV-UjUcIWda3ZrzBMAJl37_GUwH9bvPyroMBoqo3x1hKRyIO-LD96s=s240-p-k-rw-no",
    passportImage: "https://lh3.googleusercontent.com/a-/ALV-UjUcIWda3ZrzBMAJl37_GUwH9bvPyroMBoqo3x1hKRyIO-LD96s=s240-p-k-rw-no",
    isVerified: true,
  }
}

export default async function AffiliateDetailsPage({ params }: { params: Promise<{id:string}> }) {
  const {id } = await params;
  const userData = getMockUserData(id)

  return (
    <ProfilePageLayout
      affiliateId={userData.affiliateId}
      fullName={userData.fullName}
      status={userData.status}
      joiningDate={userData.joiningDate}
      currentLevel={userData.currentLevel}
      rank={userData.rank}
      progress={userData.progress}
      nationality={userData.nationality}
      dateOfBirth={userData.dateOfBirth}
      nationalIdentity={userData.nationalIdentity}
      phoneNumber={userData.phoneNumber}
      email={userData.email}
      secondaryEmail={userData.secondaryEmail}
      preferredCurrency={userData.preferredCurrency}
      profileImage={userData.profileImage}
      scanFaceImage={userData.scanFaceImage}
      passportImage={userData.passportImage}
      isVerified={userData.isVerified}
    />
  )
}
