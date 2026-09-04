'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Trophy } from 'lucide-react'
import TopBar from '@/components/layout/TopBar'
import { getSeasonKm, getSeasonLeaderboard, getSession } from '@/lib/localStore'

export default function LeaderboardPage() {
  const [rows, setRows] = useState<ReturnType<typeof getSeasonLeaderboard>>([])

  useEffect(() => {
    const s = getSession()
    setRows(getSeasonLeaderboard(s?.fullName, getSeasonKm()))
  }, [])

  return (
    <div>
      <TopBar showBack title="Season board" backHref="/club" showNotifications={false} />
      <div className="page animate-fade-in">
        <div className="eyebrow" style={{ color: 'var(--accent)', marginBottom: 6 }}>Wave 11</div>
        <h1 style={{ margin: '0 0 8px', fontSize: 26, fontWeight: 800 }}>Rift 500 board</h1>
        <p style={{ margin: '0 0 16px', fontSize: 14, color: 'var(--muted)', lineHeight: 1.45 }}>
          Club km this season — demo rankings with your logged rides mixed in.
        </p>

        {rows.map(r => {
          const you = 'isYou' in r && r.isYou
          return (
            <div
              key={`${r.rank}-${r.name}`}
              className="surface"
              style={{
                padding: 12,
                marginBottom: 8,
                display: 'flex',
                gap: 12,
                alignItems: 'center',
                border: you ? '1px solid rgba(254,199,46,0.5)' : '1px solid var(--line)',
                background: you ? 'var(--accent-soft)' : 'var(--surface)',
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 12,
                  background: r.rank <= 3 ? 'var(--accent)' : 'var(--charcoal)',
                  color: r.rank <= 3 ? 'var(--accent-ink)' : '#fff',
                  display: 'grid',
                  placeItems: 'center',
                  fontWeight: 800,
                  fontSize: 13,
                  flexShrink: 0,
                }}
              >
                {r.rank <= 3 ? <Trophy size={14} /> : r.rank}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 800, fontSize: 14 }}>
                  {r.name}
                  {you ? ' · you' : ''}
                </div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
                  {r.elite ? 'Elite' : 'Member'}
                </div>
              </div>
              <div style={{ fontWeight: 800, fontSize: 15 }}>{r.km} km</div>
            </div>
          )
        })}

        <Link
          href="/passport"
          style={{
            display: 'block',
            textAlign: 'center',
            marginTop: 14,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--muted)',
            textDecoration: 'none',
          }}
        >
          Log more on You →
        </Link>
      </div>
    </div>
  )
}
