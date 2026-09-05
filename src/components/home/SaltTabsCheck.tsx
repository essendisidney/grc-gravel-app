'use client'

import { useState } from 'react'
import { Pill } from 'lucide-react'
import { getSaltTabsPacked, setSaltTabsPacked } from '@/lib/localStore'

export default function SaltTabsCheck({ rideId }: { rideId: string }) {
  const [ok, setOk] = useState(() => getSaltTabsPacked(rideId))

  return (
    <div className="surface" style={{ padding: 14, marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <Pill size={16} color="var(--accent)" />
        <div className="eyebrow" style={{ margin: 0 }}>Electrolytes</div>
      </div>
      <p style={{ margin: '0 0 10px', fontSize: 12, color: 'var(--muted)', lineHeight: 1.4 }}>
        Salt tabs or a salty snack for Magadi heat — water alone won’t cut it after the flats.
      </p>
      <button
        type="button"
        className={ok ? 'btn-secondary' : 'btn-primary'}
        onClick={() => setOk(setSaltTabsPacked(rideId, !ok))}
      >
        {ok ? 'Salts packed ✓' : 'Mark salts packed'}
      </button>
    </div>
  )
}
