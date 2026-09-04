import TopBar from '@/components/layout/TopBar'
import ProfileEditClient from './ProfileEditClient'
import { DEMO_PROFILE } from '@/lib/demo'

export default function ProfileEditPage() {
  return (
    <div className="phone-shell topo-bg">
      <main className="scroll-content" style={{ flex: 1 }}>
        <TopBar showBack title="Edit Profile" backHref="/passport" showNotifications={false} />
        <ProfileEditClient profile={DEMO_PROFILE} />
      </main>
    </div>
  )
}
