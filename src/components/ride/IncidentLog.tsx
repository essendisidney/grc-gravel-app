'use client'

import { useState } from 'react'
import { Wrench } from 'lucide-react'
import { addIncident, getIncidents, getSession, type RideIncident } from '@/lib/localStore'

const TYPES: { id: RideIncident['type']; label: string }[] = [
  { id: 'puncture', label: 'Puncture' },
  { id: 'mechanical', label: 'Mech' },
  { id: 'medical', label: 'Medical' },
  { id: 'other', label: 'Other' },
]

export default function IncidentLog({ rideId, kmEst }: { rideId: string; kmEst: number }) {
  const [items, setItems] = useState<RideIncident[]>(() => getIncidents(rideId))
  const [type, setType] = useState<RideIncident['type']>('puncture')
  const [note, setNote] = useState('')
  const [open, setOpen] = useState(false)

  function log() {
    const next = addIncident({
      id: `inc_${Date.now()}`,
      rideId,
      type,
      note: note.trim() || TYPES.find(t => t.id === type)?.label || 'Incident',
      kmEst: Math.round(kmEst * 10) / 10,
      createdAt: new Date().toISOString(),
      name: getSession()?.fullName || 'Rider',
    })
    setItems(next)
    setNote('')
    setOpen(false)
  }

  return (
    <div
      style={{
        borderRadius: 14,
        padding: 12,
        background: 'rgba(255,252,250,0.06)',
        border: '1px solid rgba(255,255,255,0.08)',
        marginBottom: 14,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Wrench size={14} color="#FEC72E" />
          <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Incident log
          </span>
        </div>
        <button
          type="button"
          onClick={() => setOpen(v => !v)}
          style={{
            border: 'none',
            background: 'rgba(254,199,46,0.18)',
            color: '#FEC72E',
            borderRadius: 999,
            padding: '6px 10px',
            fontSize: 11,
            fontWeight: 800,
            cursor: 'pointer',
          }}
        >
          {open ? 'Close' : '+ Log'}
        </button>
      </div>
      {open && (
        <div style={{ marginBottom: 10 }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
            {TYPES.map(t => (
              <button
                key={t.id}
                type="button"
                onClick={() => setType(t.id)}
                style={{
                  border: 'none',
                  borderRadius: 999,
                  padding: '6px 10px',
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: type === t.id ? 'rgba(254,199,46,0.28)' : 'rgba(255,255,255,0.08)',
                  color: type === t.id ? '#FEC72E' : 'rgba(255,255,255,0.7)',
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
          <input
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="What happened?"
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '10px 12px',
              borderRadius: 10,
              border: '1px solid rgba(255,255,255,0.12)',
              background: 'rgba(0,0,0,0.25)',
              color: '#fff',
              marginBottom: 8,
              fontFamily: 'inherit',
              fontSize: 13,
            }}
          />
          <button
            type="button"
            onClick={log}
            style={{
              width: '100%',
              border: 'none',
              borderRadius: 12,
              padding: 12,
              background: '#FEC72E',
              color: '#1A1500',
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            Save at ~{Math.round(kmEst)} km
          </button>
        </div>
      )}
      {items.length === 0 ? (
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>No incidents this ride.</div>
      ) : (
        items.slice(0, 4).map(i => (
          <div
            key={i.id}
            style={{
              padding: '8px 0',
              borderTop: '1px solid rgba(255,255,255,0.08)',
              fontSize: 12,
              display: 'flex',
              justifyContent: 'space-between',
              gap: 8,
            }}
          >
            <span>
              <strong style={{ textTransform: 'capitalize' }}>{i.type}</strong> · {i.note}
            </span>
            <span style={{ color: 'rgba(255,255,255,0.45)', flexShrink: 0 }}>{i.kmEst} km</span>
          </div>
        ))
      )}
    </div>
  )
}
