import TopBar from '@/components/layout/TopBar'
import NotificationsClient from './NotificationsClient'
import { DEMO_NOTIFICATIONS, DEMO_PROFILE } from '@/lib/demo'

export default function NotificationsPage() {
  return (
    <div style={{ maxWidth: 430, margin: '0 auto', background: 'var(--bg)', minHeight: '100dvh' }}>
      <TopBar showBack title="Notifications" showNotifications={false} backHref="/" />
      <NotificationsClient notifications={DEMO_NOTIFICATIONS} userId={DEMO_PROFILE.id} />
    </div>
  )
}
