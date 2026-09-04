'use client'

import { useState } from 'react'
import { getSession, hasThankedCaptain, thankCaptain } from '@/lib/localStore'

export default function ThanksCaptain({
  rideId,
  captainName = 'Amina Otieno',
}: {
  rideId: string
  captainName?: string
}) {
  const [done, setDone] = useState(() => hasThankedCaptain(rideId))

  function send() {
    const from = getSession()?.fullName || 'You'
    thankCaptain(rideId, captainName, from)
    setDone(true)
  }

  return (
    <div className="surface" style={{ padding: 14, marginBottom: 14 }}>
      <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 6 }}>Thanks, captain</div>
      <p style={{ margin: '0 0 10px', fontSize: 12, color: 'var(--muted)', lineHeight: 1.4 }}>
        Send a shoutout to {captainName.split(' ')[0]} — lands on the kudos board.
      </p>
      {done ? (
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--good)' }}>Sent ✓</div>
      ) : (
        <button type="button" className="btn-secondary" onClick={send}>
          Thank {captainName.split(' ')[0]}
        </button>
      )}
    </div>
  )
}
