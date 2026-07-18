import type { ReactNode } from "react"

interface PageContainerProps {
  children: ReactNode
  className?: string
  size?: "sm" | "md" | "lg" | "full"
}

const sizeClasses = {
  sm: "max-w-3xl",
  md: "max-w-5xl",
  lg: "max-w-7xl",
  full: "max-w-[1400px]",
}

export function PageContainer({
  children,
  className = "",
  size = "lg",
}: PageContainerProps) {
  return (
    <main className={`mx-auto w-full px-4 py-6 md:px-6 md:py-8 ${sizeClasses[size]} ${className}`}>
      {children}
    </main>
  )
}
