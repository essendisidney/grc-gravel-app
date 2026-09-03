'use client'

import { useState } from 'react'
import Link from 'next/link'
import { getInitials, formatKm } from '@/lib/utils'
import { Settings, LogOut, Mountain } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { DEMO_BADGES, DEMO_CLUB } from '@/lib/demo'

export default function PassportClient({ profile, badges, recentRides }: {
  profile: any, badges: any[], recentRides: any[], raceResults?: any[]
}) {
  const router = useRouter()
  const [showQR, setShowQR] = useState(false)
  const initials = getInitials(profile?.full_name || 'GRC Member')
  const expedition = badges?.length ? badges : DEMO_BADGES

  return (
    <div className="animate-fade-in" style={{ padding: '0 16px 28px' }}>
      <div className="surface" style={{ padding: 18, marginBottom: 16, background: 'linear-gradient(165deg, #FFF8F1 0%, #FFFCFA 55%)' }}>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 16 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16, background: 'var(--accent)',
            color: '#fff', fontWeight: 800, fontSize: 18,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {initials}
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800 }}>{profile?.full_name}</div>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 6 }}>
              {profile?.title || (profile?.is_elite_team ? 'Elite Team' : 'Club Member')} · {profile?.home_location_name || 'Nairobi'}
            </div>
            <span className="chip accent">{profile?.membership_number}</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, borderTop: '1px solid var(--line)', paddingTop: 14 }}>
          {[
            { val: profile?.total_rides || 0, label: 'Rides' },
            { val: profile?.total_km ? formatKm(profile.total_km) : '0 km', label: 'Distance' },
            { val: profile?.total_races || 0, label: 'Races' },
          ].map(({ val, label }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 800 }}>{val}</div>
              <div className="section-label">{label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--line)' }}>
          <div>
            <div className="section-label" style={{ marginBottom: 3 }}>Member card</div>
            <div style={{ fontWeight: 800, letterSpacing: 1 }}>{profile?.membership_number}</div>
          </div>
          <button onClick={() => setShowQR(!showQR)} className="chip">Show card</button>
        </div>
        {showQR && (
          <div style={{ marginTop: 12, padding: 16, background: 'var(--bg)', borderRadius: 12, textAlign: 'center', fontSize: 12, color: 'var(--muted)' }}>
            Check-in at {DEMO_CLUB.clubhouses[0].name} / Utawala
          </div>
        )}
      </div>

      <div style={{ marginBottom: 18 }}>
        <div className="eyebrow" style={{ marginBottom: 10 }}>Expedition badges</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {expedition.map((b: any) => {
            const name = b.name || b.badge_definitions?.name || 'Badge'
            const earned = b.earned !== false
            return (
              <div
                key={b.id || name}
                className="surface"
                style={{
                  padding: 14,
                  opacity: earned ? 1 : 0.45,
                  display: 'flex',
                  gap: 10,
                  alignItems: 'center',
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: earned ? 'var(--accent-soft)' : 'var(--bg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Mountain size={16} color={earned ? 'var(--accent)' : 'var(--muted)'} />
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.3 }}>{name}</div>
              </div>
            )
          })}
        </div>
      </div>

      {recentRides.length > 0 && (
        <div style={{ marginBottom: 18 }}>
          <div className="eyebrow" style={{ marginBottom: 10 }}>Recent rides</div>
          {recentRides.map((reg: any) => (
            <div key={reg.id} className="surface" style={{ padding: 12, marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{reg.rides?.title}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>{reg.rides?.ride_date}</div>
              </div>
              <span className="chip" style={{ cursor: 'default' }}>{reg.status}</span>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
        <Link href="/feed" style={{ flex: 1, textDecoration: 'none' }}>
          <button className="btn-secondary">Club news</button>
        </Link>
        <Link href="/wrench" style={{ flex: 1, textDecoration: 'none' }}>
          <button className="btn-secondary">Wrench</button>
        </Link>
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <Link href="/profile/edit" style={{ flex: 1, textDecoration: 'none' }}>
          <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <Settings size={15} /> Edit
          </button>
        </Link>
        <button onClick={() => router.push('/login')} className="btn-danger" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <LogOut size={15} /> Sign out
        </button>
      </div>
    </div>
  )
}
