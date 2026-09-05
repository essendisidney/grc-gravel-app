'use client'

import { useState } from 'react'
import { Bandage } from 'lucide-react'
import { getPatchKitPacked, setPatchKitPacked } from '@/lib/localStore'

export default function PatchKitCheck({ rideId }: { rideId: string }) {
  const [ok, setOk] = useState(() => getPatchKitPacked(rideId))

  return (
    <div className="surface" style={{ padding: 14, marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <Bandage size={16} color="var(--accent)" />
        <div className="eyebrow" style={{ margin: 0 }}>Patch kit</div>
      </div>
      <p style={{ margin: '0 0 10px', fontSize: 12, color: 'var(--muted)', lineHeight: 1.4 }}>
        Patches + glue (or plugs) beyond the spare tube — Magadi thorns can punch twice.
      </p>
      <button
        type="button"
        className={ok ? 'btn-secondary' : 'btn-primary'}
        onClick={() => setOk(setPatchKitPacked(rideId, !ok))}
      >
        {ok ? 'Patch kit packed ✓' : 'Mark patch kit packed'}
      </button>
    </div>
  )
}
