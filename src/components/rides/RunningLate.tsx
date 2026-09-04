'use client'

import { useState } from 'react'
import { Clock } from 'lucide-react'
import { addLatePing, getLatePings, getSession, type LatePing } from '@/lib/localStore'

const ETAS = [5, 10, 15, 20]

export default function RunningLate({ rideId }: { rideId: string }) {
  const [pings, setPings] = useState<LatePing[]>(() => getLatePings(rideId))
  const [eta, setEta] = useState(10)
  const [note, setNote] = useState('')
  const [sent, setSent] = useState(false)

  function send() {
    const name = getSession()?.fullName || 'You'
    const next = addLatePing({
      id: `late_${Date.now()}`,
      rideId,
      name,
      etaMin: eta,
      note: note.trim() || 'Traffic / coffee run',
      createdAt: new Date().toISOString(),
    })
    setPings(next)
    setNote('')
    setSent(true)
    setTimeout(() => setSent(false), 2200)
  }

  return (
    <div className="surface" style={{ padding: 14, marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <Clock size={16} color="var(--warn)" />
        <div className="section-label" style={{ margin: 0 }}>
          Running late
        </div>
      </div>
      <p style={{ margin: '0 0 10px', fontSize: 12, color: 'var(--muted)', lineHeight: 1.4 }}>
        Ping the pack so captains know you’re en route — demo stays on this device.
      </p>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
        {ETAS.map(m => (
          <button
            key={m}
            type="button"
            className={eta === m ? 'chip accent' : 'chip'}
            style={{ border: 'none', cursor: 'pointer' }}
            onClick={() => setEta(m)}
          >
            +{m} min
          </button>
        ))}
      </div>
      <input
        className="grc-input"
        value={note}
        onChange={e => setNote(e.target.value)}
        placeholder="Optional note"
        style={{ marginBottom: 10 }}
      />
      <button type="button" className="btn-secondary" onClick={send}>
        {sent ? 'Ping sent' : 'Tell the pack'}
      </button>
      {pings.length > 0 && (
        <div style={{ marginTop: 12 }}>
          {pings.slice(0, 4).map(p => (
            <div
              key={p.id}
              style={{
                padding: '8px 0',
                borderTop: '1px solid var(--line)',
                fontSize: 12,
                display: 'flex',
                justifyContent: 'space-between',
                gap: 8,
              }}
            >
              <span>
                <strong>{p.name.split(' ')[0]}</strong> · {p.note}
              </span>
              <span className="chip" style={{ border: 'none', flexShrink: 0 }}>
                +{p.etaMin}m
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
