'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getInitials, formatKm } from '@/lib/utils'
import { Settings, LogOut, Mountain, Bike } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { DEMO_PROFILE } from '@/lib/demo'
import { clearSession, getActivities, getBikes, getLiveBadges, getOfflinePacks, getSession, type GarageBike, type LiveBadge, type LocalSession, type OfflinePack, type RideActivity } from '@/lib/localStore'
import SeasonChallenge from '@/components/home/SeasonChallenge'
import SaturdayStreak from '@/components/home/SaturdayStreak'
import WeeklyGoal from '@/components/home/WeeklyGoal'
import MemberCard from '@/components/passport/MemberCard'
import InviteFriend from '@/components/club/InviteFriend'

export default function PassportClient({ profile, badges, recentRides }: {
  profile: any, badges: any[], recentRides: any[], raceResults?: any[]
}) {
  const router = useRouter()
  const [session, setLocal] = useState<LocalSession | null>(null)
  const [packs, setPacks] = useState<OfflinePack[]>([])
  const [activities, setActivities] = useState<RideActivity[]>([])
  const [bikes, setBikes] = useState<GarageBike[]>([])
  const [liveBadges, setLiveBadges] = useState<LiveBadge[]>([])

  useEffect(() => {
    setLocal(getSession())
    setPacks(getOfflinePacks())
    setActivities(getActivities())
    setBikes(getBikes())
    setLiveBadges(getLiveBadges())
  }, [])

  const name = session?.fullName || profile?.full_name || DEMO_PROFILE.full_name
  const title = session?.title || profile?.title || 'Club Member'
  const initials = getInitials(name)
  const expedition = liveBadges.length ? liveBadges : badges

  function signOut() {
    clearSession()
    router.push('/login')
    router.refresh()
  }

  return (
    <div className="animate-fade-in" style={{ padding: '0 16px 28px' }}>
      <div className="surface" style={{ padding: 18, marginBottom: 16, background: 'linear-gradient(165deg, #FFF8F1 0%, #FFFCFA 55%)' }}>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 16 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16, background: 'var(--accent)',
            color: 'var(--accent-ink)', fontWeight: 800, fontSize: 18,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {initials}
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800 }}>{name}</div>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 6 }}>
              {title} · {session?.phone || profile?.home_location_name || 'Nairobi'}
            </div>
            <span className="chip accent">{session?.isCaptain ? 'CAPTAIN' : profile?.membership_number || 'MEMBER'}</span>
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
            <div className="section-label" style={{ marginBottom: 3 }}>Member #</div>
            <div style={{ fontWeight: 800, letterSpacing: 1 }}>{profile?.membership_number}</div>
          </div>
          <Link href="/club/leaderboard" className="chip accent" style={{ textDecoration: 'none', border: 'none' }}>
            Season board
          </Link>
        </div>
      </div>

      <MemberCard
        name={name}
        membershipNumber={profile?.membership_number || 'GRC-0412'}
        title={title}
        isCaptain={session?.isCaptain}
      />

      {session?.isCaptain && (
        <Link href="/captain" className="btn-primary" style={{ textDecoration: 'none', display: 'flex', marginBottom: 14 }}>
          Open captain tools
        </Link>
      )}

      <div style={{ marginBottom: 16 }}>
        <SeasonChallenge compact />
      </div>
      <div style={{ marginBottom: 16 }}>
        <SaturdayStreak compact />
      </div>
      <div style={{ marginBottom: 16 }}>
        <WeeklyGoal compact />
      </div>

      <Link
        href="/passport/garage"
        className="surface"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: 14,
          marginBottom: 14,
          textDecoration: 'none',
          color: 'var(--ink)',
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: 'var(--charcoal)',
            color: '#fff',
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <Bike size={18} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 800, fontSize: 14 }}>Bike garage</div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
            {bikes.find(b => b.isPrimary)?.name || 'Add a bike'} · {bikes.length} in fleet
          </div>
        </div>
        <span className="chip accent" style={{ border: 'none' }}>Wave 9</span>
      </Link>

      <Link
        href="/ride/live?ride=ngong-magadi"
        className="btn-secondary"
        style={{ textDecoration: 'none', display: 'flex', marginBottom: 14 }}
      >
        Open on-ride companion
      </Link>

      {packs.length > 0 && (
        <div style={{ marginBottom: 18 }}>
          <div className="eyebrow" style={{ marginBottom: 10 }}>Offline packs · {packs.length}</div>
          {packs.map(p => (
            <Link
              key={p.routeId}
              href={`/discover/route/${p.routeId}`}
              className="surface"
              style={{
                display: 'block',
                padding: 12,
                marginBottom: 8,
                textDecoration: 'none',
                color: 'var(--ink)',
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 800 }}>{p.name}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 3 }}>
                {p.distanceKm} km · {p.gravelPct}% gravel · {p.signal} signal · GPX on device
              </div>
            </Link>
          ))}
        </div>
      )}

      {activities.length > 0 && (
        <div style={{ marginBottom: 18 }}>
          <div className="eyebrow" style={{ marginBottom: 10 }}>Activity · {activities.length}</div>
          {activities.slice(0, 8).map(a => (
            <div key={a.id} className="surface" style={{ padding: 12, marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                <div style={{ fontSize: 14, fontWeight: 800 }}>{a.title}</div>
                <span className="chip accent" style={{ border: 'none' }}>{a.paceGroupName}</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>
                {a.distanceKm} km · {Math.floor(a.elapsedSec / 60)} min · {a.elevationM} m ↑ ·{' '}
                {new Date(a.endedAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginBottom: 18 }}>
        <div className="eyebrow" style={{ marginBottom: 10 }}>
          Expedition badges · {expedition.filter((b: any) => b.earned).length}/{expedition.length}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {expedition.map((b: any) => {
            const badgeName = b.name || b.badge_definitions?.name || 'Badge'
            const earned = b.earned !== false
            return (
              <div
                key={b.id || badgeName}
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
                  <Mountain size={16} color={earned ? 'var(--accent-ink)' : 'var(--muted)'} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.3 }}>{badgeName}</div>
                  {b.hint && (
                    <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 3, lineHeight: 1.3 }}>
                      {earned ? 'Unlocked' : b.hint}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <InviteFriend />

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
        <button onClick={signOut} className="btn-danger" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <LogOut size={15} /> Sign out
        </button>
      </div>
    </div>
  )
}
