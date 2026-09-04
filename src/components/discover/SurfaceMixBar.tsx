'use client'

import { getSurfaceMix } from '@/lib/localStore'

export default function SurfaceMixBar({
  gravelPct,
  tarmacPct,
}: {
  gravelPct: number
  tarmacPct?: number
}) {
  const mix = getSurfaceMix(gravelPct, tarmacPct)

  return (
    <div className="surface" style={{ padding: 14, marginBottom: 14 }}>
      <div className="section-label" style={{ marginBottom: 8 }}>
        Surface mix
      </div>
      <div
        style={{
          display: 'flex',
          height: 12,
          borderRadius: 999,
          overflow: 'hidden',
          background: 'var(--bg)',
          marginBottom: 10,
        }}
      >
        <div style={{ width: `${mix.gravel}%`, background: 'var(--accent)' }} title="Gravel" />
        <div style={{ width: `${mix.tarmac}%`, background: 'var(--charcoal)' }} title="Tarmac" />
        {mix.other > 0 && <div style={{ width: `${mix.other}%`, background: 'var(--line)' }} title="Other" />}
      </div>
      <div style={{ display: 'flex', gap: 12, fontSize: 12, fontWeight: 700 }}>
        <span style={{ color: 'var(--accent-ink)' }}>Gravel {mix.gravel}%</span>
        <span style={{ color: 'var(--muted)' }}>Tarmac {mix.tarmac}%</span>
        {mix.other > 0 && <span style={{ color: 'var(--muted)' }}>Other {mix.other}%</span>}
      </div>
    </div>
  )
}
