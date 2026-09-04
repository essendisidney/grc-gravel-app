'use client'

import { useState } from 'react'
import { Rocket } from 'lucide-react'
import {
  addCaptainPing,
  getSession,
  setRollOutBroadcast,
  type CaptainPing,
} from '@/lib/localStore'

export default function RollOutNow({
  rideId,
  onPing,
}: {
  rideId: string
  onPing?: (pings: CaptainPing[]) => void
}) {
  const [sent, setSent] = useState(false)

  function fire() {
    const captainName = getSession()?.fullName || 'Captain'
    const message = 'ROLL OUT NOW — lights on, gate closing. See you on Magadi dust.'
    setRollOutBroadcast({
      rideId,
      message,
      at: new Date().toISOString(),
      captainName,
    })
    const next = addCaptainPing({
      id: `p_roll_${Date.now()}`,
      rideId,
      message,
      createdAt: new Date().toISOString(),
    })
    onPing?.(next)
    setSent(true)
    setTimeout(() => setSent(false), 2500)
  }

  return (
    <div className="surface" style={{ padding: 14, marginBottom: 16 }}>
      <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 6 }}>Roll-out call</div>
      <p style={{ margin: '0 0 12px', fontSize: 12, color: 'var(--muted)', lineHeight: 1.4 }}>
        Broadcast to Home + pings — members see a live banner for 3 hours.
      </p>
      <button type="button" className="btn-primary" onClick={fire}>
        <Rocket size={16} /> {sent ? 'Broadcast sent' : 'Roll out now'}
      </button>
    </div>
  )
}
