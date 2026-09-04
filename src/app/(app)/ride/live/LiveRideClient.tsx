'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Droplets, Megaphone, Phone, Signal, TriangleAlert } from 'lucide-react'
import { DEMO_RIDES } from '@/lib/demo'
import RouteMap from '@/components/maps/RouteMap'
import {
  endLiveRide,
  getCaptainPings,
  getEmergencyContact,
  getLiveRide,
  getRsvp,
  getSession,
  startLiveRide,
} from '@/lib/localStore'

const CHECKPOINTS = [
  { atMin: 0, label: 'Ngong Town', note: 'Roll-out · lights check' },
  { atMin: 35, label: 'Kona Baridi', note: 'Regroup · water refill' },
  { atMin: 75, label: 'Olepolos climb', note: 'Signal patchy · stay in group' },
  { atMin: 110, label: 'Magadi flats', note: 'Wind · keep cadence' },
  { atMin: 150, label: 'Gate return', note: 'End ride · stretch' },
]

function formatElapsed(sec: number) {
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = sec % 60
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export default function LiveRideClient() {
  const router = useRouter()
  const params = useSearchParams()
  const rideId = params.get('ride') || 'ngong-magadi'
  const ride = useMemo(() => DEMO_RIDES.find(r => r.id === rideId) || DEMO_RIDES[0], [rideId])

  const [elapsed, setElapsed] = useState(0)
  const [paceName, setPaceName] = useState('Cruiser')
  const [ping, setPing] = useState<string | null>(null)
  const [sos, setSos] = useState(false)
  const [ready, setReady] = useState(false)
  const [emergency, setEmergency] = useState<{ name: string; phone: string } | null>(null)

  useEffect(() => {
    const rsvp = getRsvp(rideId)
    const session = getSession()
    const pace = rsvp?.paceGroupName || getLiveRide()?.paceGroupName || 'Cruiser'
    setPaceName(pace)

    let live = getLiveRide()
    if (!live || live.rideId !== rideId) {
      live = {
        rideId,
        paceGroupName: pace,
        startedAt: new Date().toISOString(),
      }
      startLiveRide(live)
    }

    const startedAt = new Date(live.startedAt).getTime()
    const tick = () => setElapsed(Math.max(0, Math.floor((Date.now() - startedAt) / 1000)))
    tick()
    const id = window.setInterval(tick, 1000)

    const pings = getCaptainPings().filter(p => p.rideId === rideId)
    if (pings[0]) setPing(pings[0].message)
    setEmergency(getEmergencyContact())

    setReady(true)
    void session
    return () => window.clearInterval(id)
  }, [rideId])

  const minutes = elapsed / 60
  const checkpoint =
    [...CHECKPOINTS].reverse().find(c => minutes >= c.atMin) || CHECKPOINTS[0]
  const next = CHECKPOINTS.find(c => c.atMin > minutes)
  const estKm = Math.min(
    ride?.distance_km || 86,
    Math.round((elapsed / 3600) * 21 * 10) / 10,
  )

  function finish() {
    endLiveRide()
    router.push(`/ride/summary?ride=${rideId}&t=${elapsed}&pace=${encodeURIComponent(paceName)}`)
  }

  if (!ready) {
    return <div style={{ padding: 24, color: 'var(--muted)' }}>Spinning up ride…</div>
  }

  return (
    <div
      className="animate-fade-in"
      style={{
        minHeight: '100%',
        background: 'linear-gradient(180deg, #1C1916 0%, #0E0C0A 48%, #141210 100%)',
        color: '#FFFCFA',
        padding: '16px 16px calc(24px + env(safe-area-inset-bottom))',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <div>
          <div className="eyebrow" style={{ color: 'rgba(224,122,47,0.9)', marginBottom: 4 }}>On ride</div>
          <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.02em' }}>
            {ride?.route_label || ride?.title}
          </div>
        </div>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 10px',
            borderRadius: 999,
            background: 'rgba(224,122,47,0.18)',
            color: '#E07A2F',
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: '0.06em',
          }}
        >
          <span className="live-dot" /> LIVE · {paceName.toUpperCase()}
        </span>
      </div>

      <div style={{ textAlign: 'center', margin: '28px 0 8px' }}>
        <div style={{ fontSize: 56, fontWeight: 800, letterSpacing: '-0.04em', fontVariantNumeric: 'tabular-nums' }}>
          {formatElapsed(elapsed)}
        </div>
        <div style={{ fontSize: 13, color: 'rgba(255,252,250,0.5)', marginTop: 4 }}>Elapsed</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 14 }}>
        <HudStat label="Est. km" value={String(estKm)} />
        <HudStat label="Climb" value={`${ride?.elevation_gain_m || 0}`} />
        <HudStat label="Gravel" value={`${ride?.gravel_pct || 80}%`} />
      </div>

      <div style={{ marginBottom: 14 }}>
        <RouteMap routeId={rideId} height={120} dark />
      </div>

      <div
        style={{
          borderRadius: 18,
          padding: 14,
          background: 'rgba(255,252,250,0.06)',
          border: '1px solid rgba(255,255,255,0.08)',
          marginBottom: 12,
        }}
      >
        <div className="eyebrow" style={{ color: 'rgba(255,255,255,0.45)', marginBottom: 6 }}>Now</div>
        <div style={{ fontSize: 17, fontWeight: 800 }}>{checkpoint.label}</div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', marginTop: 4 }}>{checkpoint.note}</div>
        {next && (
          <div style={{ marginTop: 10, fontSize: 12, color: '#E07A2F', fontWeight: 700 }}>
            Next · {next.label} in ~{Math.max(1, Math.round(next.atMin - minutes))} min
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 14 }}>
        <Chip icon={<Droplets size={14} />} label={`${ride?.water_points || 3} water`} />
        <Chip icon={<Signal size={14} />} label={ride?.signal || 'Patchy'} />
        <Chip icon={<TriangleAlert size={14} />} label={ride?.road_condition || 'Good'} />
      </div>

      {ping && (
        <div
          style={{
            display: 'flex',
            gap: 10,
            padding: 12,
            borderRadius: 14,
            background: 'rgba(224,122,47,0.14)',
            border: '1px solid rgba(224,122,47,0.28)',
            marginBottom: 14,
          }}
        >
          <Megaphone size={16} color="#E07A2F" style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: '#E07A2F' }}>
              CAPTAIN
            </div>
            <div style={{ fontSize: 13, lineHeight: 1.4, marginTop: 2 }}>{ping}</div>
          </div>
        </div>
      )}

      {sos ? (
        <div
          style={{
            padding: 14,
            borderRadius: 14,
            background: 'rgba(179,58,58,0.18)',
            border: '1px solid rgba(179,58,58,0.4)',
            marginBottom: 14,
          }}
        >
          <div style={{ fontWeight: 800, marginBottom: 6 }}>SOS demo armed</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.45, marginBottom: 10 }}>
            {emergency
              ? `Ready to ping ${emergency.name}. Demo only — opens dialer, no auto-SMS yet.`
              : 'No emergency contact saved. Add one in Edit profile, or call the club line.'}
          </div>
          {emergency?.phone ? (
            <a
              href={`tel:${emergency.phone.replace(/\s/g, '')}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                color: '#fff',
                fontWeight: 700,
                textDecoration: 'none',
                fontSize: 13,
                marginBottom: 8,
              }}
            >
              <Phone size={14} /> Call {emergency.name}
            </a>
          ) : null}
          <div>
            <a
              href="tel:+254780222216"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                color: 'rgba(255,255,255,0.7)',
                fontWeight: 700,
                textDecoration: 'none',
                fontSize: 12,
              }}
            >
              <Phone size={14} /> Club line · 0780 222 216
            </a>
          </div>
          {!emergency && (
            <Link
              href="/profile/edit"
              style={{
                display: 'block',
                marginTop: 10,
                fontSize: 12,
                fontWeight: 700,
                color: '#E07A2F',
                textDecoration: 'none',
              }}
            >
              Add emergency contact →
            </Link>
          )}
        </div>
      ) : null}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <button
          type="button"
          onClick={() => setSos(true)}
          style={{
            border: '1px solid rgba(179,58,58,0.45)',
            background: 'rgba(179,58,58,0.16)',
            color: '#F5C2C2',
            borderRadius: 14,
            padding: '14px 12px',
            fontWeight: 800,
            fontSize: 13,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            fontFamily: 'var(--font)',
            cursor: 'pointer',
          }}
        >
          SOS
        </button>
        <button type="button" className="btn-primary" onClick={finish} style={{ boxShadow: 'none' }}>
          End ride
        </button>
      </div>

      <Link
        href="/"
        style={{
          display: 'block',
          textAlign: 'center',
          marginTop: 14,
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.4)',
          textDecoration: 'none',
        }}
      >
        Keep riding in background
      </Link>
    </div>
  )
}

function HudStat({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: '12px 8px',
        borderRadius: 14,
        background: 'rgba(255,252,250,0.05)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.02em' }}>{value}</div>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.42)', marginTop: 4 }}>
        {label}
      </div>
    </div>
  )
}

function Chip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        padding: '10px 8px',
        borderRadius: 12,
        background: 'rgba(255,252,250,0.05)',
        fontSize: 11,
        fontWeight: 700,
        color: 'rgba(255,255,255,0.7)',
      }}
    >
      {icon}
      {label}
    </div>
  )
}
