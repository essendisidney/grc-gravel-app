'use client'

import { useState } from 'react'
import { CreditCard } from 'lucide-react'
import { getIdCardPacked, setIdCardPacked } from '@/lib/localStore'

export default function IdCardCheck({ rideId }: { rideId: string }) {
  const [ok, setOk] = useState(() => getIdCardPacked(rideId))

  return (
    <div className="surface" style={{ padding: 14, marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <CreditCard size={16} color="var(--accent)" />
        <div className="eyebrow" style={{ margin: 0 }}>ID / membership</div>
      </div>
      <p style={{ margin: '0 0 10px', fontSize: 12, color: 'var(--muted)', lineHeight: 1.4 }}>
        National ID or club card in a zip pocket — useful at park gates and if a marshal asks.
      </p>
      <button
        type="button"
        className={ok ? 'btn-secondary' : 'btn-primary'}
        onClick={() => setOk(setIdCardPacked(rideId, !ok))}
      >
        {ok ? 'ID packed ✓' : 'Mark ID packed'}
      </button>
    </div>
  )
}
