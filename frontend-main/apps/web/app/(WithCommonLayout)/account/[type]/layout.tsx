import type React from "react"
import AccountLayoutComponent from "@/src/modules/account/components/AccountLayout"

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return <AccountLayoutComponent>{children}</AccountLayoutComponent>
}
