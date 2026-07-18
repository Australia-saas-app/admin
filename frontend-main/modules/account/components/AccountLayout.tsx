"use client"

import type { ReactNode } from "react"

interface AccountLayoutProps {
  children: ReactNode
}

function AccountLayout({ children }: AccountLayoutProps) {
  return <>{children}</>
}

export default AccountLayout
