'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Flag } from 'lucide-react'
import { getSeasonKm, SEASON_GOAL_KM } from '@/lib/localStore'

export default function SeasonChallenge({ compact = false }: { compact?: boolean }) {
  const [km, setKm] = useState(0)

  useEffect(() => {
    setKm(getSeasonKm())
  }, [])

  const pct = Math.min(100, Math.round((km / SEASON_GOAL_KM) * 100))
  const left = Math.max(0, SEASON_GOAL_KM - km)

  return (
    <div
      className="surface"
      style={{
        padding: compact ? 14 : 16,
        marginBottom: compact ? 0 : 14,
        background: 'linear-gradient(145deg, #FFF8F1 0%, #FFFCFA 100%)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
        <div>
          <div className="eyebrow" style={{ color: 'var(--accent)', marginBottom: 6 }}>
            Season · 2026
          </div>
          <div style={{ fontSize: compact ? 16 : 18, fontWeight: 800, letterSpacing: '-0.02em' }}>
            Rift 500
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4, lineHeight: 1.4 }}>
            {km} / {SEASON_GOAL_KM} km · {left} km to badge
          </div>
        </div>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: 'var(--accent-soft)',
            display: 'grid',
            placeItems: 'center',
            flexShrink: 0,
          }}
        >
          <Flag size={18} color="var(--accent)" />
        </div>
      </div>
      <div
        style={{
          height: 8,
          borderRadius: 999,
          background: 'rgba(28,25,22,0.08)',
          marginTop: 14,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #E07A2F, #C45A12)',
            transition: 'width 0.4s ease',
          }}
        />
      </div>
      {!compact && (
        <Link
          href="/ride/live?ride=ngong-magadi"
          style={{
            display: 'inline-block',
            marginTop: 12,
            fontSize: 12,
            fontWeight: 700,
            color: 'var(--accent)',
            textDecoration: 'none',
          }}
        >
          Log km on Saturday →
        </Link>
      )}
    </div>
  )
}
