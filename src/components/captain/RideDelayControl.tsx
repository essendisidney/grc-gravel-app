'use client'

import { useState } from 'react'
import { getRideDelayMin, setRideDelayMin } from '@/lib/localStore'

const OPTIONS = [0, 15, 30, 45]

export default function RideDelayControl({ rideId }: { rideId: string }) {
  const [delay, setDelay] = useState(() => getRideDelayMin(rideId))

  return (
    <div className="surface" style={{ padding: 14, marginBottom: 16 }}>
      <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 6 }}>Start delay</div>
      <p style={{ margin: '0 0 10px', fontSize: 12, color: 'var(--muted)', lineHeight: 1.4 }}>
        Push gate time if traffic or rain — members see it on Home.
      </p>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {OPTIONS.map(m => (
          <button
            key={m}
            type="button"
            className={delay === m ? 'chip accent' : 'chip'}
            style={{ border: 'none', cursor: 'pointer' }}
            onClick={() => setDelay(setRideDelayMin(rideId, m))}
          >
            {m === 0 ? 'On time' : `+${m} min`}
          </button>
        ))}
      </div>
    </div>
  )
}
