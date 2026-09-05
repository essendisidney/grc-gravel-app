'use client'

import { useState } from 'react'
import { Hand } from 'lucide-react'
import { getGlovesReady, setGlovesReady } from '@/lib/localStore'

export default function GlovesCheck({ rideId }: { rideId: string }) {
  const [ok, setOk] = useState(() => getGlovesReady(rideId))

  return (
    <div className="surface" style={{ padding: 14, marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <Hand size={16} color="var(--accent)" />
        <div className="eyebrow" style={{ margin: 0 }}>Gloves</div>
      </div>
      <p style={{ margin: '0 0 10px', fontSize: 12, color: 'var(--muted)', lineHeight: 1.4 }}>
        Full-finger or half — Magadi gravel shreds palms on long descents. Pack a spare pair if you have them.
      </p>
      <button
        type="button"
        className={ok ? 'btn-secondary' : 'btn-primary'}
        onClick={() => setOk(setGlovesReady(rideId, !ok))}
      >
        {ok ? 'Gloves packed ✓' : 'Mark gloves packed'}
      </button>
    </div>
  )
}
