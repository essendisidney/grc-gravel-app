import Link from 'next/link'
import { Users, Map, Flag, Wrench, ChevronRight } from 'lucide-react'
import { DEMO_RIDES, DEMO_RACES } from '@/lib/demo'

export default function AdminDashboard() {
  const stats = [
    { label: 'Active Members', value: 412, icon: Users, color: '#F5C518', href: '/admin/members' },
    { label: 'Upcoming Rides', value: DEMO_RIDES.length, icon: Map, color: '#60A5FA', href: '/admin/rides' },
    { label: 'Pending Repairs', value: 0, icon: Wrench, color: '#22C55E', href: '/admin/wrench' },
    { label: 'Open Races', value: DEMO_RACES.length, icon: Flag, color: '#EF4444', href: '/admin/races' },
  ]

  return (
    <div>
      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 28, fontWeight: 800, marginBottom: 4 }}>Club dashboard</div>
      <div style={{ fontSize: 12, color: '#8892A4', marginBottom: 20 }}>Preview numbers — live data when we add a database.</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
        {stats.map(({ label, value, icon: Icon, color, href }) => (
          <Link key={label} href={href} style={{ textDecoration: 'none' }}>
            <div style={{ background: '#1A1E2A', borderRadius: 14, border: '1px solid #1E2436', padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={16} color={color} />
                </div>
                <ChevronRight size={14} color="#8892A4" />
              </div>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 32, fontWeight: 700, color, lineHeight: 1 }}>{value}</div>
              <div style={{ fontSize: 11, color: '#8892A4', marginTop: 3 }}>{label}</div>
            </div>
          </Link>
        ))}
      </div>
      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 18, fontWeight: 700, marginBottom: 10 }}>This week’s rides</div>
      {DEMO_RIDES.slice(0, 4).map(r => (
        <div key={r.id} style={{ background: '#1A1E2A', borderRadius: 12, border: '1px solid #1E2436', padding: 12, marginBottom: 8, fontSize: 13 }}>
          {r.title}
          <div style={{ fontSize: 11, color: '#8892A4', marginTop: 3 }}>{r.ride_date} · {r.start_location_name}</div>
        </div>
      ))}
    </div>
  )
}
