'use client'

import { useEffect, useState } from 'react'
import { Car, Plus } from 'lucide-react'
import {
  addCarpool,
  getCarpool,
  getSession,
  type CarpoolOffer,
} from '@/lib/localStore'

export default function CarpoolBoard({ rideId }: { rideId: string }) {
  const [offers, setOffers] = useState<CarpoolOffer[]>([])
  const [open, setOpen] = useState(false)
  const [role, setRole] = useState<'offer' | 'need'>('offer')
  const [fromArea, setFromArea] = useState('Tena')
  const [seats, setSeats] = useState('2')
  const [note, setNote] = useState('')

  useEffect(() => {
    setOffers(getCarpool(rideId))
  }, [rideId])

  function post() {
    if (!fromArea.trim()) return
    const session = getSession()
    const next = addCarpool({
      id: `cp_${Date.now()}`,
      rideId,
      name: session?.fullName || 'GRC rider',
      role,
      seats: Number(seats) || 1,
      fromArea: fromArea.trim(),
      note: note.trim() || (role === 'offer' ? 'Leaving early — ping me.' : 'Need a seat.'),
      phone: session?.phone,
      createdAt: new Date().toISOString(),
    })
    setOffers(next)
    setOpen(false)
    setNote('')
  }

  return (
    <div className="surface" style={{ padding: 14, marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div className="section-label" style={{ margin: 0 }}>
          <Car size={12} style={{ display: 'inline', verticalAlign: -1, marginRight: 4 }} />
          Carpool / lifts
        </div>
        <button
          type="button"
          className="chip accent"
          style={{ border: 'none', cursor: 'pointer' }}
          onClick={() => setOpen(v => !v)}
        >
          <Plus size={12} /> Post
        </button>
      </div>

      {open && (
        <div style={{ marginBottom: 12, padding: 12, background: 'var(--bg)', borderRadius: 12 }}>
          <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
            {(['offer', 'need'] as const).map(r => (
              <button
                key={r}
                type="button"
                className={role === r ? 'chip accent' : 'chip'}
                style={{ border: 'none', cursor: 'pointer', textTransform: 'capitalize' }}
                onClick={() => setRole(r)}
              >
                {r === 'offer' ? 'Offer seats' : 'Need a lift'}
              </button>
            ))}
          </div>
          <input
            className="grc-input"
            placeholder="From area"
            value={fromArea}
            onChange={e => setFromArea(e.target.value)}
            style={{ marginBottom: 8 }}
          />
          {role === 'offer' && (
            <input
              className="grc-input"
              type="number"
              min={1}
              max={4}
              placeholder="Seats"
              value={seats}
              onChange={e => setSeats(e.target.value)}
              style={{ marginBottom: 8 }}
            />
          )}
          <input
            className="grc-input"
            placeholder="Note (optional)"
            value={note}
            onChange={e => setNote(e.target.value)}
            style={{ marginBottom: 8 }}
          />
          <button type="button" className="btn-primary" onClick={post}>
            Post to board
          </button>
        </div>
      )}

      {offers.length === 0 && (
        <div style={{ fontSize: 13, color: 'var(--muted)' }}>No lifts posted yet. Be the first.</div>
      )}
      {offers.map(o => (
        <div
          key={o.id}
          style={{
            padding: '10px 0',
            borderTop: '1px solid var(--line)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'center' }}>
            <div style={{ fontWeight: 800, fontSize: 13 }}>{o.name}</div>
            <span className={o.role === 'offer' ? 'chip accent' : 'chip'} style={{ border: 'none' }}>
              {o.role === 'offer' ? `${o.seats} seats` : 'Needs lift'}
            </span>
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 3 }}>
            From {o.fromArea} · {o.note}
          </div>
        </div>
      ))}
    </div>
  )
}
