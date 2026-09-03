'use client'

import { useState } from 'react'
import { getInitials } from '@/lib/utils'

export default function Leaderboard({ initialResults, isLive }: { raceEventId: string; initialResults: any[]; isLive: boolean }) {
  const [results] = useState(initialResults)

  if (!results.length) {
    return (
      <div style={{ background: '#1A1E2A', borderRadius: 14, border: '1px solid #1E2436', padding: 20, textAlign: 'center', color: '#8892A4', fontSize: 14 }}>
        Results land here after Full Gas. Live timing comes with the database.
      </div>
    )
  }

  return (
    <div>
      {isLive && <div style={{ fontSize: 11, color: '#22C55E', fontWeight: 700, marginBottom: 10 }}>LIVE</div>}
      {results.map((row: any, i: number) => (
        <div key={row.id || i} style={{ display: 'flex', gap: 10, padding: 10, background: '#1A1E2A', borderRadius: 10, marginBottom: 6 }}>
          <div style={{ width: 28, fontWeight: 800, color: '#F5C518' }}>{row.finish_position}</div>
          <div style={{
            width: 32, height: 32, borderRadius: '50%', background: '#252B3B',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700,
          }}>
            {getInitials(row.profiles?.full_name || 'GRC')}
          </div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>{row.profiles?.full_name}</div>
        </div>
      ))}
    </div>
  )
}
