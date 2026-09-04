'use client'

import { Signal } from 'lucide-react'
import { getSignalDeadZones } from '@/lib/localStore'

export default function SignalDeadZones({ routeId }: { routeId: string }) {
  const zones = getSignalDeadZones(routeId)

  return (
    <div className="surface" style={{ padding: 14, marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <Signal size={16} color="var(--warn)" />
        <div className="section-label" style={{ margin: 0 }}>
          Signal dead zones
        </div>
      </div>
      <p style={{ margin: '0 0 10px', fontSize: 12, color: 'var(--muted)', lineHeight: 1.4 }}>
        Save the offline pack before these stretches.
      </p>
      {zones.map(z => (
        <div
          key={z.id}
          style={{
            padding: '10px 0',
            borderTop: '1px solid var(--line)',
            display: 'flex',
            justifyContent: 'space-between',
            gap: 10,
          }}
        >
          <div>
            <div style={{ fontWeight: 800, fontSize: 13 }}>{z.name}</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2, lineHeight: 1.4 }}>{z.note}</div>
          </div>
          <div style={{ fontWeight: 800, fontSize: 12, flexShrink: 0, color: 'var(--warn)' }}>
            {z.fromKm}–{z.toKm} km
          </div>
        </div>
      ))}
    </div>
  )
}
