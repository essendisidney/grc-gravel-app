'use client'

import { useMemo } from 'react'
import { elevationProfile } from '@/lib/gpx'

export default function ElevationProfile({
  routeId,
  height = 110,
}: {
  routeId: string
  height?: number
}) {
  const { d, area, min, max, gain } = useMemo(() => elevationProfile(routeId), [routeId])

  return (
    <div
      style={{
        height,
        borderRadius: 16,
        overflow: 'hidden',
        background: 'linear-gradient(180deg, #FFF8F1, #F3EFE8)',
        border: '1px solid var(--line)',
        position: 'relative',
      }}
    >
      <svg viewBox="0 0 100 100" width="100%" height="100%" preserveAspectRatio="none">
        <path d={area} fill="rgba(254,199,46,0.16)" />
        <path d={d} fill="none" stroke="#FEC72E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      </svg>
      <div
        style={{
          position: 'absolute',
          left: 10,
          top: 8,
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--muted)',
        }}
      >
        Elevation
      </div>
      <div
        style={{
          position: 'absolute',
          right: 10,
          top: 8,
          fontSize: 11,
          fontWeight: 800,
          color: 'var(--ink)',
        }}
      >
        {min}–{max} m · ~{gain} m Δ
      </div>
    </div>
  )
}
