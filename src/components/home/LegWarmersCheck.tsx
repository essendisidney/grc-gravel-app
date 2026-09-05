'use client'

import { useState } from 'react'
import { Thermometer } from 'lucide-react'
import { getLegWarmersPacked, setLegWarmersPacked } from '@/lib/localStore'

export default function LegWarmersCheck({ rideId }: { rideId: string }) {
  const [ok, setOk] = useState(() => getLegWarmersPacked(rideId))

  return (
    <div className="surface" style={{ padding: 14, marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <Thermometer size={16} color="var(--accent)" />
        <div className="eyebrow" style={{ margin: 0 }}>Leg warmers</div>
      </div>
      <p style={{ margin: '0 0 10px', fontSize: 12, color: 'var(--muted)', lineHeight: 1.4 }}>
        Pre-sunrise Magadi bites the quads — peel at the first warm regroup, not halfway into a climb.
      </p>
      <button
        type="button"
        className={ok ? 'btn-secondary' : 'btn-primary'}
        onClick={() => setOk(setLegWarmersPacked(rideId, !ok))}
      >
        {ok ? 'Leg warmers packed ✓' : 'Mark leg warmers packed'}
      </button>
    </div>
  )
}
