'use client'

import { ThermometerSun, Wind } from 'lucide-react'
import { getHeatWindAdvisory } from '@/lib/localStore'

export default function HeatWindAdvisory() {
  const a = getHeatWindAdvisory()

  return (
    <div className="surface" style={{ padding: 14, marginBottom: 14 }}>
      <div className="eyebrow" style={{ marginBottom: 8 }}>Heat & wind</div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
        <div style={{ flex: 1, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
          <ThermometerSun size={16} color="var(--warn)" style={{ marginTop: 2 }} />
          <div>
            <div style={{ fontWeight: 800, fontSize: 13, textTransform: 'capitalize' }}>{a.heat.level} heat</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2, lineHeight: 1.4 }}>{a.heat.note}</div>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', paddingTop: 10, borderTop: '1px solid var(--line)' }}>
        <Wind size={16} color="var(--accent)" style={{ marginTop: 2 }} />
        <div>
          <div style={{ fontWeight: 800, fontSize: 13, textTransform: 'capitalize' }}>{a.wind.level} wind</div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2, lineHeight: 1.4 }}>{a.wind.note}</div>
        </div>
      </div>
      <div style={{ marginTop: 10, fontSize: 12, fontWeight: 700, color: 'var(--accent-ink)' }}>{a.tip}</div>
    </div>
  )
}
