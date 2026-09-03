import Link from 'next/link'
import { MapPin, Gauge, Users } from 'lucide-react'
import { formatTime, formatKm } from '@/lib/utils'
import { getPaceBand, getClubhouseLabel } from '@/lib/club'
import type { Ride } from '@/lib/types/database'

type CardRide = Ride & {
  avg_speed_kph?: number
  going?: { initials: string; color: string }[]
}

export default function RideCard({ ride }: { ride: CardRide }) {
  const isIn = ride.user_registration?.status === 'registered'
  const pace = getPaceBand(ride.difficulty, ride.avg_speed_kph)
  const date = new Date(ride.ride_date)
  const weekday = date.toLocaleString('en-KE', { weekday: 'short' })
  const day = date.getDate()
  const month = date.toLocaleString('en-KE', { month: 'short' })

  return (
    <Link href={`/rides/${ride.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <article
        className="surface"
        style={{
          marginBottom: 10,
          overflow: 'hidden',
          boxShadow: isIn ? '0 0 0 2px rgba(245,197,24,0.45)' : '0 1px 2px rgba(26,31,44,0.04)',
        }}
      >
        {isIn && (
          <div style={{ background: 'var(--club-soft)', color: 'var(--club-ink)', padding: '6px 14px', fontSize: 11, fontWeight: 700 }}>
            You’re registered · Niko in
          </div>
        )}
        <div style={{ display: 'flex', gap: 12, padding: 14 }}>
          <div
            style={{
              width: 52,
              borderRadius: 12,
              background: 'var(--bg)',
              textAlign: 'center',
              padding: '8px 4px',
              flexShrink: 0,
            }}
          >
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>{weekday}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--ink)', lineHeight: 1.1 }}>{day}</div>
            <div style={{ fontSize: 10, color: 'var(--muted)' }}>{month}</div>
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 6 }}>
              <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.4, color: 'var(--navy)', background: '#EEF1F6', padding: '3px 8px', borderRadius: 999 }}>
                {ride.ride_type}
              </span>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#8A6A00', background: 'var(--club-soft)', padding: '3px 8px', borderRadius: 999 }}>
                {pace.name} · {pace.range}
              </span>
            </div>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, lineHeight: 1.25 }}>{ride.title}</h3>
            <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 5, fontSize: 12, color: 'var(--muted)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <MapPin size={13} /> {formatTime(ride.start_time)} · {ride.start_location_name}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Gauge size={13} />
                {ride.distance_km ? formatKm(ride.distance_km) : 'Distance TBD'}
                {ride.avg_speed_kph ? ` · ~${ride.avg_speed_kph} km/h` : ''}
                {' · '}{getClubhouseLabel(ride.clubhouse)}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Users size={13} /> {ride.registration_count || 0} going
                {ride.max_participants ? ` · max ${ride.max_participants}` : ''}
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}
