'use client'

import { useState } from 'react'
import { MapPin } from 'lucide-react'
import {
  gateSelfCheckIn,
  getSession,
  getRsvp,
  hasGateSelfCheckIn,
  type LocalRsvp,
} from '@/lib/localStore'

export default function GateSelfCheckIn({
  rideId,
  onChecked,
}: {
  rideId: string
  onChecked?: () => void
}) {
  const [done, setDone] = useState(() => hasGateSelfCheckIn(rideId))
  const [busy, setBusy] = useState(false)

  function checkIn() {
    setBusy(true)
    const session = getSession()
    const rsvp: LocalRsvp | null = getRsvp(rideId)
    const name = session?.fullName || 'You'
    const pace = rsvp?.paceGroupName || 'Cruiser'
    gateSelfCheckIn(rideId, name, pace)
    setDone(true)
    setBusy(false)
    onChecked?.()
  }

  return (
    <div className="surface" style={{ padding: 14, marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <MapPin size={16} color="var(--accent)" />
        <div className="section-label" style={{ margin: 0 }}>
          Gate check-in
        </div>
      </div>
      <p style={{ margin: '0 0 10px', fontSize: 12, color: 'var(--muted)', lineHeight: 1.4 }}>
        Tap when you arrive so captains see you on the roster.
      </p>
      {done ? (
        <div
          style={{
            padding: '10px 12px',
            borderRadius: 12,
            background: 'rgba(47,125,75,0.1)',
            border: '1px solid rgba(47,125,75,0.28)',
            fontSize: 13,
            fontWeight: 700,
            color: 'var(--good)',
          }}
        >
          You’re at the gate · marked present
        </div>
      ) : (
        <button type="button" className="btn-primary" onClick={checkIn} disabled={busy}>
          I’m at the gate
        </button>
      )}
    </div>
  )
}
