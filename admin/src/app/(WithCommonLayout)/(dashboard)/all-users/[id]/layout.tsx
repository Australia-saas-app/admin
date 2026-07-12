import { ReactNode } from "react"

interface UserDetailsLayoutProps {
  children: ReactNode
}

export default function UserDetailsLayout({ children }: UserDetailsLayoutProps) {
  return <>{children}</>
}
