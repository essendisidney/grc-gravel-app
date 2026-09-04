'use client'

import { getDustMaskTip } from '@/lib/localStore'

export default function DustMaskTip() {
  const tip = getDustMaskTip()
  if (!tip.show) return null

  return (
    <div className="surface" style={{ padding: 14, marginBottom: 14 }}>
      <div className="eyebrow" style={{ marginBottom: 6 }}>Kit cue</div>
      <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 4 }}>{tip.title}</div>
      <p style={{ margin: 0, fontSize: 13, color: 'var(--muted)', lineHeight: 1.45 }}>{tip.body}</p>
    </div>
  )
}
