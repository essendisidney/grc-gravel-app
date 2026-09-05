'use client'

import { useState } from 'react'
import { Gauge } from 'lucide-react'
import { getPumpPacked, setPumpPacked } from '@/lib/localStore'

export default function PumpCheck({ rideId }: { rideId: string }) {
  const [ok, setOk] = useState(() => getPumpPacked(rideId))

  return (
    <div className="surface" style={{ padding: 14, marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <Gauge size={16} color="var(--accent)" />
        <div className="eyebrow" style={{ margin: 0 }}>Pump / CO₂</div>
      </div>
      <p style={{ margin: '0 0 10px', fontSize: 12, color: 'var(--muted)', lineHeight: 1.4 }}>
        Mini-pump or CO₂ + correct head for your valves. Magadi flats are a long walk without it.
      </p>
      <button
        type="button"
        className={ok ? 'btn-secondary' : 'btn-primary'}
        onClick={() => setOk(setPumpPacked(rideId, !ok))}
      >
        {ok ? 'Pump packed ✓' : 'Mark pump packed'}
      </button>
    </div>
  )
}
