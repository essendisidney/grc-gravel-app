'use client'

import { Droplets, Cookie } from 'lucide-react'

/** Rough fuel plan for Kenyan gravel — demo heuristics */
export default function FuelPlanner({
  distanceKm,
  elevationM,
  estHours,
}: {
  distanceKm: number
  elevationM: number
  estHours?: string
}) {
  const hoursMatch = (estHours || '').match(/(\d+(?:\.\d+)?)\s*h/i)
  const minsMatch = (estHours || '').match(/(\d+)\s*m/i)
  const hours =
    (hoursMatch ? parseFloat(hoursMatch[1]) : 0) +
      (minsMatch ? parseInt(minsMatch[1], 10) / 60 : 0) ||
    Math.max(2, distanceKm / 18)
  const bottles = Math.max(2, Math.ceil(hours * 0.75 + elevationM / 800))
  const bars = Math.max(1, Math.ceil(hours * 0.9))
  const waterL = Math.round(bottles * 0.75 * 10) / 10
  const salt = hours >= 3 || elevationM >= 600

  return (
    <div className="surface" style={{ padding: 14, marginBottom: 14 }}>
      <div className="section-label" style={{ marginBottom: 10 }}>Fuel plan · demo</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
        <div style={{ padding: 12, borderRadius: 12, background: 'var(--bg)' }}>
          <Droplets size={16} color="var(--accent-ink)" style={{ marginBottom: 6 }} />
          <div style={{ fontSize: 18, fontWeight: 800 }}>{bottles}</div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
            bottles (~{waterL} L)
          </div>
        </div>
        <div style={{ padding: 12, borderRadius: 12, background: 'var(--bg)' }}>
          <Cookie size={16} color="var(--accent-ink)" style={{ marginBottom: 6 }} />
          <div style={{ fontSize: 18, fontWeight: 800 }}>{bars}</div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>bars / bananas</div>
        </div>
      </div>
      <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.45 }}>
        ~{hours.toFixed(1)} h on course · {distanceKm} km · {elevationM} m ↑.
        {salt ? ' Pack salt tabs — Magadi heat + climb.' : ' Standard snack kit is enough.'}
      </div>
    </div>
  )
}
