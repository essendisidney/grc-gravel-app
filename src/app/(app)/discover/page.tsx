import TopBar from '@/components/layout/TopBar'
import DiscoverClient from './DiscoverClient'

export default function DiscoverPage() {
  return (
    <div>
      <TopBar title="Discover" showNotifications />
      <DiscoverClient />
    </div>
  )
}
