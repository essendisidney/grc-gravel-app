'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Compass, Users, CircleUserRound } from 'lucide-react'

const NAV_ITEMS = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/discover', label: 'Discover', icon: Compass },
  { href: '/club', label: 'Club', icon: Users },
  { href: '/passport', label: 'You', icon: CircleUserRound },
]

export default function BottomNav() {
  const pathname = usePathname()
  if (pathname.startsWith('/ride/live') || pathname.startsWith('/ride/summary')) return null

  function isActive(href: string) {
    if (href === '/') return pathname === '/'
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <div className="nav-shell">
      <nav className="nav-bar">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = isActive(href)
          return (
            <Link
              key={href}
              href={href}
              className="pressable"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
                minWidth: 58,
                padding: '4px 8px',
                textDecoration: 'none',
                color: active ? '#fff' : 'rgba(255,255,255,0.45)',
                position: 'relative',
              }}
            >
              <span
                style={{
                  width: 40,
                  height: 28,
                  borderRadius: 999,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: active ? 'rgba(254,199,46,0.22)' : 'transparent',
                  transition: 'background 0.2s ease',
                }}
              >
                <Icon size={20} strokeWidth={active ? 2.4 : 1.7} color={active ? '#FEC72E' : 'rgba(255,255,255,0.5)'} />
              </span>
              <span style={{ fontSize: 10, fontWeight: active ? 700 : 500, letterSpacing: '0.02em' }}>
                {label}
              </span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
