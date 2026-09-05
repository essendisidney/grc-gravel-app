'use client'

import { useState } from 'react'
import { Sun } from 'lucide-react'
import { getSunSleevesPacked, setSunSleevesPacked } from '@/lib/localStore'

export default function SunSleevesCheck({ rideId }: { rideId: string }) {
  const [ok, setOk] = useState(() => getSunSleevesPacked(rideId))

  return (
    <div className="surface" style={{ padding: 14, marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <Sun size={16} color="var(--accent)" />
        <div className="eyebrow" style={{ margin: 0 }}>Sun sleeves</div>
      </div>
      <p style={{ margin: '0 0 10px', fontSize: 12, color: 'var(--muted)', lineHeight: 1.4 }}>
        Magadi sun cooks forearms — light sleeves beat another layer of SPF once you’re rolling.
      </p>
      <button
        type="button"
        className={ok ? 'btn-secondary' : 'btn-primary'}
        onClick={() => setOk(setSunSleevesPacked(rideId, !ok))}
      >
        {ok ? 'Sleeves packed ✓' : 'Mark sleeves packed'}
      </button>
    </div>
  )
}
