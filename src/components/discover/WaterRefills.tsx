'use client'

import { Droplets } from 'lucide-react'
import { getWaterRefills } from '@/lib/localStore'

export default function WaterRefills({ routeId }: { routeId: string }) {
  const points = getWaterRefills(routeId)

  return (
    <div className="surface" style={{ padding: 14, marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <Droplets size={16} color="var(--accent)" />
        <div className="section-label" style={{ margin: 0 }}>
          Water & refill
        </div>
      </div>
      <p style={{ margin: '0 0 10px', fontSize: 12, color: 'var(--muted)', lineHeight: 1.4 }}>
        Plan bottles before Magadi flats — unreliable pumps marked.
      </p>
      {points.map(p => (
        <div
          key={p.id}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 10,
            padding: '10px 0',
            borderTop: '1px solid var(--line)',
          }}
        >
          <div>
            <div style={{ fontWeight: 800, fontSize: 13 }}>{p.name}</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2, lineHeight: 1.4 }}>{p.note}</div>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontWeight: 800, fontSize: 13 }}>{p.km} km</div>
            <span
              className="chip"
              style={{
                border: 'none',
                marginTop: 4,
                background: p.reliable ? 'rgba(47,125,75,0.12)' : 'rgba(196,122,18,0.12)',
                color: p.reliable ? 'var(--good)' : 'var(--warn)',
              }}
            >
              {p.reliable ? 'Reliable' : 'Check'}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
