import TechnicalProjectLayout from "@/src/modules/dashboard/shared/components/TechnicalProjectLayout";


// Mock user data - replace with actual API call
const getMockUserData = (userId: string) => {
  return {
    userId,
    fullName: "Mr Jack",
    status: "ACTIVE" as const,
    email: "abc@gmail.com",
  }
}

export default async function UserTechnicalPage({ params }: { params: Promise<{id:string}> }) {
    const {id } = await params;
    console.log(id)

  return (
   <TechnicalProjectLayout/>
  )
}
