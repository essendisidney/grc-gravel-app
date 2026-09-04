'use client'

import { Sun } from 'lucide-react'
import { getUvSunscreenTip } from '@/lib/localStore'

export default function UvSunscreenTip({ startTime }: { startTime: string }) {
  const tip = getUvSunscreenTip(startTime)

  return (
    <div className="surface" style={{ padding: 14, marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <Sun size={16} color="var(--accent)" />
        <div className="eyebrow" style={{ margin: 0 }}>Sun</div>
      </div>
      <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 4 }}>{tip.title}</div>
      <p style={{ margin: 0, fontSize: 13, color: 'var(--muted)', lineHeight: 1.45 }}>{tip.body}</p>
    </div>
  )
}
