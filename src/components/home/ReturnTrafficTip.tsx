'use client'

import { Route } from 'lucide-react'
import { getReturnTrafficTip } from '@/lib/localStore'

export default function ReturnTrafficTip({ startTime }: { startTime: string }) {
  const tip = getReturnTrafficTip(startTime)

  return (
    <div className="surface" style={{ padding: 14, marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <Route size={16} color="var(--accent)" />
        <div className="eyebrow" style={{ margin: 0 }}>Drive home</div>
      </div>
      <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 4 }}>Back ~{tip.backAround}</div>
      <p style={{ margin: 0, fontSize: 13, color: 'var(--muted)', lineHeight: 1.45 }}>{tip.tip}</p>
    </div>
  )
}
