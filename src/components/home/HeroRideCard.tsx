import Link from 'next/link'
import { Clock, MapPin, ChevronRight, Users } from 'lucide-react'
import { formatRideDate, formatTime, formatKm, getRideTypeBg } from '@/lib/utils'
import type { Ride } from '@/lib/types/database'

interface HeroRideCardProps {
  ride: Ride
}

export default function HeroRideCard({ ride }: HeroRideCardProps) {
  const spotsLeft = ride.max_participants
    ? ride.max_participants - (ride.registration_count || 0)
    : null

  return (
    <div
      style={{
        margin: '0 16px 20px',
        background: 'linear-gradient(135deg, #1a2a1a 0%, #0f1a0f 100%)',
        borderRadius: 20,
        overflow: 'hidden',
        position: 'relative',
        border: '1px solid #2a3d2a',
      }}
    >
      {/* Watermark */}
      <div
        style={{
          position: 'absolute',
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: 90,
          fontWeight: 800,
          color: 'rgba(245,197,24,0.05)',
          right: -10,
          bottom: -20,
          lineHeight: 1,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        RIDE
      </div>

      <div style={{ padding: 20 }}>
        {/* Live badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: 'rgba(245,197,24,0.12)',
            border: '1px solid rgba(245,197,24,0.25)',
            borderRadius: 20,
            padding: '4px 10px',
            fontSize: 10,
            fontWeight: 700,
            color: '#F5C518',
            letterSpacing: 1,
            textTransform: 'uppercase',
            marginBottom: 12,
          }}
        >
          <span className="pulse-dot" style={{ width: 6, height: 6, background: '#F5C518', borderRadius: '50%', display: 'inline-block' }} />
          Next Ride
        </div>

        {/* Title */}
        <h2
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 28,
            fontWeight: 700,
            lineHeight: 1.1,
            marginBottom: 14,
            color: '#F0F2F5',
          }}
        >
          {ride.title}
        </h2>

        {/* Meta */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#8892A4' }}>
            <Clock size={12} />
            {formatRideDate(ride.ride_date)} · {formatTime(ride.start_time)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#8892A4' }}>
            <MapPin size={12} />
            {ride.start_location_name}
          </div>
          {ride.distance_km && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#8892A4' }}>
              <span style={{ fontSize: 10 }}>⚡</span>
              {formatKm(ride.distance_km)}
            </div>
          )}
        </div>

        {/* Participants row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#8892A4' }}>
            <Users size={12} />
            <span>
              <strong style={{ color: '#F0F2F5' }}>{ride.registration_count || 0}</strong> riders joined
              {spotsLeft !== null && spotsLeft <= 10 && (
                <span style={{ color: '#F5C518', marginLeft: 6 }}>· {spotsLeft} spots left!</span>
              )}
            </span>
          </div>
        </div>

        {/* Type badge */}
        <div style={{ marginBottom: 16 }}>
          <span
            className={getRideTypeBg(ride.ride_type)}
            style={{
              display: 'inline-block',
              padding: '3px 10px',
              borderRadius: 20,
              fontSize: 10,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            {ride.ride_type}
          </span>
          {ride.difficulty && (
            <span
              style={{
                display: 'inline-block',
                marginLeft: 6,
                padding: '3px 10px',
                borderRadius: 20,
                fontSize: 10,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                background: 'rgba(136,146,164,0.15)',
                color: '#8892A4',
              }}
            >
              {ride.difficulty}
            </span>
          )}
        </div>

        {/* CTA */}
        <Link href={`/rides/${ride.id}`} style={{ textDecoration: 'none' }}>
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              background: '#F5C518',
              color: '#0D0F14',
              padding: '13px 18px',
              borderRadius: 13,
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: 14,
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            <span>
              {ride.user_registration?.status === 'registered'
                ? "You're registered ✓"
                : ride.user_registration?.status === 'waitlisted'
                ? "You're waitlisted"
                : 'Register Now'}
            </span>
            <ChevronRight size={18} />
          </button>
        </Link>
      </div>
    </div>
  )
}
