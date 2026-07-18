import React from 'react'
import ServiceLayout from './ServiceLayout'
import ServiceMainSection from './ServiceMainSection'

const ServicePage = ({service}: {service: string}) => {



  return (
    <ServiceLayout>
      <ServiceMainSection  service={String(service)} />
    </ServiceLayout>
  )
}

export default ServicePage