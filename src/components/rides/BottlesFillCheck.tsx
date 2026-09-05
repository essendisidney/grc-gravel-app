'use client'

import { useState } from 'react'
import { Droplets } from 'lucide-react'
import { getBottlesFilled, setBottlesFilled } from '@/lib/localStore'

export default function BottlesFillCheck({ rideId }: { rideId: string }) {
  const [ok, setOk] = useState(() => getBottlesFilled(rideId))

  return (
    <div className="surface" style={{ padding: 14, marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <Droplets size={16} color="var(--accent)" />
        <div className="eyebrow" style={{ margin: 0 }}>Bottles</div>
      </div>
      <p style={{ margin: '0 0 10px', fontSize: 12, color: 'var(--muted)', lineHeight: 1.4 }}>
        Two bottles minimum for Magadi — fill at home; gate water isn’t guaranteed early.
      </p>
      <button
        type="button"
        className={ok ? 'btn-secondary' : 'btn-primary'}
        onClick={() => setOk(setBottlesFilled(rideId, !ok))}
      >
        {ok ? 'Bottles filled ✓' : 'Mark bottles filled'}
      </button>
    </div>
  )
}
