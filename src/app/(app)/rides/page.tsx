import TopBar from '@/components/layout/TopBar'
import RidesClient from './RidesClient'
import { DEMO_RIDES } from '@/lib/demo'

export default function RidesPage() {
  return (
    <div>
      <TopBar title="Rides" showNotifications />
      <RidesClient rides={DEMO_RIDES} />
    </div>
  )
}
