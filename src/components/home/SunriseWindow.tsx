'use client'

import { getSunriseWindow } from '@/lib/localStore'

export default function SunriseWindow({ startTime }: { startTime: string }) {
  const w = getSunriseWindow(startTime)

  return (
    <div className="surface" style={{ padding: 14, marginBottom: 14 }}>
      <div className="eyebrow" style={{ marginBottom: 6, color: 'var(--accent)' }}>Light window</div>
      <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 4 }}>{w.label}</div>
      <p style={{ margin: 0, fontSize: 13, color: 'var(--muted)', lineHeight: 1.45 }}>{w.tip}</p>
    </div>
  )
}
