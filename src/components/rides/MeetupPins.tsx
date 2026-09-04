'use client'

import { MapPin } from 'lucide-react'
import { getMeetupPins } from '@/lib/localStore'

export default function MeetupPins({ rideId }: { rideId: string }) {
  const pins = getMeetupPins(rideId)

  return (
    <div className="surface" style={{ padding: 14, marginBottom: 14 }}>
      <div className="section-label" style={{ marginBottom: 10 }}>Meetup pins</div>
      {pins.map((p, i) => (
        <div
          key={p.id}
          style={{
            display: 'flex',
            gap: 10,
            padding: '10px 0',
            borderTop: i === 0 ? 'none' : '1px solid var(--line)',
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 10,
              background: i === 0 ? 'var(--accent)' : 'var(--bg)',
              color: i === 0 ? 'var(--accent-ink)' : 'var(--ink)',
              display: 'grid',
              placeItems: 'center',
              flexShrink: 0,
            }}
          >
            <MapPin size={14} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 800, fontSize: 13 }}>
              {p.name}
              <span style={{ color: 'var(--muted)', fontWeight: 600 }}> · km {p.km}</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{p.note}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
