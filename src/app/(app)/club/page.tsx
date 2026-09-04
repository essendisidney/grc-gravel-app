import Image from 'next/image'
import Link from 'next/link'
import TopBar from '@/components/layout/TopBar'
import InviteFriend from '@/components/club/InviteFriend'
import { DEMO_CLUB, DEMO_RIDES } from '@/lib/demo'
import { formatRideDate, formatTime } from '@/lib/utils'

export default function ClubPage() {
  const upcoming = DEMO_RIDES.slice(0, 3)

  return (
    <div>
      <TopBar title="Club" showNotifications />
      <div className="animate-fade-in" style={{ padding: '0 16px 28px' }}>
        <div className="hero-media" style={{ height: 200, marginBottom: 16, borderRadius: 22 }}>
          <Image src="/brand/clubhouse.jpg" alt="GRC clubhouse" fill sizes="400px" style={{ objectFit: 'cover' }} priority />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, rgba(14,12,10,0.1), rgba(14,12,10,0.82))',
            }}
          />
          <div style={{ position: 'absolute', left: 16, right: 16, bottom: 16, color: '#fff' }}>
            <div className="eyebrow" style={{ color: 'rgba(255,255,255,0.72)', marginBottom: 6 }}>
              {DEMO_CLUB.tagline}
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em' }}>{DEMO_CLUB.name}</div>
          </div>
        </div>

        <div className="week-strip" style={{ marginBottom: 20 }}>
          <div className="week-cell" style={{ textAlign: 'center' }}>
            <div className="stat-num" style={{ fontSize: 18 }}>{DEMO_CLUB.members}+</div>
            <div className="eyebrow" style={{ marginTop: 6, fontSize: 9 }}>Members</div>
          </div>
          <div className="week-cell" style={{ textAlign: 'center' }}>
            <div className="stat-num" style={{ fontSize: 18 }}>#{DEMO_CLUB.elite_rank}</div>
            <div className="eyebrow" style={{ marginTop: 6, fontSize: 9 }}>Elite</div>
          </div>
          <div className="week-cell" style={{ textAlign: 'center' }}>
            <div className="stat-num" style={{ fontSize: 18 }}>{(DEMO_CLUB.bikes_repaired / 1000).toFixed(0)}k+</div>
            <div className="eyebrow" style={{ marginTop: 6, fontSize: 9 }}>Fixed</div>
          </div>
        </div>

        <div className="eyebrow" style={{ marginBottom: 10 }}>Clubhouses</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
          {DEMO_CLUB.clubhouses.map(ch => (
            <div key={ch.id} className="surface" style={{ padding: 14 }}>
              <div style={{ fontSize: 15, fontWeight: 800 }}>{ch.name}</div>
              <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4, lineHeight: 1.4 }}>{ch.address}</div>
              {'hours' in ch && ch.hours && (
                <div style={{ fontSize: 12, fontWeight: 700, marginTop: 10, color: 'var(--accent-ink)' }}>
                  {ch.hours}
                </div>
              )}
              {'openNowHint' in ch && ch.openNowHint && (
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>{ch.openNowHint}</div>
              )}
            </div>
          ))}
        </div>

        <div className="eyebrow" style={{ marginBottom: 10 }}>Pace groups</div>
        <div className="surface" style={{ padding: 14, marginBottom: 20 }}>
          <p style={{ margin: '0 0 4px', fontSize: 13, color: 'var(--muted)', lineHeight: 1.45 }}>
            Weekly rides from Tena & Utawala — captains on every group.
          </p>
          {(DEMO_RIDES[0].pace_groups || []).map(g => (
            <div
              key={g.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 0',
                borderTop: '1px solid var(--line)',
              }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{g.name}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>~{g.avg_kph} km/h</div>
              </div>
              <span className="chip accent">{g.count} going</span>
            </div>
          ))}
        </div>

        <div className="eyebrow" style={{ marginBottom: 10 }}>People</div>
        <InviteFriend />
        <Link href="/club/members" className="btn-primary" style={{ textDecoration: 'none', marginBottom: 10, display: 'flex' }}>
          Member directory
        </Link>
        <Link href="/club/leaderboard" className="btn-secondary" style={{ textDecoration: 'none', marginBottom: 10, display: 'flex' }}>
          Season km board
        </Link>

        <div className="eyebrow" style={{ marginBottom: 10 }}>Membership</div>
        <Link href="/join" className="btn-secondary" style={{ textDecoration: 'none', marginBottom: 10, display: 'flex' }}>
          Membership tiers · M-Pesa later
        </Link>
        <Link href="/captain" className="btn-secondary" style={{ textDecoration: 'none', marginBottom: 12, display: 'flex' }}>
          Captain tools
        </Link>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20 }}>
          {DEMO_CLUB.membership.map(m => (
            <div key={m.name} className="surface" style={{ padding: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{m.name}</div>
              <div style={{ fontSize: 18, fontWeight: 800, marginTop: 6, letterSpacing: '-0.02em' }}>
                KES {m.price_kes.toLocaleString()}
              </div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>/{m.period}</div>
            </div>
          ))}
        </div>

        <div className="eyebrow" style={{ marginBottom: 10 }}>Upcoming</div>
        {upcoming.map(ride => (
          <Link key={ride.id} href={`/rides/${ride.id}`} className="pressable" style={{ textDecoration: 'none', color: 'inherit', display: 'block', marginBottom: 8 }}>
            <div className="surface" style={{ padding: 14, display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{ride.title}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 3 }}>
                  {formatRideDate(ride.ride_date)} · {formatTime(ride.start_time)}
                </div>
              </div>
              <span className="chip">{ride.distance_km} km</span>
            </div>
          </Link>
        ))}

        <div className="surface" style={{ padding: 14, marginTop: 12 }}>
          <div className="eyebrow" style={{ marginBottom: 8 }}>Contact</div>
          <div style={{ fontSize: 13, lineHeight: 1.65 }}>
            <div>{DEMO_CLUB.contact.email}</div>
            {DEMO_CLUB.contact.phones.map(p => (
              <div key={p}>{p}</div>
            ))}
            <a href={DEMO_CLUB.contact.web} style={{ color: 'var(--accent)', fontWeight: 700, textDecoration: 'none' }}>
              gravelriders.club
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
