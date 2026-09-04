'use client'

import { getOfflinePackHealth } from '@/lib/localStore'
import Link from 'next/link'

export default function OfflinePackHealth() {
  const h = getOfflinePackHealth()

  return (
    <div className="surface" style={{ padding: 14, marginBottom: 14 }}>
      <div className="eyebrow" style={{ marginBottom: 6 }}>Offline readiness</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
        <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em' }}>{h.score}</div>
        <span
          className="chip"
          style={{
            border: 'none',
            background:
              h.label === 'Ready'
                ? 'rgba(47,125,75,0.14)'
                : h.label === 'OK'
                  ? 'var(--accent-soft)'
                  : 'rgba(196,122,18,0.14)',
            color:
              h.label === 'Ready' ? 'var(--good)' : h.label === 'OK' ? 'var(--accent-ink)' : 'var(--warn)',
          }}
        >
          {h.label}
        </span>
      </div>
      <p style={{ margin: '0 0 10px', fontSize: 13, color: 'var(--muted)', lineHeight: 1.45 }}>{h.hint}</p>
      <Link href="/discover" style={{ fontSize: 12, fontWeight: 800, color: 'var(--accent)', textDecoration: 'none' }}>
        Discover routes →
      </Link>
    </div>
  )
}
