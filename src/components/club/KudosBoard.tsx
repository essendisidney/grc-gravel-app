'use client'

import { useEffect, useState } from 'react'
import { HandMetal } from 'lucide-react'
import { addKudos, getKudos, getSession, type Kudos } from '@/lib/localStore'
import { DEMO_MEMBERS } from '@/lib/demo'

export default function KudosBoard() {
  const [items, setItems] = useState<Kudos[]>([])
  const [open, setOpen] = useState(false)
  const [toName, setToName] = useState(DEMO_MEMBERS[1]?.full_name || 'Amina Otieno')
  const [message, setMessage] = useState('Pulled hard on the Magadi flats. Asante.')

  useEffect(() => {
    setItems(getKudos())
  }, [])

  function send() {
    if (!message.trim() || !toName.trim()) return
    const session = getSession()
    const next = addKudos({
      id: `k_${Date.now()}`,
      toName: toName.trim(),
      fromName: session?.fullName || 'GRC rider',
      message: message.trim(),
      createdAt: new Date().toISOString(),
    })
    setItems(next)
    setOpen(false)
    setMessage('')
  }

  return (
    <div className="surface" style={{ padding: 14, marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div className="section-label" style={{ margin: 0 }}>
          <HandMetal size={12} style={{ display: 'inline', verticalAlign: -1, marginRight: 4 }} />
          Pack kudos
        </div>
        <button
          type="button"
          className="chip accent"
          style={{ border: 'none', cursor: 'pointer' }}
          onClick={() => setOpen(v => !v)}
        >
          Send
        </button>
      </div>

      {open && (
        <div style={{ marginBottom: 12, padding: 12, background: 'var(--bg)', borderRadius: 12 }}>
          <div className="section-label" style={{ marginBottom: 6 }}>To</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
            {DEMO_MEMBERS.slice(0, 6).map(m => (
              <button
                key={m.id}
                type="button"
                className={toName === m.full_name ? 'chip accent' : 'chip'}
                style={{ border: 'none', cursor: 'pointer' }}
                onClick={() => setToName(m.full_name)}
              >
                {m.full_name.split(' ')[0]}
              </button>
            ))}
          </div>
          <textarea
            className="grc-input"
            rows={2}
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Shoutout…"
            style={{ resize: 'none', marginBottom: 8 }}
          />
          <button type="button" className="btn-primary" onClick={send}>
            Post kudos
          </button>
        </div>
      )}

      {items.slice(0, 4).map(k => (
        <div key={k.id} style={{ padding: '10px 0', borderTop: '1px solid var(--line)' }}>
          <div style={{ fontSize: 13, fontWeight: 800 }}>
            {k.fromName} → {k.toName}
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4, lineHeight: 1.4 }}>{k.message}</div>
        </div>
      ))}
    </div>
  )
}
