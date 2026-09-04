'use client'

import { useState } from 'react'
import { Users } from 'lucide-react'
import { getBuddyChecked, setBuddyChecked } from '@/lib/localStore'

export default function BuddyCheckConfirm({ rideId }: { rideId: string }) {
  const [ok, setOk] = useState(() => getBuddyChecked(rideId))

  return (
    <div className="surface" style={{ padding: 14, marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <Users size={16} color="var(--accent)" />
        <div className="eyebrow" style={{ margin: 0 }}>Buddy check</div>
      </div>
      <p style={{ margin: '0 0 10px', fontSize: 12, color: 'var(--muted)', lineHeight: 1.4 }}>
        Name your ride buddy at the gate — if signal drops, someone knows you’re still on course.
      </p>
      <button
        type="button"
        className={ok ? 'btn-secondary' : 'btn-primary'}
        onClick={() => setOk(setBuddyChecked(rideId, !ok))}
      >
        {ok ? 'Buddy locked ✓' : 'Confirm buddy'}
      </button>
    </div>
  )
}
