'use client'

import { useState } from 'react'
import { getRegroupEtaMin, setRegroupEtaMin } from '@/lib/localStore'

const OPTIONS = [8, 12, 18, 25]

export default function RegroupEta({ rideId }: { rideId: string }) {
  const [eta, setEta] = useState(() => getRegroupEtaMin(rideId))

  return (
    <div
      style={{
        borderRadius: 14,
        padding: 12,
        background: 'rgba(255,252,250,0.06)',
        border: '1px solid rgba(255,255,255,0.08)',
        marginBottom: 14,
      }}
    >
      <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginBottom: 8 }}>
        Regroup ETA
      </div>
      <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>~{eta} min</div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {OPTIONS.map(m => (
          <button
            key={m}
            type="button"
            onClick={() => setEta(setRegroupEtaMin(rideId, m))}
            style={{
              border: 'none',
              borderRadius: 999,
              padding: '6px 10px',
              fontSize: 11,
              fontWeight: 700,
              cursor: 'pointer',
              background: eta === m ? 'rgba(254,199,46,0.28)' : 'rgba(255,255,255,0.08)',
              color: eta === m ? '#FEC72E' : 'rgba(255,255,255,0.7)',
            }}
          >
            {m}m
          </button>
        ))}
      </div>
    </div>
  )
}
