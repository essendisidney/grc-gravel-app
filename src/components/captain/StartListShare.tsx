'use client'

import { useState } from 'react'
import { Copy, Share2 } from 'lucide-react'
import { startListText } from '@/lib/localStore'

export default function StartListShare({
  rideId,
  title,
}: {
  rideId: string
  title: string
}) {
  const [status, setStatus] = useState('')

  async function copy() {
    const text = startListText(rideId, title)
    try {
      await navigator.clipboard.writeText(text)
      setStatus('Copied')
    } catch {
      setStatus('Copy failed — select manually')
    }
    setTimeout(() => setStatus(''), 2000)
  }

  async function share() {
    const text = startListText(rideId, title)
    if (navigator.share) {
      try {
        await navigator.share({ title: `GRC · ${title}`, text })
        setStatus('Shared')
        setTimeout(() => setStatus(''), 2000)
        return
      } catch {
        /* fall through */
      }
    }
    await copy()
  }

  return (
    <div className="surface" style={{ padding: 14, marginBottom: 16 }}>
      <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 6 }}>Start list</div>
      <p style={{ margin: '0 0 12px', fontSize: 12, color: 'var(--muted)', lineHeight: 1.4 }}>
        Copy for WhatsApp captains group — present / absent from gate roll call.
      </p>
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={copy}>
          <Copy size={16} /> {status === 'Copied' ? 'Copied' : 'Copy'}
        </button>
        <button type="button" className="btn-primary" style={{ flex: 1 }} onClick={share}>
          <Share2 size={16} /> Share
        </button>
      </div>
    </div>
  )
}
