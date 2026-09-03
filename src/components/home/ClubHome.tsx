'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight, Check } from 'lucide-react'
import { formatRideDate, formatTime } from '@/lib/utils'
import type { DemoRide } from '@/lib/demo'
import { DEMO_PROFILE, DEMO_WEEK_STATS } from '@/lib/demo'
import GrcLogo from '@/components/brand/GrcLogo'

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'GOOD MORNING'
  if (h < 17) return 'GOOD AFTERNOON'
  return 'GOOD EVENING'
}

export default function ClubHome({ rides }: { rides: DemoRide[] }) {
  const adventure = useMemo(
    () => rides.find(r => r.id === 'ngong-magadi') || rides[0],
    [rides],
  )
  const [joined, setJoined] = useState(!!adventure?.user_registration)
  const firstName = (DEMO_PROFILE.full_name || 'Rider').split(' ')[0].toUpperCase()

  if (!adventure) return null

  const cover = adventure.cover_image || '/brand/hero-adventure.jpg'
  const going = adventure.registration_count || 0

  return (
    <div className="animate-fade-in" style={{ paddingBottom: 12 }}>
      <div className="stagger" style={{ padding: '14px 20px 10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <GrcLogo size={36} rounded={11} />
          <div className="eyebrow" style={{ color: 'var(--accent)', margin: 0 }}>
            {greeting()}, {firstName}
          </div>
        </div>

        <div className="eyebrow" style={{ marginBottom: 8 }}>Your next adventure</div>
        <h1 className="display-title">{adventure.route_label || adventure.title}</h1>
        <div
          style={{
            marginTop: 14,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 8,
            alignItems: 'center',
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--muted)',
          }}
        >
          <span>{adventure.distance_km} KM</span>
          <span style={{ opacity: 0.35 }}>·</span>
          <span>{adventure.elevation_gain_m?.toLocaleString()} M ↑</span>
          <span style={{ opacity: 0.35 }}>·</span>
          <span className="chip hard">{adventure.difficulty}</span>
        </div>
      </div>

      <div style={{ padding: '8px 14px 0' }}>
        <div className="hero-media" style={{ aspectRatio: '3 / 4', maxHeight: '52dvh' }}>
          <Image
            src={cover}
            alt={adventure.title}
            fill
            priority
            sizes="430px"
            className="hero-zoom"
            style={{ objectFit: 'cover', objectPosition: 'center 35%' }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(180deg, rgba(14,12,10,0.08) 20%, rgba(14,12,10,0.15) 45%, rgba(14,12,10,0.82) 100%)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 16,
              right: 16,
              bottom: 16,
              color: '#fff',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              gap: 12,
            }}
          >
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', opacity: 0.9 }}>
                {formatRideDate(adventure.ride_date).toUpperCase()} · {formatTime(adventure.start_time)}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                <span className="live-dot" />
                <span style={{ fontSize: 15, fontWeight: 800, letterSpacing: '-0.01em' }}>
                  {going} RIDERS GOING
                </span>
              </div>
            </div>
            <div style={{ display: 'flex' }}>
              {(adventure.going || []).slice(0, 4).map((r, i) => (
                <div
                  key={r.initials}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: r.color,
                    color: '#fff',
                    fontSize: 9,
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid rgba(20,18,16,0.85)',
                    marginLeft: i === 0 ? 0 : -8,
                  }}
                >
                  {r.initials}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '14px 14px 0' }}>
        <button
          type="button"
          className={`btn-primary ${joined ? 'joined' : ''}`}
          onClick={() => setJoined(true)}
          disabled={joined}
        >
          {joined ? (
            <>
              <Check size={18} strokeWidth={2.6} /> YOU’RE IN
            </>
          ) : (
            <>
              JOIN RIDE <ArrowUpRight size={18} strokeWidth={2.4} />
            </>
          )}
        </button>
        <Link
          href={`/rides/${adventure.id}`}
          className="pressable"
          style={{
            display: 'block',
            textAlign: 'center',
            marginTop: 12,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--muted)',
            textDecoration: 'none',
          }}
        >
          Route details
        </Link>
      </div>

      <div style={{ padding: '22px 14px 8px' }}>
        <div className="eyebrow" style={{ marginBottom: 12 }}>This week</div>
        <div className="week-strip">
          <div className="week-cell">
            <div className="eyebrow" style={{ fontSize: 9, marginBottom: 8 }}>Km</div>
            <div className="stat-num" style={{ fontSize: 20 }}>{DEMO_WEEK_STATS.km}</div>
            <div style={{ marginTop: 6, fontSize: 11, fontWeight: 700, color: 'var(--accent)' }}>
              +{DEMO_WEEK_STATS.kmDelta}%
            </div>
          </div>
          <div className="week-cell">
            <div className="eyebrow" style={{ fontSize: 9, marginBottom: 8 }}>Climb</div>
            <div className="stat-num" style={{ fontSize: 20 }}>
              {(DEMO_WEEK_STATS.climbed_m / 1000).toFixed(1)}k
            </div>
            <div style={{ marginTop: 6, fontSize: 11, fontWeight: 700, color: 'var(--accent)' }}>
              +{DEMO_WEEK_STATS.climbedDelta}%
            </div>
          </div>
          <div className="week-cell">
            <div className="eyebrow" style={{ fontSize: 9, marginBottom: 8 }}>Rides</div>
            <div className="stat-num" style={{ fontSize: 20 }}>{DEMO_WEEK_STATS.rides}</div>
          </div>
          <div className="week-cell">
            <div className="eyebrow" style={{ fontSize: 9, marginBottom: 8 }}>Nairobi</div>
            <div className="stat-num" style={{ fontSize: 20 }}>#{DEMO_WEEK_STATS.rank_nairobi}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
