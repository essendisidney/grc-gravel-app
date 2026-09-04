import TopBar from '@/components/layout/TopBar'
import NotificationsClient from './NotificationsClient'
import { DEMO_NOTIFICATIONS, DEMO_PROFILE } from '@/lib/demo'

export default function NotificationsPage() {
  return (
    <div className="phone-shell topo-bg">
      <main className="scroll-content" style={{ flex: 1 }}>
        <TopBar showBack title="Notifications" showNotifications={false} backHref="/" />
        <NotificationsClient notifications={DEMO_NOTIFICATIONS} userId={DEMO_PROFILE.id} />
      </main>
    </div>
  )
}
