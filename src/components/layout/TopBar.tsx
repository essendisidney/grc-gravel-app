'use client'

import Link from 'next/link'
import { ArrowLeft, ChevronDown, SlidersHorizontal } from 'lucide-react'
import GrcLogo from '@/components/brand/GrcLogo'
import NotifBell from '@/components/layout/NotifBell'

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
        padding: '12px var(--page-x)',
        position: 'sticky',
        top: 0,
        background: 'rgba(247,244,236,0.9)',
        backdropFilter: 'blur(14px)',
        zIndex: 40,
        borderBottom: '1px solid transparent',
        /* Safe-area is applied once on the scroll shell — do not double it here */
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
              color: 'var(--ink)', textDecoration: 'none', flexShrink: 0,
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
            <GrcLogo size={28} rounded={8} />
            <span style={{ textAlign: 'left' }}>
              <span style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--ink)', lineHeight: 1.1 }}>Gravel Riders Club</span>
              <span style={{ display: 'block', fontSize: 11, color: 'var(--muted)' }}>Kenya · Tena & Utawala</span>
            </span>
            <ChevronDown size={16} color="#9A9288" />
          </button>
        ) : title ? (
          <span
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: 'var(--ink)',
              letterSpacing: '-0.02em',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {title}
          </span>
        ) : null}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        {rightElement}
        {showNotifications && <NotifBell />}
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
