'use client'

import { getSpotsPulse } from '@/lib/localStore'

export default function SpotsPulse({
  registered,
  max,
}: {
  registered: number
  max: number
}) {
  const pulse = getSpotsPulse(registered, max)
  const color =
    pulse.tone === 'full' ? 'var(--bad)' : pulse.tone === 'hot' ? 'var(--warn)' : 'var(--good)'

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 10px',
        borderRadius: 999,
        background: 'var(--bg)',
        border: `1px solid ${color}`,
        fontSize: 11,
        fontWeight: 800,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        color,
      }}
    >
      {pulse.tone === 'hot' && <span className="pulse-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: color }} />}
      {pulse.label}
    </div>
  )
}
