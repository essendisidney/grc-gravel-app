'use client'

import { getProteinTip } from '@/lib/localStore'
import type { RideFeel } from '@/lib/localStore'

export default function ProteinTip({
  distanceKm,
  feel,
}: {
  distanceKm: number
  feel: RideFeel | null
}) {
  const tip = getProteinTip(distanceKm, feel)

  return (
    <div className="surface" style={{ padding: 14, marginBottom: 14 }}>
      <div className="eyebrow" style={{ marginBottom: 6, color: 'var(--accent)' }}>Rebuild</div>
      <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 4 }}>{tip.title}</div>
      <p style={{ margin: 0, fontSize: 13, color: 'var(--muted)', lineHeight: 1.45 }}>{tip.body}</p>
    </div>
  )
}
