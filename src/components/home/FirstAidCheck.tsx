'use client'

import { useState } from 'react'
import { Cross } from 'lucide-react'
import { getFirstAidPacked, setFirstAidPacked } from '@/lib/localStore'

export default function FirstAidCheck({ rideId }: { rideId: string }) {
  const [ok, setOk] = useState(() => getFirstAidPacked(rideId))

  return (
    <div className="surface" style={{ padding: 14, marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <Cross size={16} color="var(--accent)" />
        <div className="eyebrow" style={{ margin: 0 }}>First aid</div>
      </div>
      <p style={{ margin: '0 0 10px', fontSize: 12, color: 'var(--muted)', lineHeight: 1.4 }}>
        Mini kit: plasters, antiseptic wipe, painkiller. Captains carry more — you still pack basics.
      </p>
      <button
        type="button"
        className={ok ? 'btn-secondary' : 'btn-primary'}
        onClick={() => setOk(setFirstAidPacked(rideId, !ok))}
      >
        {ok ? 'First aid packed ✓' : 'Mark first aid packed'}
      </button>
    </div>
  )
}
