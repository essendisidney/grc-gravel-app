'use client'

import { Grid3x3 } from 'lucide-react'
import { getCattleGridTip } from '@/lib/localStore'

export default function CattleGridTip({ routeId }: { routeId: string }) {
  const tip = getCattleGridTip(routeId)

  return (
    <div className="surface" style={{ padding: 14, marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <Grid3x3 size={16} color="var(--accent)" />
        <div className="section-label" style={{ margin: 0 }}>
          Cattle grids
        </div>
      </div>
      <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 4 }}>{tip.title}</div>
      <p style={{ margin: 0, fontSize: 13, color: 'var(--muted)', lineHeight: 1.45 }}>{tip.body}</p>
    </div>
  )
}
