'use client'

import { Coffee } from 'lucide-react'
import { getChaiStopEtaTip } from '@/lib/localStore'

export default function ChaiStopEtaTip({ routeId }: { routeId: string }) {
  const tip = getChaiStopEtaTip(routeId)

  return (
    <div className="surface" style={{ padding: 14, marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <Coffee size={16} color="var(--accent)" />
        <div className="section-label" style={{ margin: 0 }}>
          Chai stop
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'baseline', marginBottom: 4 }}>
        <div style={{ fontWeight: 800, fontSize: 14 }}>{tip.title}</div>
        <span className="chip accent" style={{ border: 'none' }}>{tip.eta}</span>
      </div>
      <p style={{ margin: 0, fontSize: 13, color: 'var(--muted)', lineHeight: 1.45 }}>{tip.body}</p>
    </div>
  )
}
