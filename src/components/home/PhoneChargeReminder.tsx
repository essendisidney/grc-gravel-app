'use client'

import { useState } from 'react'
import { Smartphone } from 'lucide-react'
import { getPhoneCharged, setPhoneCharged } from '@/lib/localStore'

export default function PhoneChargeReminder({ rideId }: { rideId: string }) {
  const [ok, setOk] = useState(() => getPhoneCharged(rideId))

  return (
    <div className="surface" style={{ padding: 14, marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <Smartphone size={16} color="var(--accent)" />
        <div className="eyebrow" style={{ margin: 0 }}>Phone power</div>
      </div>
      <p style={{ margin: '0 0 10px', fontSize: 12, color: 'var(--muted)', lineHeight: 1.4 }}>
        Magadi signal is patchy — start above 80% and pack a power bank if you have one.
      </p>
      <button
        type="button"
        className={ok ? 'btn-secondary' : 'btn-primary'}
        onClick={() => setOk(setPhoneCharged(rideId, !ok))}
      >
        {ok ? 'Charged ✓' : 'Mark phone charged'}
      </button>
    </div>
  )
}
