'use client'

import { useMemo, useState } from 'react'
import { Gauge } from 'lucide-react'
import { suggestPsi } from '@/lib/localStore'

export default function TirePsiGuide({ tireMm = 40 }: { tireMm?: number }) {
  const [kg, setKg] = useState(75)
  const tip = useMemo(() => suggestPsi(tireMm, kg), [tireMm, kg])

  return (
    <div className="surface" style={{ padding: 14, marginBottom: 14 }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 12 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 12,
            background: 'var(--accent-soft)',
            display: 'grid',
            placeItems: 'center',
            flexShrink: 0,
          }}
        >
          <Gauge size={16} color="var(--accent-ink)" />
        </div>
        <div>
          <div className="section-label" style={{ marginBottom: 4 }}>Tire PSI · demo</div>
          <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.4 }}>
            Starting pressures for {tireMm} mm gravel — tweak on dust.
          </div>
        </div>
      </div>
      <div className="section-label" style={{ marginBottom: 6 }}>Rider weight · {kg} kg</div>
      <input
        type="range"
        min={55}
        max={100}
        value={kg}
        onChange={e => setKg(Number(e.target.value))}
        style={{ width: '100%', accentColor: 'var(--accent)', marginBottom: 12 }}
      />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <div style={{ padding: 12, borderRadius: 12, background: 'var(--bg)', textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: 'var(--muted)' }}>Front</div>
          <div style={{ fontSize: 22, fontWeight: 800 }}>{tip.front}</div>
          <div style={{ fontSize: 11, color: 'var(--muted)' }}>psi</div>
        </div>
        <div style={{ padding: 12, borderRadius: 12, background: 'var(--bg)', textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: 'var(--muted)' }}>Rear</div>
          <div style={{ fontSize: 22, fontWeight: 800 }}>{tip.rear}</div>
          <div style={{ fontSize: 11, color: 'var(--muted)' }}>psi</div>
        </div>
      </div>
      <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 10, lineHeight: 1.4 }}>{tip.note}</div>
    </div>
  )
}
