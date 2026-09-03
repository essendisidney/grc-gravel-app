import { getInitials, getTierColor } from '@/lib/utils'
import { DEMO_MEMBERS } from '@/lib/demo'

export default function AdminMembersPage() {
  return (
    <div>
      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 26, fontWeight: 800, marginBottom: 16 }}>Members</div>
      {DEMO_MEMBERS.map((m: any) => (
        <div key={m.id} style={{ background: '#1A1E2A', borderRadius: 13, border: '1px solid #1E2436', padding: 14, marginBottom: 8, display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{
            width: 40, height: 40, borderRadius: '50%',
            background: `${getTierColor(m.membership_tier)}22`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'Barlow Condensed', sans-serif", fontSize: 15, fontWeight: 700,
            color: getTierColor(m.membership_tier),
          }}>
            {getInitials(m.full_name)}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{m.full_name}</div>
            <div style={{ fontSize: 11, color: '#8892A4' }}>{m.membership_number} · {m.phone}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
