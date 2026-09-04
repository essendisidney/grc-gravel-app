'use client'

import { useState } from 'react'
import { Wrench } from 'lucide-react'
import { addGearOffer, claimGear, getGearBoard, getSession, type GearOffer } from '@/lib/localStore'

export default function GearBorrowBoard() {
  const [items, setItems] = useState<GearOffer[]>(() => getGearBoard())
  const [item, setItem] = useState('')
  const [note, setNote] = useState('')

  function offer() {
    if (!item.trim()) return
    const next = addGearOffer({
      id: `gear_${Date.now()}`,
      item: item.trim(),
      fromName: getSession()?.fullName || 'Club member',
      note: note.trim() || 'At clubhouse',
      available: true,
      createdAt: new Date().toISOString(),
    })
    setItems(next)
    setItem('')
    setNote('')
  }

  return (
    <div className="surface" style={{ padding: 14, marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <Wrench size={16} color="var(--accent)" />
        <div style={{ fontWeight: 800, fontSize: 14 }}>Gear borrow board</div>
      </div>
      <p style={{ margin: '0 0 12px', fontSize: 12, color: 'var(--muted)', lineHeight: 1.4 }}>
        Tubes, lights, pumps — lend before Saturday. Demo only on this phone.
      </p>
      {items.map(g => (
        <div
          key={g.id}
          style={{
            padding: '10px 0',
            borderTop: '1px solid var(--line)',
            display: 'flex',
            justifyContent: 'space-between',
            gap: 10,
            alignItems: 'center',
          }}
        >
          <div>
            <div style={{ fontWeight: 700, fontSize: 13 }}>{g.item}</div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
              {g.fromName.split(' ')[0]} · {g.note}
            </div>
          </div>
          {g.available ? (
            <button
              type="button"
              className="chip accent"
              style={{ border: 'none', cursor: 'pointer', flexShrink: 0 }}
              onClick={() => setItems(claimGear(g.id))}
            >
              Claim
            </button>
          ) : (
            <span className="chip" style={{ border: 'none', flexShrink: 0, opacity: 0.7 }}>
              Taken
            </span>
          )}
        </div>
      ))}
      <input
        className="grc-input"
        value={item}
        onChange={e => setItem(e.target.value)}
        placeholder="What can you lend?"
        style={{ marginTop: 12, marginBottom: 8 }}
      />
      <input
        className="grc-input"
        value={note}
        onChange={e => setNote(e.target.value)}
        placeholder="Where / when"
        style={{ marginBottom: 10 }}
      />
      <button type="button" className="btn-secondary" onClick={offer}>
        Post offer
      </button>
    </div>
  )
}
