'use client'

import { useState } from 'react'
import Link from 'next/link'
import { clearRollOutBroadcast, getRollOutBroadcast } from '@/lib/localStore'

export default function RollOutBanner() {
  const [broadcast, setBroadcast] = useState(() => getRollOutBroadcast())

  if (!broadcast) return null

  return (
    <div
      style={{
        margin: '0 14px 12px',
        padding: 14,
        borderRadius: 14,
        background: 'rgba(254,199,46,0.16)',
        border: '1px solid rgba(254,199,46,0.45)',
      }}
    >
      <div className="eyebrow" style={{ color: 'var(--accent)', marginBottom: 4 }}>
        Live · {broadcast.captainName.split(' ')[0]}
      </div>
      <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 6 }}>{broadcast.message}</div>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <Link
          href={`/rides/${broadcast.rideId}`}
          style={{ fontSize: 12, fontWeight: 800, color: 'var(--accent)', textDecoration: 'none' }}
        >
          Open ride →
        </Link>
        <button
          type="button"
          onClick={() => {
            clearRollOutBroadcast()
            setBroadcast(null)
          }}
          style={{
            marginLeft: 'auto',
            border: 'none',
            background: 'transparent',
            color: 'var(--muted)',
            fontSize: 11,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Dismiss
        </button>
      </div>
    </div>
  )
}
