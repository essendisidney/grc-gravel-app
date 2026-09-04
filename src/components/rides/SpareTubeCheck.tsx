'use client'

import { useState } from 'react'
import { CircleDot } from 'lucide-react'
import { getSpareTubePacked, setSpareTubePacked } from '@/lib/localStore'

export default function SpareTubeCheck({ rideId }: { rideId: string }) {
  const [ok, setOk] = useState(() => getSpareTubePacked(rideId))

  return (
    <div className="surface" style={{ padding: 14, marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <CircleDot size={16} color="var(--accent)" />
        <div className="eyebrow" style={{ margin: 0 }}>Puncture kit</div>
      </div>
      <p style={{ margin: '0 0 10px', fontSize: 12, color: 'var(--muted)', lineHeight: 1.4 }}>
        Magadi thorns are real — spare tube (or plugs) + CO₂ / pump before you roll.
      </p>
      <button
        type="button"
        className={ok ? 'btn-secondary' : 'btn-primary'}
        onClick={() => setOk(setSpareTubePacked(rideId, !ok))}
      >
        {ok ? 'Tube packed ✓' : 'Mark spare packed'}
      </button>
    </div>
  )
}
