'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CheckCircle2, Clock, Loader2 } from 'lucide-react'
import KitChecklist from '@/components/rides/KitChecklist'
import CarpoolBoard from '@/components/rides/CarpoolBoard'
import PaceBuddies from '@/components/rides/PaceBuddies'
import AddToCalendarButton from '@/components/rides/AddToCalendarButton'
import { clearRsvp, getRollCall, getRsvp, markSaturdayRidden, setRsvp, type LocalRsvp, type RollCallRider } from '@/lib/localStore'
import { DEMO_RIDES } from '@/lib/demo'

type PaceGroup = { id: string; name: string; avg_kph: number; count: number; captain?: string }

export default function RideDetailClient({
  rideId,
  spotsLeft,
  paceGroups = [],
}: {
  rideId: string
  spotsLeft: number | null
  paceGroups?: PaceGroup[]
}) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [rsvp, setLocal] = useState<LocalRsvp | null>(null)
  const [paceId, setPaceId] = useState(paceGroups[1]?.id || paceGroups[0]?.id || '')
  const [roster, setRoster] = useState<RollCallRider[]>([])

  useEffect(() => {
    const existing = getRsvp(rideId)
    setLocal(existing)
    if (existing) setPaceId(existing.paceGroupId)
    setRoster(getRollCall(rideId))
  }, [rideId])

  async function handleRegister() {
    if (paceGroups.length && !paceId) {
      setMessage('Pick a pace group first')
      return
    }
    setLoading(true)
    setMessage('')
    await new Promise(r => setTimeout(r, 450))
    const group = paceGroups.find(g => g.id === paceId)
    const status = spotsLeft !== null && spotsLeft <= 0 ? 'waitlisted' : 'registered'
    const next: LocalRsvp = {
      rideId,
      paceGroupId: paceId || 'open',
      paceGroupName: group?.name || 'Open',
      status,
      joinedAt: new Date().toISOString(),
    }
    setRsvp(next)
    setLocal(next)
    if (status === 'registered') markSaturdayRidden()
    setMessage(
      status === 'registered'
        ? `Niko in — ${next.paceGroupName} group. See you at the gate.`
        : "You're on the waitlist. We'll ping you if a spot opens.",
    )
    setLoading(false)
  }

  async function handleCancel() {
    if (!confirm('Cancel your registration for this ride?')) return
    setLoading(true)
    clearRsvp(rideId)
    setLocal(null)
    setMessage('Registration cancelled')
    setLoading(false)
  }

  const isRegistered = rsvp?.status === 'registered'
  const isWaitlisted = rsvp?.status === 'waitlisted'
  const isFull = spotsLeft !== null && spotsLeft <= 0 && !isRegistered && !isWaitlisted
  const presentCount = roster.filter(r => r.present).length
  const ride = DEMO_RIDES.find(r => r.id === rideId)

  return (
    <div>
      {message && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: 12,
            marginBottom: 14,
            background: message.toLowerCase().includes('cancel')
              ? 'rgba(179,58,58,0.08)'
              : 'rgba(47,125,75,0.1)',
            border: `1px solid ${message.toLowerCase().includes('cancel') ? 'rgba(179,58,58,0.25)' : 'rgba(47,125,75,0.25)'}`,
            fontSize: 13,
            color: message.toLowerCase().includes('cancel') ? 'var(--bad)' : 'var(--good)',
            fontWeight: 600,
          }}
        >
          {message}
        </div>
      )}

      {!isRegistered && !isWaitlisted && paceGroups.length > 0 && (
        <div className="surface" style={{ padding: 14, marginBottom: 14 }}>
          <div className="section-label" style={{ marginBottom: 10 }}>Choose pace group</div>
          {paceGroups.map(g => {
            const on = paceId === g.id
            return (
              <button
                key={g.id}
                type="button"
                onClick={() => setPaceId(g.id)}
                className="pressable"
                style={{
                  width: '100%',
                  textAlign: 'left',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 10,
                  padding: '12px 12px',
                  marginBottom: 8,
                  borderRadius: 12,
                  border: `1px solid ${on ? 'rgba(254,199,46,0.5)' : 'var(--line)'}`,
                  background: on ? 'var(--accent-soft)' : 'var(--bg)',
                  cursor: 'pointer',
                  fontFamily: 'var(--font)',
                  color: 'var(--ink)',
                }}
              >
                <div>
                  <div style={{ fontWeight: 800, fontSize: 14 }}>{g.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
                    ~{g.avg_kph} km/h{g.captain ? ` · Capt ${g.captain.split(' ')[0]}` : ''}
                  </div>
                </div>
                <span className="chip accent">{g.count}</span>
              </button>
            )
          })}
        </div>
      )}

      <div className="surface" style={{ padding: 14, marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div className="section-label" style={{ margin: 0 }}>Who’s going · gate</div>
          <span className="chip accent" style={{ border: 'none' }}>
            {presentCount}/{roster.length} here
          </span>
        </div>
        {roster.slice(0, 8).map(r => (
          <div
            key={r.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '8px 0',
              borderTop: '1px solid var(--line)',
            }}
          >
            <div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{r.name}</div>
              <div style={{ fontSize: 11, color: 'var(--muted)' }}>{r.paceGroup}</div>
            </div>
            <span className={r.present ? 'chip accent' : 'chip'} style={{ border: 'none' }}>
              {r.present ? 'HERE' : 'OUT'}
            </span>
          </div>
        ))}
        <Link
          href="/captain"
          style={{
            display: 'block',
            marginTop: 10,
            fontSize: 12,
            fontWeight: 700,
            color: 'var(--accent)',
            textDecoration: 'none',
          }}
        >
          Captain roll call →
        </Link>
      </div>

      {(isRegistered || isWaitlisted) && <KitChecklist rideId={rideId} />}

      <PaceBuddies rsvp={rsvp} roster={roster} />

      {ride && (
        <div style={{ marginBottom: 14 }}>
          <AddToCalendarButton ride={ride} />
        </div>
      )}

      <CarpoolBoard rideId={rideId} />

      {isRegistered && (
        <div style={{ marginBottom: 12 }}>
          <div
            style={{
              background: 'var(--accent-soft)',
              border: '1px solid rgba(254,199,46,0.35)',
              borderRadius: 14,
              padding: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 10,
            }}
          >
            <CheckCircle2 size={20} color="var(--accent)" />
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--accent-ink)' }}>
                Niko in · {rsvp?.paceGroupName}
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                Lights on. We don’t wait past roll-out.
              </div>
            </div>
          </div>
          <Link
            href={`/ride/live?ride=${rideId}`}
            className="btn-primary"
            style={{ textDecoration: 'none', display: 'flex', marginBottom: 10 }}
          >
            Start ride
          </Link>
          <button onClick={handleCancel} disabled={loading} className="btn-danger">
            {loading ? <Loader2 size={14} /> : 'Cancel registration'}
          </button>
        </div>
      )}

      {isWaitlisted && (
        <div style={{ marginBottom: 12 }}>
          <div
            style={{
              background: 'rgba(196,122,18,0.1)',
              border: '1px solid rgba(196,122,18,0.3)',
              borderRadius: 14,
              padding: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 10,
            }}
          >
            <Clock size={20} color="var(--warn)" />
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--warn)' }}>On the waitlist</div>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                Preferred: {rsvp?.paceGroupName}. We’ll notify you if a spot opens.
              </div>
            </div>
          </div>
          <button onClick={handleCancel} disabled={loading} className="btn-danger">
            Leave waitlist
          </button>
        </div>
      )}

      {!isRegistered && !isWaitlisted && (
        <button onClick={handleRegister} disabled={loading} className="btn-primary">
          {loading && <Loader2 size={16} />}
          {isFull ? 'Join waitlist' : loading ? 'Registering…' : 'Niko in'}
        </button>
      )}

      {spotsLeft !== null && !isRegistered && !isWaitlisted && (
        <div
          style={{
            textAlign: 'center',
            marginTop: 10,
            fontSize: 12,
            color: spotsLeft <= 5 ? 'var(--bad)' : 'var(--muted)',
            fontWeight: 600,
          }}
        >
          {spotsLeft <= 0 ? 'Ride is full — join the waitlist' : `${spotsLeft} spots remaining`}
        </div>
      )}
    </div>
  )
}
