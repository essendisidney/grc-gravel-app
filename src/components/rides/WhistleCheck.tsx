'use client'

import { useState } from 'react'
import { Megaphone } from 'lucide-react'
import { getWhistlePacked, setWhistlePacked } from '@/lib/localStore'

export default function WhistleCheck({ rideId }: { rideId: string }) {
  const [ok, setOk] = useState(() => getWhistlePacked(rideId))

  return (
    <div className="surface" style={{ padding: 14, marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <Megaphone size={16} color="var(--accent)" />
        <div className="eyebrow" style={{ margin: 0 }}>Whistle</div>
      </div>
      <p style={{ margin: '0 0 10px', fontSize: 12, color: 'var(--muted)', lineHeight: 1.4 }}>
        Compact whistle in the jersey — useful when signal drops and the pack needs a regroup call.
      </p>
      <button
        type="button"
        className={ok ? 'btn-secondary' : 'btn-primary'}
        onClick={() => setOk(setWhistlePacked(rideId, !ok))}
      >
        {ok ? 'Whistle packed ✓' : 'Mark whistle packed'}
      </button>
    </div>
  )
}
