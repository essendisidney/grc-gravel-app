'use client'

import { useState } from 'react'
import { getHomeClubhouse, setHomeClubhouse, type HomeClubhouse } from '@/lib/localStore'

const HOUSES: { id: HomeClubhouse; label: string; hint: string }[] = [
  { id: 'tena', label: 'Tena', hint: 'Magadi roll-outs · The Gravel' },
  { id: 'utawala', label: 'Utawala', hint: 'Full Gas · Kibiku' },
]

export default function HomeClubhousePicker() {
  const [house, setHouse] = useState<HomeClubhouse>(() => getHomeClubhouse())

  return (
    <div className="surface" style={{ padding: 14, marginBottom: 14 }}>
      <div className="eyebrow" style={{ marginBottom: 8 }}>Home clubhouse</div>
      <div style={{ display: 'flex', gap: 8 }}>
        {HOUSES.map(h => (
          <button
            key={h.id}
            type="button"
            onClick={() => setHouse(setHomeClubhouse(h.id))}
            className="pressable"
            style={{
              flex: 1,
              padding: 12,
              borderRadius: 12,
              border: `1px solid ${house === h.id ? 'rgba(254,199,46,0.55)' : 'var(--line)'}`,
              background: house === h.id ? 'var(--accent-soft)' : 'var(--bg)',
              cursor: 'pointer',
              fontFamily: 'var(--font)',
              color: 'var(--ink)',
              textAlign: 'left',
            }}
          >
            <div style={{ fontWeight: 800, fontSize: 14 }}>{h.label}</div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 3, lineHeight: 1.35 }}>{h.hint}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
