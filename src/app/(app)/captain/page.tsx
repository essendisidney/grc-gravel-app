'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Megaphone, RefreshCw, UserPlus } from 'lucide-react'
import TopBar from '@/components/layout/TopBar'
import {
  addAnnouncement,
  addCaptainPing,
  getAnnouncements,
  getCaptainPings,
  getRideStatus,
  getRollCall,
  getSession,
  getWaitlist,
  promoteWaitlist,
  setRideStatus,
  toggleRollCall,
  type CaptainPing,
  type ClubAnnouncement,
  type LocalSession,
  type RideDayStatus,
  type RollCallRider,
  type WaitlistRider,
} from '@/lib/localStore'
import AttendanceSummary from '@/components/captain/AttendanceSummary'
import StartListShare from '@/components/captain/StartListShare'
import RollOutNow from '@/components/captain/RollOutNow'
import RideDelayControl from '@/components/captain/RideDelayControl'
import { DEMO_RIDES } from '@/lib/demo'

const RIDE_ID = 'ngong-magadi'

export default function CaptainPage() {
  const [session, setLocalSession] = useState<LocalSession | null>(null)
  const [waitlist, setWaitlist] = useState<WaitlistRider[]>([])
  const [rollCall, setRollCall] = useState<RollCallRider[]>([])
  const [pings, setPings] = useState<CaptainPing[]>([])
  const [announcements, setAnnouncements] = useState<ClubAnnouncement[]>([])
  const [message, setMessage] = useState('Regroup at Kona Baridi. Lights on — Magadi dust kicking.')
  const [announceTitle, setAnnounceTitle] = useState('Saturday Magadi — dust advisory')
  const [announceBody, setAnnounceBody] = useState('Wind from the south. Lights on from Kona Baridi.')
  const [recurring, setRecurring] = useState(true)
  const [rideStatus, setStatus] = useState<RideDayStatus>('on')
  const ride = DEMO_RIDES.find(r => r.id === RIDE_ID)

  useEffect(() => {
    setLocalSession(getSession())
    setWaitlist(getWaitlist(RIDE_ID))
    setRollCall(getRollCall(RIDE_ID))
    setPings(getCaptainPings())
    setAnnouncements(getAnnouncements())
    setStatus(getRideStatus(RIDE_ID))
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

  function postAnnouncement() {
    if (!announceTitle.trim() || !announceBody.trim()) return
    const next = addAnnouncement({
      id: `a_${Date.now()}`,
      title: announceTitle.trim(),
      body: announceBody.trim(),
      createdAt: new Date().toISOString(),
      authorName: session?.fullName || 'Captain',
    })
    setAnnouncements(next)
    setAnnounceTitle('')
    setAnnounceBody('')
  }

  return (
    <div>
      <TopBar showBack title="Captain tools" showNotifications backHref="/club" />
      <div className="page animate-fade-in">
        <div className="eyebrow" style={{ color: 'var(--accent)', marginBottom: 6 }}>Wave 24 · Captain</div>
        <h1 style={{ margin: '0 0 8px', fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em' }}>
          {ride?.route_label || 'Club ride'}
        </h1>
        <p style={{ margin: '0 0 16px', fontSize: 14, color: 'var(--muted)', lineHeight: 1.45 }}>
          Ride status, announcements, gate roll call, attendance export, waitlist, group pings.
        </p>

        <div className="eyebrow" style={{ marginBottom: 10 }}>Saturday status</div>
        <div className="surface" style={{ padding: 14, marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {(['on', 'postponed', 'cancelled'] as RideDayStatus[]).map(s => (
              <button
                key={s}
                type="button"
                className={rideStatus === s ? 'chip accent' : 'chip'}
                style={{ border: 'none', cursor: 'pointer', textTransform: 'uppercase' }}
                onClick={() => setStatus(setRideStatus(RIDE_ID, s))}
              >
                {s}
              </button>
            ))}
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 10, lineHeight: 1.4 }}>
            Members see this on Home before they join.
          </div>
        </div>

        <div className="eyebrow" style={{ marginBottom: 10 }}>Club announcement</div>
        <div className="surface" style={{ padding: 14, marginBottom: 16 }}>
          <input
            className="grc-input"
            value={announceTitle}
            onChange={e => setAnnounceTitle(e.target.value)}
            placeholder="Title"
            style={{ marginBottom: 8 }}
          />
          <textarea
            className="grc-input"
            rows={3}
            value={announceBody}
            onChange={e => setAnnounceBody(e.target.value)}
            placeholder="What should the club know?"
            style={{ marginBottom: 10, resize: 'none' }}
          />
          <button type="button" className="btn-primary" onClick={postAnnouncement}>
            <Megaphone size={16} /> Post to Home
          </button>
          {announcements.length > 0 && (
            <div style={{ marginTop: 14 }}>
              {announcements.slice(0, 3).map(a => (
                <div key={a.id} style={{ padding: '10px 0', borderTop: '1px solid var(--line)' }}>
                  <div style={{ fontWeight: 800, fontSize: 13 }}>{a.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 3 }}>{a.body}</div>
                </div>
              ))}
            </div>
          )}
        </div>

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

        <div className="eyebrow" style={{ marginBottom: 10 }}>
          Gate roll call · {rollCall.filter(r => r.present).length}/{rollCall.length} present
        </div>
        {rollCall.map(r => (
          <button
            key={r.id}
            type="button"
            onClick={() => setRollCall(toggleRollCall(RIDE_ID, r.id))}
            className="surface"
            style={{
              width: '100%',
              padding: 12,
              marginBottom: 8,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 10,
              cursor: 'pointer',
              border: r.present ? '1px solid rgba(47,125,75,0.35)' : '1px solid var(--line)',
              background: r.present ? 'rgba(47,125,75,0.08)' : 'var(--surface)',
              fontFamily: 'var(--font)',
              color: 'var(--ink)',
              textAlign: 'left',
            }}
          >
            <div>
              <div style={{ fontWeight: 800, fontSize: 14 }}>{r.name}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{r.paceGroup}</div>
            </div>
            <span className={r.present ? 'chip accent' : 'chip'} style={{ border: 'none' }}>
              {r.present ? 'HERE' : 'OUT'}
            </span>
          </button>
        ))}

        <div style={{ marginTop: 8, marginBottom: 8 }}>
          <AttendanceSummary
            key={`att-${rollCall.filter(r => r.present).length}`}
            rideId={RIDE_ID}
            title={ride?.route_label || 'Club ride'}
          />
        </div>

        <StartListShare
          key={`sl-${rollCall.filter(r => r.present).length}`}
          rideId={RIDE_ID}
          title={ride?.route_label || 'Club ride'}
        />

        <RollOutNow rideId={RIDE_ID} onPing={setPings} />

        <RideDelayControl rideId={RIDE_ID} />

        <div className="eyebrow" style={{ margin: '18px 0 10px' }}>Waitlist</div>
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
