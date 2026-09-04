'use client'

import { useState } from 'react'
import { getFavoritePaceId, setFavoritePaceId } from '@/lib/localStore'

const PACES = [
  { id: 'fast', label: 'Fast', hint: '~27 km/h' },
  { id: 'cruiser', label: 'Cruiser', hint: '~21 km/h' },
  { id: 'social', label: 'Social', hint: '~17 km/h' },
]

export default function FavoritePacePicker() {
  const [pace, setPace] = useState(() => getFavoritePaceId())

  return (
    <div className="surface" style={{ padding: 14, marginBottom: 16 }}>
      <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 6 }}>Default pace group</div>
      <p style={{ margin: '0 0 10px', fontSize: 12, color: 'var(--muted)', lineHeight: 1.4 }}>
        Pre-selects when you join rides on this device.
      </p>
      <div style={{ display: 'flex', gap: 6 }}>
        {PACES.map(p => (
          <button
            key={p.id}
            type="button"
            onClick={() => setPace(setFavoritePaceId(p.id))}
            className={pace === p.id ? 'chip accent' : 'chip'}
            style={{ border: 'none', cursor: 'pointer', flex: 1, justifyContent: 'center', flexDirection: 'column', gap: 2 }}
          >
            <span style={{ fontWeight: 800 }}>{p.label}</span>
            <span style={{ fontSize: 9, opacity: 0.75 }}>{p.hint}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
