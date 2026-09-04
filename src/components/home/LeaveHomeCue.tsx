'use client'

import { Car } from 'lucide-react'
import { getLeaveHomeCue } from '@/lib/localStore'

export default function LeaveHomeCue({ startTime }: { startTime: string }) {
  const cue = getLeaveHomeCue(startTime)

  return (
    <div className="surface" style={{ padding: 14, marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <Car size={16} color="var(--accent)" />
        <div className="eyebrow" style={{ margin: 0 }}>Leave home</div>
      </div>
      <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 4 }}>By {cue.leaveBy}</div>
      <p style={{ margin: 0, fontSize: 13, color: 'var(--muted)', lineHeight: 1.45 }}>{cue.tip}</p>
    </div>
  )
}
