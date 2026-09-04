'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Timer } from 'lucide-react'
import { getCorridorPrs, type CorridorPr } from '@/lib/localStore'

function formatSec(sec: number) {
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = sec % 60
  if (h > 0) return `${h}h ${m}m`
  return `${m}m ${String(s).padStart(2, '0')}s`
}

export default function CorridorPrs() {
  const [prs, setPrs] = useState<CorridorPr[]>([])

  useEffect(() => {
    setPrs(getCorridorPrs())
  }, [])

  if (!prs.length) return null

  return (
    <div style={{ marginBottom: 18 }}>
      <div className="eyebrow" style={{ marginBottom: 10 }}>Corridor PRs</div>
      {prs.slice(0, 4).map(p => (
        <Link
          key={p.rideId}
          href={`/rides/${p.rideId}`}
          className="surface"
          style={{
            display: 'flex',
            gap: 12,
            alignItems: 'center',
            padding: 12,
            marginBottom: 8,
            textDecoration: 'none',
            color: 'var(--ink)',
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: 'var(--accent)',
              color: 'var(--accent-ink)',
              display: 'grid',
              placeItems: 'center',
              flexShrink: 0,
            }}
          >
            <Timer size={18} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 800, fontSize: 14 }}>{p.title}</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
              {p.distanceKm} km · {new Date(p.at).toLocaleDateString()}
              {p.feel ? ` · feel ${p.feel}/5` : ''}
            </div>
          </div>
          <div style={{ fontWeight: 800, fontSize: 14 }}>{formatSec(p.bestSec)}</div>
        </Link>
      ))}
    </div>
  )
}
