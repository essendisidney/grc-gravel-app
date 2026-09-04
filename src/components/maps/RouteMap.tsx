'use client'

import { useMemo } from 'react'
import { waypointsToSvgPath } from '@/lib/gpx'

export default function RouteMap({
  routeId,
  height = 180,
  dark = false,
}: {
  routeId: string
  height?: number
  dark?: boolean
}) {
  const { d, start, end } = useMemo(() => waypointsToSvgPath(routeId), [routeId])
  const ink = dark ? 'rgba(255,252,250,0.15)' : 'rgba(20,18,16,0.08)'
  const line = dark ? '#E07A2F' : '#E07A2F'
  const dot = dark ? '#FFFCFA' : '#141210'

  return (
    <div
      style={{
        height,
        borderRadius: 18,
        overflow: 'hidden',
        background: dark
          ? 'linear-gradient(160deg, #1C1916, #0E0C0A)'
          : 'linear-gradient(160deg, #F7F1E8, #EDE6DC)',
        border: dark ? '1px solid rgba(255,255,255,0.08)' : '1px solid var(--line)',
        position: 'relative',
      }}
    >
      <svg viewBox="0 0 100 100" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
        {/* faint topo grid */}
        {[20, 40, 60, 80].map(v => (
          <g key={v}>
            <line x1={v} y1="0" x2={v} y2="100" stroke={ink} strokeWidth="0.3" />
            <line x1="0" y1={v} x2="100" y2={v} stroke={ink} strokeWidth="0.3" />
          </g>
        ))}
        <path
          d={d}
          fill="none"
          stroke={line}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ filter: 'drop-shadow(0 0 4px rgba(224,122,47,0.35))' }}
        />
        <circle cx={start[0]} cy={start[1]} r="2.4" fill={dot} />
        <circle cx={start[0]} cy={start[1]} r="4.2" fill="none" stroke={line} strokeWidth="0.8" opacity="0.7" />
        <circle cx={end[0]} cy={end[1]} r="2.4" fill={line} />
      </svg>
      <div
        style={{
          position: 'absolute',
          left: 10,
          bottom: 8,
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: dark ? 'rgba(255,255,255,0.45)' : 'var(--muted)',
        }}
      >
        Corridor map · demo
      </div>
    </div>
  )
}
