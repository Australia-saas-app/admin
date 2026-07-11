import TechnicalPaymentLayout from '@/src/business/dashboard/shared/components/TechnicalPaymentLayout';
import React from 'react'

const page = async ({ params }: { params: Promise<{id:string}> }) => {
    const {id} = await params;
    console.log(id)
  return (
    <TechnicalPaymentLayout />
  )
}

export default page