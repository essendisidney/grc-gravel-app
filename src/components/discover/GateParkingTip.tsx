'use client'

import { ParkingSquare } from 'lucide-react'
import { getGateParkingTip } from '@/lib/localStore'

export default function GateParkingTip({ routeId }: { routeId: string }) {
  const tip = getGateParkingTip(routeId)

  return (
    <div className="surface" style={{ padding: 14, marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <ParkingSquare size={16} color="var(--accent)" />
        <div className="section-label" style={{ margin: 0 }}>
          Gate parking
        </div>
      </div>
      <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 4 }}>{tip.title}</div>
      <p style={{ margin: 0, fontSize: 13, color: 'var(--muted)', lineHeight: 1.45 }}>{tip.body}</p>
    </div>
  )
}
