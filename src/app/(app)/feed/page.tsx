import TopBar from '@/components/layout/TopBar'
import FeedClient from './FeedClient'
import { DEMO_POSTS, DEMO_PROFILE } from '@/lib/demo'

export default function FeedPage() {
  return (
    <div>
      <TopBar title="Club news" showNotifications />
      <p style={{ padding: '0 16px 12px', fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>
        Announcements and ride recaps in one place — the Cyql-style club feed, GRC voice.
      </p>
      <FeedClient posts={DEMO_POSTS} currentUserId={DEMO_PROFILE.id} />
    </div>
  )
}
