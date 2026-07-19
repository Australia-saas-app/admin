"use client"
import React, { useState } from 'react'
import ServiceSidebarChildren from './ServiceSidebarChildren'
import { SidebarResponsive as Sidebar } from "../../dashboard/affiliate/components/sidebarResponsive"

const ServiceLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)}>
        <ServiceSidebarChildren isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      </Sidebar>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6">
        {children}
      </main>

    </div>
  )
}

export default ServiceLayout