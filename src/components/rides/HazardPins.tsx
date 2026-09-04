'use client'

import { useState } from 'react'
import { TriangleAlert } from 'lucide-react'
import { addHazard, getHazards, getSession, type HazardPin } from '@/lib/localStore'

const KINDS: { id: HazardPin['kind']; label: string }[] = [
  { id: 'pothole', label: 'Pothole' },
  { id: 'gravel', label: 'Corrugation' },
  { id: 'cattle', label: 'Cattle' },
  { id: 'other', label: 'Other' },
]

export default function HazardPins({ rideId }: { rideId: string }) {
  const [items, setItems] = useState<HazardPin[]>(() => getHazards(rideId))
  const [kind, setKind] = useState<HazardPin['kind']>('pothole')
  const [note, setNote] = useState('')
  const [km, setKm] = useState('30')

  function add() {
    const next = addHazard({
      id: `hz_${Date.now()}`,
      rideId,
      kind,
      note: note.trim() || KINDS.find(k => k.id === kind)?.label || 'Hazard',
      kmApprox: Math.max(0, Number(km) || 0),
      name: getSession()?.fullName || 'Rider',
      createdAt: new Date().toISOString(),
    })
    setItems(next)
    setNote('')
  }

  return (
    <div className="surface" style={{ padding: 14, marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <TriangleAlert size={16} color="var(--warn)" />
        <div className="section-label" style={{ margin: 0 }}>
          Hazard pins
        </div>
      </div>
      <p style={{ margin: '0 0 10px', fontSize: 12, color: 'var(--muted)', lineHeight: 1.4 }}>
        Flag potholes, cattle, deep gravel for the next group.
      </p>
      {items.slice(0, 5).map(h => (
        <div
          key={h.id}
          style={{
            padding: '8px 0',
            borderTop: '1px solid var(--line)',
            fontSize: 12,
            display: 'flex',
            justifyContent: 'space-between',
            gap: 8,
          }}
        >
          <span>
            <strong style={{ textTransform: 'capitalize' }}>{h.kind}</strong> · {h.note}
          </span>
          <span style={{ color: 'var(--muted)', flexShrink: 0 }}>{h.kmApprox} km</span>
        </div>
      ))}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', margin: '10px 0' }}>
        {KINDS.map(k => (
          <button
            key={k.id}
            type="button"
            className={kind === k.id ? 'chip accent' : 'chip'}
            style={{ border: 'none', cursor: 'pointer' }}
            onClick={() => setKind(k.id)}
          >
            {k.label}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <input
          className="grc-input"
          value={km}
          onChange={e => setKm(e.target.value)}
          placeholder="Km"
          inputMode="decimal"
          style={{ width: 72, flexShrink: 0 }}
        />
        <input
          className="grc-input"
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="What to watch for"
          style={{ flex: 1 }}
        />
      </div>
      <button type="button" className="btn-secondary" onClick={add}>
        Drop pin
      </button>
    </div>
  )
}
