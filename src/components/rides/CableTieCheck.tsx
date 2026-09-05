'use client'

import { useState } from 'react'
import { Link2 } from 'lucide-react'
import { getCableTiesPacked, setCableTiesPacked } from '@/lib/localStore'

export default function CableTieCheck({ rideId }: { rideId: string }) {
  const [ok, setOk] = useState(() => getCableTiesPacked(rideId))

  return (
    <div className="surface" style={{ padding: 14, marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <Link2 size={16} color="var(--accent)" />
        <div className="eyebrow" style={{ margin: 0 }}>Cable ties</div>
      </div>
      <p style={{ margin: '0 0 10px', fontSize: 12, color: 'var(--muted)', lineHeight: 1.4 }}>
        A few zip ties fix mudguards, bags, and limp bottles on Magadi. Tiny weight, big save.
      </p>
      <button
        type="button"
        className={ok ? 'btn-secondary' : 'btn-primary'}
        onClick={() => setOk(setCableTiesPacked(rideId, !ok))}
      >
        {ok ? 'Ties packed ✓' : 'Mark cable ties packed'}
      </button>
    </div>
  )
}
