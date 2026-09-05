'use client'

import { Waves } from 'lucide-react'
import { getWashoutTip } from '@/lib/localStore'

export default function WashoutTip({ routeId }: { routeId: string }) {
  const tip = getWashoutTip(routeId)

  return (
    <div className="surface" style={{ padding: 14, marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <Waves size={16} color="var(--accent)" />
        <div className="section-label" style={{ margin: 0 }}>
          Washouts
        </div>
      </div>
      <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 4 }}>{tip.title}</div>
      <p style={{ margin: 0, fontSize: 13, color: 'var(--muted)', lineHeight: 1.45 }}>{tip.body}</p>
    </div>
  )
}
