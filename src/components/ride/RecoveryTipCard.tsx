'use client'

import { recoveryTip } from '@/lib/localStore'
import type { RideFeel } from '@/lib/localStore'

export default function RecoveryTipCard({ feel }: { feel: RideFeel | null }) {
  const tip = recoveryTip(feel)
  if (!tip) return null

  return (
    <div className="surface" style={{ padding: 14, marginBottom: 14 }}>
      <div className="eyebrow" style={{ marginBottom: 6, color: 'var(--accent)' }}>Aftercare</div>
      <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 4 }}>{tip.title}</div>
      <p style={{ margin: 0, fontSize: 13, color: 'var(--muted)', lineHeight: 1.45 }}>{tip.body}</p>
    </div>
  )
}
