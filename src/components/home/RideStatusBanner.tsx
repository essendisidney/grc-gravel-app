'use client'

import { useEffect, useState } from 'react'
import { getRideStatus, type RideDayStatus } from '@/lib/localStore'

const LABELS: Record<RideDayStatus, { label: string; color: string; note: string }> = {
  on: {
    label: 'RIDE ON',
    color: 'var(--good)',
    note: 'Captains confirmed — see you at the gate.',
  },
  postponed: {
    label: 'POSTPONED',
    color: 'var(--warn)',
    note: 'Hold at home. Captains will repost a new roll-out.',
  },
  cancelled: {
    label: 'CANCELLED',
    color: 'var(--bad)',
    note: 'This Saturday is off. Check Club news for the next date.',
  },
}

export default function RideStatusBanner({ rideId }: { rideId: string }) {
  const [status, setStatus] = useState<RideDayStatus>('on')

  useEffect(() => {
    setStatus(getRideStatus(rideId))
  }, [rideId])

  if (status === 'on') return null

  const meta = LABELS[status]

  return (
    <div
      style={{
        margin: '0 14px 12px',
        padding: 12,
        borderRadius: 14,
        background: status === 'cancelled' ? 'rgba(179,58,58,0.1)' : 'rgba(196,122,18,0.12)',
        border: `1px solid ${status === 'cancelled' ? 'rgba(179,58,58,0.3)' : 'rgba(196,122,18,0.35)'}`,
      }}
    >
      <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.1em', color: meta.color }}>
        {meta.label}
      </div>
      <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4, lineHeight: 1.4 }}>{meta.note}</div>
    </div>
  )
}
