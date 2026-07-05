"use client"
import type React from "react"
import { useState, useEffect } from "react"
import { Sidebar } from "./sidebar"
import { TopBar } from "./top-bar"
import AccountSidebarChildren from "./AccountSidebarChildren"
import { useAppSelector } from "@/src/redux/hooks"
import { useRouter } from "next/navigation"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mounted, setMounted] = useState(false)
  const { isAuthenticated, token, loading } = useAppSelector((state) => state.auth)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !isAuthenticated && !token && !loading) {
      router.replace("/account/login")
    }
  }, [mounted, isAuthenticated, token, loading, router])

  if (!mounted || loading || (!isAuthenticated && !token)) {
    return <div className="min-h-screen bg-base-100 flex items-center justify-center font-bold">Checking authentication...</div>
  }

  return (
    <div className="min-h-screen bg-base-100">
      {/* Top Bar */}
      <TopBar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex h-[calc(100vh-85px)] ">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)}>
          <AccountSidebarChildren onToggle={() => setSidebarOpen(!sidebarOpen)} isOpen={sidebarOpen} />
        </Sidebar>

        {/* Main Content */}
        <div className="flex-1 h-full overflow-auto  mx-5 mt-6">


          {/* Main Content Area */}
          <main className="pb-20">{children}</main>
        </div>
      </div>
    </div>
  )
}
