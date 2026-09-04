'use client'

import { Camera } from 'lucide-react'

export default function PackPhotoReminder({ title }: { title: string }) {
  return (
    <div
      className="surface"
      style={{
        padding: 14,
        marginBottom: 14,
        border: '1px solid rgba(254,199,46,0.35)',
        background: 'var(--accent-soft)',
      }}
    >
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <Camera size={18} color="var(--accent)" style={{ marginTop: 2, flexShrink: 0 }} />
        <div>
          <div style={{ fontWeight: 800, fontSize: 14 }}>Pack photo</div>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--muted)', lineHeight: 1.45 }}>
            Grab the {title} group shot before everyone scatters — post it to Club news with the share button below.
          </p>
        </div>
      </div>
    </div>
  )
}
