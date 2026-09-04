import Link from 'next/link'
import { LayoutDashboard, Map, Flag, Users, Wrench, LogOut } from 'lucide-react'
import GrcLogo from '@/components/brand/GrcLogo'

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/rides', label: 'Rides', icon: Map },
  { href: '/admin/races', label: 'Races', icon: Flag },
  { href: '/admin/members', label: 'Members', icon: Users },
  { href: '/admin/wrench', label: 'Wrench', icon: Wrench },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="phone-shell topo-bg">
      <div style={{
        background: '#fff', borderBottom: '1px solid var(--line)',
        padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <GrcLogo size={28} rounded={8} />
          <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', background: '#FEE2E2', color: 'var(--red)', borderRadius: 6 }}>Admin</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 12, color: 'var(--muted)' }}>Victor Dawa</span>
          <Link href="/" style={{ color: 'var(--muted)', display: 'flex' }}><LogOut size={16} /></Link>
        </div>
      </div>
      <div style={{ display: 'flex', overflowX: 'auto', scrollbarWidth: 'none', borderBottom: '1px solid var(--line)', background: '#fff', flexShrink: 0 }}>
        {NAV.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              padding: '10px 14px', textDecoration: 'none', color: 'var(--muted)',
              fontSize: 10, fontWeight: 600, flexShrink: 0,
            }}
          >
            <Icon size={16} />
            {label}
          </Link>
        ))}
      </div>
      <main className="scroll-content" style={{ padding: '20px 16px 40px' }}>{children}</main>
    </div>
  )
}
