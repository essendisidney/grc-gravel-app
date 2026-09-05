'use client'

import { useState } from 'react'
import { ThermometerSnowflake } from 'lucide-react'
import { getArmWarmersPacked, setArmWarmersPacked } from '@/lib/localStore'

export default function ArmWarmersCheck({ rideId }: { rideId: string }) {
  const [ok, setOk] = useState(() => getArmWarmersPacked(rideId))

  return (
    <div className="surface" style={{ padding: 14, marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <ThermometerSnowflake size={16} color="var(--accent)" />
        <div className="eyebrow" style={{ margin: 0 }}>Arm warmers</div>
      </div>
      <p style={{ margin: '0 0 10px', fontSize: 12, color: 'var(--muted)', lineHeight: 1.4 }}>
        Pre-sunrise Magadi is cold on the ridge — peel them at the first regroup when the sun hits.
      </p>
      <button
        type="button"
        className={ok ? 'btn-secondary' : 'btn-primary'}
        onClick={() => setOk(setArmWarmersPacked(rideId, !ok))}
      >
        {ok ? 'Warmers packed ✓' : 'Mark warmers packed'}
      </button>
    </div>
  )
}
