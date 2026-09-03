import TopBar from '@/components/layout/TopBar'
import ProfileEditClient from './ProfileEditClient'
import { DEMO_PROFILE } from '@/lib/demo'

export default function ProfileEditPage() {
  return (
    <div style={{ maxWidth: 430, margin: '0 auto', background: '#0D0F14', minHeight: '100dvh' }}>
      <TopBar showBack title="Edit Profile" backHref="/passport" showNotifications={false} />
      <ProfileEditClient profile={DEMO_PROFILE} />
    </div>
  )
}
