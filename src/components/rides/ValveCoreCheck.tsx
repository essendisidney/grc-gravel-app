'use client'

import { useState } from 'react'
import { Disc } from 'lucide-react'
import { getValveCoresPacked, setValveCoresPacked } from '@/lib/localStore'

export default function ValveCoreCheck({ rideId }: { rideId: string }) {
  const [ok, setOk] = useState(() => getValveCoresPacked(rideId))

  return (
    <div className="surface" style={{ padding: 14, marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <Disc size={16} color="var(--accent)" />
        <div className="eyebrow" style={{ margin: 0 }}>Valve cores</div>
      </div>
      <p style={{ margin: '0 0 10px', fontSize: 12, color: 'var(--muted)', lineHeight: 1.4 }}>
        Spare Presta cores + a tiny tool — a hissing valve on Magadi shouldn’t end the day.
      </p>
      <button
        type="button"
        className={ok ? 'btn-secondary' : 'btn-primary'}
        onClick={() => setOk(setValveCoresPacked(rideId, !ok))}
      >
        {ok ? 'Cores packed ✓' : 'Mark valve cores packed'}
      </button>
    </div>
  )
}
