'use client'

import { useEffect, useState } from 'react'
import { getRollOutCountdown } from '@/lib/localStore'

export default function RollOutCountdown({
  rideDate,
  startTime,
  title,
}: {
  rideDate: string
  startTime: string
  title: string
}) {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30000)
    return () => window.clearInterval(id)
  }, [])

  const c = getRollOutCountdown(rideDate, startTime, now)

  return (
    <div
      className="surface"
      style={{
        padding: 14,
        marginBottom: 14,
        border: c.past ? '1px solid rgba(47,125,75,0.35)' : '1px solid rgba(254,199,46,0.35)',
        background: c.past ? 'rgba(47,125,75,0.08)' : 'var(--accent-soft)',
      }}
    >
      <div className="eyebrow" style={{ marginBottom: 6, color: c.past ? 'var(--good)' : 'var(--accent)' }}>
        {c.past ? 'Gate time' : 'Roll-out in'}
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums' }}>
        {c.label}
      </div>
      <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4, lineHeight: 1.4 }}>
        {title} · {startTime.slice(0, 5)}
      </div>
    </div>
  )
}
