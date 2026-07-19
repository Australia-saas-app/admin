import EcommerceDashboard from '@/src/modules/ecommerce/components/Dashboard'
import { StandalonePageChrome } from '@/src/modules/shared/components/StandalonePageChrome'

export default function EcommercePage() {
  return (
    <div className="bg-[#f0f2f5] min-h-screen">
      <StandalonePageChrome title="E-commerce Seller Portal" />
      <EcommerceDashboard />
    </div>
  )
}
