'use client'

import { useState } from 'react'
import { Wrench } from 'lucide-react'
import { getMultiToolPacked, setMultiToolPacked } from '@/lib/localStore'

export default function MultiToolCheck({ rideId }: { rideId: string }) {
  const [ok, setOk] = useState(() => getMultiToolPacked(rideId))

  return (
    <div className="surface" style={{ padding: 14, marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <Wrench size={16} color="var(--accent)" />
        <div className="eyebrow" style={{ margin: 0 }}>Multi-tool</div>
      </div>
      <p style={{ margin: '0 0 10px', fontSize: 12, color: 'var(--muted)', lineHeight: 1.4 }}>
        Hex + torx for a Magadi trailside fix. Keep it in the saddle bag, not at home.
      </p>
      <button
        type="button"
        className={ok ? 'btn-secondary' : 'btn-primary'}
        onClick={() => setOk(setMultiToolPacked(rideId, !ok))}
      >
        {ok ? 'Tool packed ✓' : 'Mark multi-tool packed'}
      </button>
    </div>
  )
}
