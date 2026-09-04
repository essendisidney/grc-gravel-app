'use client'

import { useState } from 'react'
import { Banknote } from 'lucide-react'
import { getCashFloatPacked, setCashFloatPacked } from '@/lib/localStore'

export default function CashFloatCheck({ rideId }: { rideId: string }) {
  const [ok, setOk] = useState(() => getCashFloatPacked(rideId))

  return (
    <div className="surface" style={{ padding: 14, marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <Banknote size={16} color="var(--accent)" />
        <div className="eyebrow" style={{ margin: 0 }}>Cash float</div>
      </div>
      <p style={{ margin: '0 0 10px', fontSize: 12, color: 'var(--muted)', lineHeight: 1.4 }}>
        Pack ~KES 500 for chai, soda, and any gate fees — cards die on Magadi signal.
      </p>
      <button
        type="button"
        className={ok ? 'btn-secondary' : 'btn-primary'}
        onClick={() => setOk(setCashFloatPacked(rideId, !ok))}
      >
        {ok ? 'Float packed ✓' : 'Mark float packed'}
      </button>
    </div>
  )
}
