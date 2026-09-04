'use client'

import { useEffect, useState } from 'react'
import { Flame } from 'lucide-react'
import { getStreak } from '@/lib/localStore'

export default function SaturdayStreak({ compact = false }: { compact?: boolean }) {
  const [streak, setStreak] = useState({ count: 0, lastDate: null as string | null })

  useEffect(() => {
    setStreak(getStreak())
  }, [])

  return (
    <div
      className="surface"
      style={{
        padding: compact ? 12 : 14,
        marginBottom: compact ? 0 : 14,
        display: 'flex',
        gap: 12,
        alignItems: 'center',
      }}
    >
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: 14,
          background: 'var(--accent)',
          color: 'var(--accent-ink)',
          display: 'grid',
          placeItems: 'center',
          flexShrink: 0,
        }}
      >
        <Flame size={20} strokeWidth={2.4} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)' }}>
          Saturday streak
        </div>
        <div style={{ fontSize: compact ? 16 : 18, fontWeight: 800, marginTop: 2 }}>
          {streak.count} week{streak.count === 1 ? '' : 's'}
        </div>
        {!compact && (
          <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
            Keep rolling Magadi / club Saturdays to keep the flame.
          </div>
        )}
      </div>
    </div>
  )
}
