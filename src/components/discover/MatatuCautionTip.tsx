'use client'

import { Bus } from 'lucide-react'
import { getMatatuCautionTip } from '@/lib/localStore'

export default function MatatuCautionTip({ routeId }: { routeId: string }) {
  const tip = getMatatuCautionTip(routeId)

  return (
    <div className="surface" style={{ padding: 14, marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <Bus size={16} color="var(--accent)" />
        <div className="section-label" style={{ margin: 0 }}>
          Road share
        </div>
      </div>
      <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 4 }}>{tip.title}</div>
      <p style={{ margin: 0, fontSize: 13, color: 'var(--muted)', lineHeight: 1.45 }}>{tip.body}</p>
    </div>
  )
}
