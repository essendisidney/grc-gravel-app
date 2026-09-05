'use client'

import { useState } from 'react'
import { Cookie } from 'lucide-react'
import { getSnackPacked, setSnackPacked } from '@/lib/localStore'

export default function SnackPackCheck({ rideId }: { rideId: string }) {
  const [ok, setOk] = useState(() => getSnackPacked(rideId))

  return (
    <div className="surface" style={{ padding: 14, marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <Cookie size={16} color="var(--accent)" />
        <div className="eyebrow" style={{ margin: 0 }}>Snacks</div>
      </div>
      <p style={{ margin: '0 0 10px', fontSize: 12, color: 'var(--muted)', lineHeight: 1.4 }}>
        Two gels + a banana (or mandazi) for Magadi. Don’t rely on the chai stop alone.
      </p>
      <button
        type="button"
        className={ok ? 'btn-secondary' : 'btn-primary'}
        onClick={() => setOk(setSnackPacked(rideId, !ok))}
      >
        {ok ? 'Snacks packed ✓' : 'Mark snacks packed'}
      </button>
    </div>
  )
}
