import Footer from "@/src/modules/shared/footer"
import Header from "@/src/modules/shared/header"
import MobileBottomNav from "@/src/modules/shared/components/search/MobileBottomNav"
import { ReactNode } from "react"

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <div className="pb-20 md:pb-0">{children}</div>
      <Footer />
      <MobileBottomNav />
    </div>
  )
}

export default layout
