'use client'

import { useState } from 'react'
import { HardHat } from 'lucide-react'
import { getHelmetReady, setHelmetReady } from '@/lib/localStore'

export default function HelmetCheck({ rideId }: { rideId: string }) {
  const [ok, setOk] = useState(() => getHelmetReady(rideId))

  return (
    <div className="surface" style={{ padding: 14, marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <HardHat size={16} color="var(--accent)" />
        <div className="eyebrow" style={{ margin: 0 }}>Helmet</div>
      </div>
      <p style={{ margin: '0 0 10px', fontSize: 12, color: 'var(--muted)', lineHeight: 1.4 }}>
        Buckle check before the car — Magadi dust rides don’t start without it.
      </p>
      <button
        type="button"
        className={ok ? 'btn-secondary' : 'btn-primary'}
        onClick={() => setOk(setHelmetReady(rideId, !ok))}
      >
        {ok ? 'Helmet ready ✓' : 'Mark helmet ready'}
      </button>
    </div>
  )
}
