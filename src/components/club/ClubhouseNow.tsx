'use client'

import { useState } from 'react'
import {
  checkInClubhouseNow,
  getClubhouseNow,
  getHomeClubhouse,
  getSession,
  type ClubhousePresence,
} from '@/lib/localStore'

export default function ClubhouseNow() {
  const [list, setList] = useState<ClubhousePresence[]>(() => getClubhouseNow())
  const house = getHomeClubhouse()
  const filtered = list.filter(p => p.clubhouse === house)
  const label = house === 'tena' ? 'Tena' : 'Utawala'

  function checkIn() {
    const name = getSession()?.fullName || 'You'
    setList(checkInClubhouseNow(house, name, 'Just arrived'))
  }

  return (
    <div className="surface" style={{ padding: 14, marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div style={{ fontWeight: 800, fontSize: 14 }}>At {label} now</div>
        <span className="chip accent" style={{ border: 'none' }}>
          {filtered.length}
        </span>
      </div>
      <p style={{ margin: '0 0 10px', fontSize: 12, color: 'var(--muted)', lineHeight: 1.4 }}>
        Demo presence on this device — tap to check in at your home clubhouse.
      </p>
      {filtered.length === 0 ? (
        <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 10 }}>Quiet right now.</div>
      ) : (
        filtered.slice(0, 5).map(p => (
          <div
            key={p.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: 8,
              padding: '8px 0',
              borderTop: '1px solid var(--line)',
              fontSize: 12,
            }}
          >
            <span>
              <strong>{p.name.split(' ')[0]}</strong> · {p.note}
            </span>
            <span style={{ color: 'var(--muted)', flexShrink: 0 }}>
              {Math.max(1, Math.round((Date.now() - new Date(p.at).getTime()) / 60000))}m
            </span>
          </div>
        ))
      )}
      <button type="button" className="btn-secondary" style={{ marginTop: 8 }} onClick={checkIn}>
        I’m here
      </button>
    </div>
  )
}
