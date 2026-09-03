'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Megaphone, RefreshCw, UserPlus } from 'lucide-react'
import TopBar from '@/components/layout/TopBar'
import {
  addCaptainPing,
  getCaptainPings,
  getSession,
  getWaitlist,
  promoteWaitlist,
  type CaptainPing,
  type LocalSession,
  type WaitlistRider,
} from '@/lib/localStore'
import { DEMO_RIDES } from '@/lib/demo'

const RIDE_ID = 'ngong-magadi'

export default function CaptainPage() {
  const [session, setLocalSession] = useState<LocalSession | null>(null)
  const [waitlist, setWaitlist] = useState<WaitlistRider[]>([])
  const [pings, setPings] = useState<CaptainPing[]>([])
  const [message, setMessage] = useState('Regroup at Kona Baridi. Lights on — Magadi dust kicking.')
  const [recurring, setRecurring] = useState(true)
  const ride = DEMO_RIDES.find(r => r.id === RIDE_ID)

  useEffect(() => {
    setLocalSession(getSession())
    setWaitlist(getWaitlist(RIDE_ID))
    setPings(getCaptainPings())
  }, [])

  if (session && !session.isCaptain) {
    return (
      <div>
        <TopBar showBack title="Captain" backHref="/club" />
        <div style={{ padding: 24 }} className="surface">
          <div style={{ fontWeight: 800, marginBottom: 8 }}>Captain tools locked</div>
          <p style={{ margin: 0, fontSize: 14, color: 'var(--muted)', lineHeight: 1.5 }}>
            Sign in again from Login and check “I’m a ride captain” to unlock waitlist + group pings.
          </p>
          <Link href="/login?redirect=/captain" className="btn-primary" style={{ marginTop: 16, textDecoration: 'none', display: 'flex' }}>
            Re-sign as captain
          </Link>
        </div>
      </div>
    )
  }

  function promote(id: string) {
    setWaitlist(promoteWaitlist(RIDE_ID, id))
  }

  function sendPing() {
    if (!message.trim()) return
    const next = addCaptainPing({
      id: `p_${Date.now()}`,
      rideId: RIDE_ID,
      message: message.trim(),
      createdAt: new Date().toISOString(),
    })
    setPings(next)
    setMessage('')
  }

  return (
    <div>
      <TopBar showBack title="Captain tools" showNotifications backHref="/club" />
      <div className="animate-fade-in" style={{ padding: '0 16px 28px' }}>
        <div className="eyebrow" style={{ color: 'var(--accent)', marginBottom: 6 }}>Wave 3</div>
        <h1 style={{ margin: '0 0 8px', fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em' }}>
          {ride?.route_label || 'Club ride'}
        </h1>
        <p style={{ margin: '0 0 16px', fontSize: 14, color: 'var(--muted)', lineHeight: 1.45 }}>
          Waitlist, recurring flag, and group pings — demo ops for captains.
        </p>

        <div className="surface" style={{ padding: 14, marginBottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 800 }}>Recurring Saturday</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 3 }}>Shows on member calendars as weekly</div>
          </div>
          <button
            type="button"
            onClick={() => setRecurring(v => !v)}
            className={recurring ? 'chip accent' : 'chip'}
            style={{ border: 'none', cursor: 'pointer' }}
          >
            <RefreshCw size={12} /> {recurring ? 'ON' : 'OFF'}
          </button>
        </div>

        <div className="eyebrow" style={{ marginBottom: 10 }}>Waitlist</div>
        {waitlist.length === 0 ? (
          <div className="surface" style={{ padding: 16, marginBottom: 16, color: 'var(--muted)', fontSize: 13 }}>
            Waitlist clear. All spots filled from the queue.
          </div>
        ) : (
          waitlist.map(r => (
            <div key={r.id} className="surface" style={{ padding: 14, marginBottom: 8, display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: 14 }}>{r.name}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
                  {r.paceGroup} · {r.phone}
                </div>
              </div>
              <button type="button" className="chip accent" style={{ border: 'none', cursor: 'pointer' }} onClick={() => promote(r.id)}>
                <UserPlus size={12} /> Promote
              </button>
            </div>
          ))
        )}

        <div className="eyebrow" style={{ margin: '18px 0 10px' }}>Group ping</div>
        <textarea
          className="grc-input"
          rows={3}
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Message your pace groups…"
          style={{ marginBottom: 10, resize: 'none' }}
        />
        <button type="button" className="btn-primary" onClick={sendPing}>
          <Megaphone size={16} /> Send to riders
        </button>

        {pings.length > 0 && (
          <div style={{ marginTop: 18 }}>
            <div className="eyebrow" style={{ marginBottom: 10 }}>Recent pings</div>
            {pings.slice(0, 5).map(p => (
              <div key={p.id} className="surface" style={{ padding: 12, marginBottom: 8 }}>
                <div style={{ fontSize: 13, lineHeight: 1.45 }}>{p.message}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 6 }}>
                  {new Date(p.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
