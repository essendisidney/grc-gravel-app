'use client'

import { useState } from 'react'
import { Circle } from 'lucide-react'
import { getSpokeKeyPacked, setSpokeKeyPacked } from '@/lib/localStore'

export default function SpokeKeyCheck({ rideId }: { rideId: string }) {
  const [ok, setOk] = useState(() => getSpokeKeyPacked(rideId))

  return (
    <div className="surface" style={{ padding: 14, marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <Circle size={16} color="var(--accent)" />
        <div className="eyebrow" style={{ margin: 0 }}>Spoke key</div>
      </div>
      <p style={{ margin: '0 0 10px', fontSize: 12, color: 'var(--muted)', lineHeight: 1.4 }}>
        Corrugations can true a wheel ugly. A tiny spoke key in the saddle bag saves a limp home.
      </p>
      <button
        type="button"
        className={ok ? 'btn-secondary' : 'btn-primary'}
        onClick={() => setOk(setSpokeKeyPacked(rideId, !ok))}
      >
        {ok ? 'Spoke key packed ✓' : 'Mark spoke key packed'}
      </button>
    </div>
  )
}
