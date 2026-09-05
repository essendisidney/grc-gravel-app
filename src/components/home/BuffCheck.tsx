'use client'

import { useState } from 'react'
import { Shirt } from 'lucide-react'
import { getBuffPacked, setBuffPacked } from '@/lib/localStore'

export default function BuffCheck({ rideId }: { rideId: string }) {
  const [ok, setOk] = useState(() => getBuffPacked(rideId))

  return (
    <div className="surface" style={{ padding: 14, marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <Shirt size={16} color="var(--accent)" />
        <div className="eyebrow" style={{ margin: 0 }}>Buff / neck gaiter</div>
      </div>
      <p style={{ margin: '0 0 10px', fontSize: 12, color: 'var(--muted)', lineHeight: 1.4 }}>
        Dust + chill on Magadi mornings — a buff covers mouth, ears, and the cold start.
      </p>
      <button
        type="button"
        className={ok ? 'btn-secondary' : 'btn-primary'}
        onClick={() => setOk(setBuffPacked(rideId, !ok))}
      >
        {ok ? 'Buff packed ✓' : 'Mark buff packed'}
      </button>
    </div>
  )
}
