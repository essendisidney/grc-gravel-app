'use client'

import { getRideDelayMin } from '@/lib/localStore'

export default function DelayBanner({ rideId }: { rideId: string }) {
  const delay = getRideDelayMin(rideId)
  if (!delay) return null

  return (
    <div
      style={{
        margin: '0 14px 12px',
        padding: 12,
        borderRadius: 14,
        background: 'rgba(196,122,18,0.12)',
        border: '1px solid rgba(196,122,18,0.35)',
        fontSize: 13,
        fontWeight: 700,
        color: 'var(--warn)',
      }}
    >
      Gate delayed +{delay} min — stay ready, don’t leave early.
    </div>
  )
}
