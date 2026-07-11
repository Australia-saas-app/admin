import React from 'react'
import MonitoringLayout from '@/src/business/dashboard/monitoring/components/MonitoringLayout'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Monitoring | Dashboard',
  description: 'System monitoring and metrics',
}

export default function MonitoringPage() {
  return (
    <MonitoringLayout />
  )
}
