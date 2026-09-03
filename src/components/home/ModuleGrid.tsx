import Link from 'next/link'
import { Map, Flag, Wrench, MessageCircle } from 'lucide-react'

const MODULES = [
  {
    href: '/rides',
    icon: Map,
    name: 'Ride Hub',
    desc: 'Browse, join & track rides',
    iconBg: 'rgba(245,197,24,0.12)',
    iconColor: '#F5C518',
    badge: null,
  },
  {
    href: '/race',
    icon: Flag,
    name: 'Race Control',
    desc: 'Register, results & leaderboards',
    iconBg: 'rgba(239,68,68,0.12)',
    iconColor: '#EF4444',
    badge: null,
  },
  {
    href: '/wrench',
    icon: Wrench,
    name: 'Wrench',
    desc: 'Doorstep bike repair',
    iconBg: 'rgba(34,197,94,0.12)',
    iconColor: '#22C55E',
    badge: 'FAST',
  },
  {
    href: '/feed',
    icon: MessageCircle,
    name: 'The Feed',
    desc: 'Club news & ride recaps',
    iconBg: 'rgba(59,130,246,0.12)',
    iconColor: '#60A5FA',
    badge: null,
  },
]

export default function ModuleGrid() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 10,
        padding: '0 16px 20px',
      }}
    >
      {MODULES.map(({ href, icon: Icon, name, desc, iconBg, iconColor, badge }) => (
        <Link key={href} href={href} style={{ textDecoration: 'none' }}>
          <div
            style={{
              background: '#1A1E2A',
              borderRadius: 16,
              padding: 16,
              border: '1px solid #1E2436',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
              transition: 'border-color 0.2s',
              height: '100%',
            }}
          >
            {badge && (
              <div
                style={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  background: '#22C55E',
                  color: '#0D0F14',
                  fontSize: 8,
                  fontWeight: 700,
                  padding: '2px 6px',
                  borderRadius: 20,
                  letterSpacing: 0.5,
                }}
              >
                {badge}
              </div>
            )}
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: iconBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 10,
              }}
            >
              <Icon size={18} color={iconColor} />
            </div>
            <div
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 16,
                fontWeight: 700,
                color: '#F0F2F5',
                marginBottom: 3,
                letterSpacing: 0.3,
              }}
            >
              {name}
            </div>
            <div style={{ fontSize: 11, color: '#8892A4', lineHeight: 1.4 }}>
              {desc}
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
