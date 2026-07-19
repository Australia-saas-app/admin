import AirlineDashboard from '@/src/modules/airline/components/AirlineDashboard'
import { StandalonePageChrome } from '@/src/modules/shared/components/StandalonePageChrome'

export default function AirlinePage() {
  return (
    <>
      <StandalonePageChrome title="Airline Booking" />
      <AirlineDashboard />
    </>
  )
}
