'use client'

import { useState } from 'react'
import { Coffee } from 'lucide-react'
import {
  addChaiContribution,
  chaiTotal,
  getChaiKitty,
  getSession,
  type ChaiKitty,
} from '@/lib/localStore'

const AMOUNTS = [50, 100, 200]

export default function ChaiKittyBoard({ rideId }: { rideId: string }) {
  const [kitty, setKitty] = useState<ChaiKitty>(() => getChaiKitty(rideId))
  const total = chaiTotal(kitty)
  const pct = Math.min(100, Math.round((total / kitty.goalKes) * 100))

  function chipIn(amount: number) {
    const name = getSession()?.fullName || 'You'
    setKitty(addChaiContribution(rideId, name, amount))
  }

  return (
    <div className="surface" style={{ padding: 14, marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <Coffee size={16} color="var(--accent)" />
        <div className="section-label" style={{ margin: 0 }}>
          Chai kitty
        </div>
      </div>
      <p style={{ margin: '0 0 10px', fontSize: 12, color: 'var(--muted)', lineHeight: 1.4 }}>
        Post-ride sodas & chai at Magadi — cash float on this device (not M-Pesa yet).
      </p>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 800, marginBottom: 6 }}>
        <span>KES {total.toLocaleString()}</span>
        <span style={{ color: 'var(--muted)', fontWeight: 600 }}>goal {kitty.goalKes.toLocaleString()}</span>
      </div>
      <div
        style={{
          height: 8,
          borderRadius: 999,
          background: 'var(--bg)',
          overflow: 'hidden',
          marginBottom: 12,
        }}
      >
        <div style={{ width: `${pct}%`, height: '100%', background: 'var(--accent)', borderRadius: 999 }} />
      </div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
        {AMOUNTS.map(a => (
          <button
            key={a}
            type="button"
            className="chip accent"
            style={{ border: 'none', cursor: 'pointer', flex: 1, justifyContent: 'center' }}
            onClick={() => chipIn(a)}
          >
            +{a}
          </button>
        ))}
      </div>
      {kitty.contributions.slice(0, 4).map(c => (
        <div
          key={c.id}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 12,
            padding: '6px 0',
            borderTop: '1px solid var(--line)',
          }}
        >
          <span>{c.name.split(' ')[0]}</span>
          <span style={{ fontWeight: 700 }}>KES {c.amountKes}</span>
        </div>
      ))}
    </div>
  )
}
