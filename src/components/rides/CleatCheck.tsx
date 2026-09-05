'use client'

import { useState } from 'react'
import { Footprints } from 'lucide-react'
import { getCleatsChecked, setCleatsChecked } from '@/lib/localStore'

export default function CleatCheck({ rideId }: { rideId: string }) {
  const [ok, setOk] = useState(() => getCleatsChecked(rideId))

  return (
    <div className="surface" style={{ padding: 14, marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <Footprints size={16} color="var(--accent)" />
        <div className="eyebrow" style={{ margin: 0 }}>Cleats</div>
      </div>
      <p style={{ margin: '0 0 10px', fontSize: 12, color: 'var(--muted)', lineHeight: 1.4 }}>
        Check bolt torque and mud in the mechanism before Magadi — a loose cleat ruins the day.
      </p>
      <button
        type="button"
        className={ok ? 'btn-secondary' : 'btn-primary'}
        onClick={() => setOk(setCleatsChecked(rideId, !ok))}
      >
        {ok ? 'Cleats checked ✓' : 'Mark cleats checked'}
      </button>
    </div>
  )
}
