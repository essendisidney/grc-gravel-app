'use client'

import { Mountain } from 'lucide-react'
import { getClimbSegments } from '@/lib/localStore'

export default function ClimbSegments({ routeId }: { routeId: string }) {
  const segs = getClimbSegments(routeId)

  return (
    <div className="surface" style={{ padding: 14, marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <Mountain size={16} color="var(--accent)" />
        <div className="section-label" style={{ margin: 0 }}>
          Climb segments
        </div>
      </div>
      <p style={{ margin: '0 0 10px', fontSize: 12, color: 'var(--muted)', lineHeight: 1.4 }}>
        Know where the walls are before you roll.
      </p>
      {segs.map(s => (
        <div
          key={s.id}
          style={{
            padding: '10px 0',
            borderTop: '1px solid var(--line)',
            display: 'flex',
            justifyContent: 'space-between',
            gap: 10,
          }}
        >
          <div>
            <div style={{ fontWeight: 800, fontSize: 13 }}>{s.name}</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2, lineHeight: 1.4 }}>{s.note}</div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>
              {s.fromKm}–{s.toKm} km
            </div>
          </div>
          <div style={{ fontWeight: 800, fontSize: 14, flexShrink: 0 }}>+{s.gainM} m</div>
        </div>
      ))}
    </div>
  )
}
