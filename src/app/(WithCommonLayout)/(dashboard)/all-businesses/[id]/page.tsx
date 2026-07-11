import ProfilePageLayout from "@/src/business/dashboard/allBusinesses/components/ProfilePageLayout";


// Mock user data - replace with actual API call
const getMockUserData = (userId: string) => {
  return {
    userId,
    fullName: "Mr Jack",
    status: "ACTIVE" as const,
    joiningDate: "2025/07/29 10:15:30 +5:30",
    email: "abc@gmail.com",
    nationality: "Japan",
    dateOfBirth: "02 Jun 2003",
    nationalIdentity: "4464640464495554",
    phoneNumber: "+441542625 0",
    secondaryEmail: "abc@gmail.com",
    preferredCurrency: "United States US Dollar",
    profileImage: "https://lh3.googleusercontent.com/a-/ALV-UjUcIWda3ZrzBMAJl37_GUwH9bvPyroMBoqo3x1hKRyIO-LD96s=s240-p-k-rw-no",
    idImage: "https://lh3.googleusercontent.com/a-/ALV-UjUcIWda3ZrzBMAJl37_GUwH9bvPyroMBoqo3x1hKRyIO-LD96s=s240-p-k-rw-no",
  }
}

export default async function UserDetailsPage({ params }: { params: Promise<{id:string}> }) {
const {id } = await params;
  const userData = getMockUserData(id)

  return (
    <ProfilePageLayout
      affiliateId={userData.userId}
      fullName={userData.fullName}
      status={userData.status}
      joiningDate={userData.joiningDate}
      email={userData.email}
      nationality={userData.nationality}
      dateOfBirth={userData.dateOfBirth}
      nationalIdentity={userData.nationalIdentity}
      phoneNumber={userData.phoneNumber}
      secondaryEmail={userData.secondaryEmail}
      preferredCurrency={userData.preferredCurrency}
      profileImage={userData.profileImage}
      scanFaceImage={userData.idImage}
      passportImage={userData.idImage}
      isVerified={true}
    />
  )
}