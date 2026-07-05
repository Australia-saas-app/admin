import { WalletCard } from "@/src/modules/dashboard/allUsers/components/WalletCard"


// Mock user data - replace with actual API call
const getMockUserData = (userId: string) => {
  return {
    userId,
    fullName: "Mr Jack",
    status: "ACTIVE" as const,
    joiningDate: "2025/07/29 10:15:30 +5:30",
    email: "abc@gmail.com",
  }
}

export default async function UserWalletPage({ params }: { params: Promise<{id:string}> }) {
    const {id } = await params;
  const userData = getMockUserData(id)

  return <WalletCard userId={userData.userId} />
}
