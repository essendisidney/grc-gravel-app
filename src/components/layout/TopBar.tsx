'use client'

import Link from 'next/link'
import { Bell, ArrowLeft, ChevronDown, SlidersHorizontal } from 'lucide-react'

interface TopBarProps {
  title?: string
  showBack?: boolean
  showLogo?: boolean
  showNotifications?: boolean
  showSettings?: boolean
  backHref?: string
  rightElement?: React.ReactNode
  clubSwitcher?: boolean
}

export default function TopBar({
  title,
  showBack = false,
  showNotifications = true,
  backHref,
  rightElement,
  clubSwitcher = false,
}: TopBarProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        position: 'sticky',
        top: 0,
        background: 'rgba(243,239,232,0.88)',
        backdropFilter: 'blur(14px)',
        zIndex: 40,
        borderBottom: '1px solid transparent',
        paddingTop: 'max(12px, env(safe-area-inset-top))',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
        {showBack && (
          <Link
            href={backHref || '#'}
            onClick={!backHref ? (e) => { e.preventDefault(); window.history.back() } : undefined}
            style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'var(--surface)', border: '1px solid var(--line)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--ink)', textDecoration: 'none',
            }}
          >
            <ArrowLeft size={18} />
          </Link>
        )}
        {clubSwitcher ? (
          <button
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'var(--surface)', border: '1px solid var(--line)',
              borderRadius: 12, padding: '7px 10px 7px 7px',
              cursor: 'pointer', fontFamily: 'var(--font)',
            }}
          >
            <span style={{
              width: 28, height: 28, borderRadius: 8, background: 'var(--accent)',
              color: '#fff', fontWeight: 800, fontSize: 11,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              GRC
            </span>
            <span style={{ textAlign: 'left' }}>
              <span style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--ink)', lineHeight: 1.1 }}>Gravel Riders Club</span>
              <span style={{ display: 'block', fontSize: 11, color: 'var(--muted)' }}>Kenya · Tena & Utawala</span>
            </span>
            <ChevronDown size={16} color="#9A9288" />
          </button>
        ) : title ? (
          <span style={{ fontSize: 20, fontWeight: 700, color: 'var(--ink)' }}>{title}</span>
        ) : null}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {rightElement}
        {showNotifications && (
          <Link
            href="/notifications"
            style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'var(--surface)', border: '1px solid var(--line)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--muted)', textDecoration: 'none', position: 'relative',
            }}
          >
            <Bell size={16} />
            <span style={{ position: 'absolute', top: 8, right: 8, width: 7, height: 7, background: 'var(--accent)', borderRadius: '50%', border: '1.5px solid #fff' }} />
          </Link>
        )}
      </div>
    </div>
  )
}

export function FilterButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="chip"
      style={{ padding: '8px 10px' }}
    >
      <SlidersHorizontal size={14} />
      Filter
    </button>
  )
}
