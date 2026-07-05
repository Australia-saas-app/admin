import TechnicalDetailLayout from "@/src/modules/dashboard/technicalService/components/TechnicalDetailLayout"

export default async function TechnicalDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return <TechnicalDetailLayout orderId={id} />
}
