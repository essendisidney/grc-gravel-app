import Image from 'next/image'
import { notFound } from 'next/navigation'
import TopBar from '@/components/layout/TopBar'
import RideDetailClient from './RideDetailClient'
import { DEMO_RIDES } from '@/lib/demo'
import { formatFullDate, formatTime, formatKm } from '@/lib/utils'
import { getPaceBand, getClubhouseLabel } from '@/lib/club'
import { Clock, MapPin, Gauge, Users, Mountain } from 'lucide-react'

export default async function RideDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const ride = DEMO_RIDES.find(r => r.id === id)
  if (!ride) notFound()

  const pace = getPaceBand(ride.difficulty, ride.avg_speed_kph)
  const spotsLeft = ride.max_participants ? ride.max_participants - (ride.registration_count || 0) : null

  return (
    <div>
      <TopBar showBack title="Ride details" showNotifications={false} />
      <div style={{ padding: '0 16px 28px' }}>
        {ride.cover_image && (
          <div style={{ position: 'relative', height: 200, borderRadius: 18, overflow: 'hidden', marginBottom: 14, background: 'var(--charcoal)' }}>
            <Image src={ride.cover_image} alt={ride.title} fill sizes="400px" style={{ objectFit: 'cover' }} priority />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 50%, rgba(20,18,16,0.55))' }} />
          </div>
        )}

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
          <span className="chip" style={{ cursor: 'default' }}>{ride.ride_type}</span>
          <span className="chip hard" style={{ cursor: 'default' }}>{String(ride.difficulty).toUpperCase()}</span>
          <span className="chip" style={{ cursor: 'default' }}>{getClubhouseLabel(ride.clubhouse)}</span>
        </div>

        <h1 style={{ fontSize: 26, fontWeight: 800, lineHeight: 1.15, margin: '0 0 16px' }}>{ride.title}</h1>

        <div className="surface" style={{ padding: 4, marginBottom: 14 }}>
          <DetailRow icon={<Clock size={16} />} label="When" value={`${formatFullDate(ride.ride_date)} · ${formatTime(ride.start_time)}`} />
          <DetailRow icon={<MapPin size={16} />} label="Start" value={ride.start_location_name} sub={ride.start_location_address} />
          <DetailRow icon={<Gauge size={16} />} label="Distance & pace" value={`${formatKm(ride.distance_km || 0)} · ${pace.range}`} />
          {ride.elevation_gain_m ? <DetailRow icon={<Mountain size={16} />} label="Elevation" value={`${ride.elevation_gain_m} m`} /> : null}
          <DetailRow icon={<Users size={16} />} label="Participants" value={`${ride.registration_count || 0} registered${spotsLeft !== null ? ` · ${spotsLeft} spots left` : ''}`} last />
        </div>

        {ride.pace_groups && ride.pace_groups.length > 0 && (
          <div className="surface" style={{ padding: 16, marginBottom: 14 }}>
            <div className="section-label" style={{ marginBottom: 10 }}>Pace groups</div>
            {ride.pace_groups.map(g => (
              <div key={g.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderTop: '1px solid var(--line)' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{g.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>~{g.avg_kph} km/h</div>
                </div>
                <span className="chip accent">{g.count} going</span>
              </div>
            ))}
          </div>
        )}

        {ride.description && (
          <div className="surface" style={{ padding: 16, marginBottom: 16 }}>
            <div className="section-label" style={{ marginBottom: 8 }}>Ride info</div>
            <p style={{ margin: 0, fontSize: 14, color: 'var(--muted)', lineHeight: 1.65 }}>{ride.description}</p>
          </div>
        )}

        <RideDetailClient
          rideId={ride.id}
          userRegistration={ride.user_registration || null}
          spotsLeft={spotsLeft}
        />
      </div>
    </div>
  )
}

function DetailRow({ icon, label, value, sub, last }: { icon: React.ReactNode; label: string; value: string; sub?: string; last?: boolean }) {
  return (
    <div style={{ display: 'flex', gap: 12, padding: 12, borderBottom: last ? 'none' : '1px solid var(--line)' }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink)', flexShrink: 0 }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 11, color: 'var(--muted)' }}>{label}</div>
        <div style={{ fontSize: 14, fontWeight: 600 }}>{value}</div>
        {sub ? <div style={{ fontSize: 12, color: 'var(--muted)' }}>{sub}</div> : null}
      </div>
    </div>
  )
}
