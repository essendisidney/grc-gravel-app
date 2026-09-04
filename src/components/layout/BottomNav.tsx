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
      <nav className="nav-bar" aria-label="Main">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = isActive(href)
          return (
            <Link
              key={href}
              href={href}
              className="pressable"
              aria-current={active ? 'page' : undefined}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
                flex: 1,
                minWidth: 0,
                minHeight: 48,
                padding: '4px 6px',
                textDecoration: 'none',
                color: active ? '#FEC72E' : 'rgba(255,255,255,0.72)',
              }}
            >
              <span
                style={{
                  width: 44,
                  height: 28,
                  borderRadius: 999,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: active ? 'rgba(254,199,46,0.22)' : 'transparent',
                  border: active ? '1px solid rgba(254,199,46,0.45)' : '1px solid transparent',
                  boxSizing: 'border-box',
                }}
              >
                <Icon
                  size={20}
                  strokeWidth={active ? 2.4 : 2}
                  color={active ? '#FEC72E' : 'rgba(255,255,255,0.78)'}
                />
              </span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: active ? 700 : 600,
                  letterSpacing: '0.02em',
                  lineHeight: 1.1,
                  whiteSpace: 'nowrap',
                }}
              >
                {label}
              </span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
