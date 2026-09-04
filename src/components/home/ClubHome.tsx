'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight, Check, X } from 'lucide-react'
import { formatRideDate, formatTime } from '@/lib/utils'
import type { DemoRide } from '@/lib/demo'
import { DEMO_PROFILE, DEMO_WEEK_STATS } from '@/lib/demo'
import GrcLogo from '@/components/brand/GrcLogo'
import WeatherBriefing from '@/components/home/WeatherBriefing'
import AnnouncementsStrip from '@/components/home/AnnouncementsStrip'
import RideStatusBanner from '@/components/home/RideStatusBanner'
import SeasonChallenge from '@/components/home/SeasonChallenge'
import SaturdayStreak from '@/components/home/SaturdayStreak'
import WeeklyGoal from '@/components/home/WeeklyGoal'
import WeekSchedule from '@/components/home/WeekSchedule'
import GravelTips from '@/components/home/GravelTips'
import DustSeasonCard from '@/components/home/DustSeasonCard'
import ClubEventsStrip from '@/components/home/ClubEventsStrip'
import RollOutBanner from '@/components/home/RollOutBanner'
import HeatWindAdvisory from '@/components/home/HeatWindAdvisory'
import HomeClubhousePicker from '@/components/home/HomeClubhousePicker'
import WeekDigestStrip from '@/components/home/WeekDigestStrip'
import RollOutCountdown from '@/components/home/RollOutCountdown'
import MorningPrepChecklist from '@/components/home/MorningPrepChecklist'
import DelayBanner from '@/components/home/DelayBanner'
import SunriseWindow from '@/components/home/SunriseWindow'
import NewRiderTip from '@/components/home/NewRiderTip'
import AddToCalendarButton from '@/components/rides/AddToCalendarButton'
import { getFavoritePaceId, getRsvp, getRideStatus, getSession, hasWaiver, setRsvp, setWaiver, markSaturdayRidden, type RideDayStatus } from '@/lib/localStore'
import NotifBell from '@/components/layout/NotifBell'
import SearchChip from '@/components/layout/SearchChip'

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
  const [joined, setJoined] = useState(false)
  const [paceName, setPaceName] = useState('')
  const [sheet, setSheet] = useState(false)
  const [paceId, setPaceId] = useState(adventure?.pace_groups?.[1]?.id || adventure?.pace_groups?.[0]?.id || '')
  const [firstName, setFirstName] = useState((DEMO_PROFILE.full_name || 'Rider').split(' ')[0].toUpperCase())
  const [waiver, setWaiverOn] = useState(false)
  const [rideStatus, setRideStatusLocal] = useState<RideDayStatus>('on')

  useEffect(() => {
    const s = getSession()
    if (s?.fullName) setFirstName(s.fullName.split(' ')[0].toUpperCase())
    if (!adventure) return
    setRideStatusLocal(getRideStatus(adventure.id))
    const fav = getFavoritePaceId()
    const r = getRsvp(adventure.id)
    if (r) {
      setJoined(true)
      setPaceName(r.paceGroupName)
      setPaceId(r.paceGroupId)
    } else if (adventure.pace_groups?.some(g => g.id === fav)) {
      setPaceId(fav)
    }
    if (hasWaiver(adventure.id)) setWaiverOn(true)
  }, [adventure])

  if (!adventure) return null

  const cover = adventure.cover_image || '/brand/hero-adventure.jpg'
  const going = adventure.registration_count || 0
  const groups = adventure.pace_groups || []

  function confirmJoin() {
    if (!waiver) return
    const group = groups.find(g => g.id === paceId)
    setWaiver(adventure.id)
    setRsvp({
      rideId: adventure.id,
      paceGroupId: paceId || 'cruiser',
      paceGroupName: group?.name || 'Cruiser',
      status: 'registered',
      joinedAt: new Date().toISOString(),
    })
    setJoined(true)
    setPaceName(group?.name || 'Cruiser')
    markSaturdayRidden()
    setSheet(false)
  }

  return (
    <div className="animate-fade-in" style={{ paddingBottom: 12 }}>
      <div className="stagger" style={{ padding: '14px 20px 10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <GrcLogo size={36} rounded={11} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="eyebrow" style={{ color: 'var(--accent)', margin: 0 }}>
              {greeting()}, {firstName}
            </div>
            <NotifBell />
            <SearchChip />
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
        <div className="hero-media" style={{ aspectRatio: '4 / 3', maxHeight: '46dvh' }}>
          <Image
            src={cover}
            alt={adventure.title}
            fill
            priority
            sizes="(max-width: 480px) 100vw, 390px"
            className="hero-zoom"
            style={{ objectFit: 'cover', objectPosition: 'center 42%' }}
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
        {rideStatus === 'cancelled' || rideStatus === 'postponed' ? (
          <button type="button" className="btn-primary" disabled style={{ opacity: 0.85 }}>
            {rideStatus === 'cancelled' ? 'Ride cancelled' : 'Ride postponed'}
          </button>
        ) : joined ? (
          <>
            <Link
              href={`/ride/live?ride=${adventure.id}`}
              className="btn-primary"
              style={{ textDecoration: 'none', display: 'flex' }}
            >
              START RIDE <ArrowUpRight size={18} strokeWidth={2.4} />
            </Link>
            <div
              style={{
                textAlign: 'center',
                marginTop: 10,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--good)',
              }}
            >
              <Check size={12} style={{ display: 'inline', verticalAlign: -1 }} /> You’re in
              {paceName ? ` · ${paceName}` : ''}
            </div>
          </>
        ) : (
          <button type="button" className="btn-primary" onClick={() => setSheet(true)}>
            JOIN RIDE <ArrowUpRight size={18} strokeWidth={2.4} />
          </button>
        )}
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
        <div style={{ marginTop: 10 }}>
          <AddToCalendarButton ride={adventure} />
        </div>
      </div>

      <RideStatusBanner rideId={adventure.id} />

      <RollOutBanner />

      <DelayBanner rideId={adventure.id} />

      <AnnouncementsStrip />

      <div style={{ padding: '14px 14px 0' }}>
        <SeasonChallenge />
        <SaturdayStreak />
        <WeeklyGoal />
        <HomeClubhousePicker />
        <RollOutCountdown
          rideDate={adventure.ride_date}
          startTime={adventure.start_time}
          title={adventure.route_label || adventure.title}
        />
        {joined && <MorningPrepChecklist rideId={adventure.id} />}
        <SunriseWindow startTime={adventure.start_time} />
        <NewRiderTip />
        <WeekDigestStrip />
        <DustSeasonCard />
        <HeatWindAdvisory />
        <ClubEventsStrip />
        <GravelTips />
      </div>

      <div style={{ padding: '22px 14px 8px' }}>
        <WeatherBriefing />
        {joined && (
          <ReminderCard
            title={adventure.route_label || adventure.title}
            startTime={adventure.start_time}
          />
        )}
        <WeekSchedule rides={rides} />
        <div className="eyebrow" style={{ margin: '18px 0 12px' }}>This week · stats</div>
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

      {sheet && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 80,
            background: 'rgba(14,12,10,0.55)',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
          }}
          onClick={() => setSheet(false)}
        >
          <div
            className="animate-fade-in"
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%',
              background: 'var(--bg)',
              borderRadius: '22px 22px 0 0',
              padding: '18px 16px calc(18px + env(safe-area-inset-bottom))',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div>
                <div className="eyebrow" style={{ marginBottom: 4 }}>Join ride</div>
                <div style={{ fontSize: 18, fontWeight: 800 }}>{adventure.route_label || adventure.title}</div>
              </div>
              <button
                type="button"
                onClick={() => setSheet(false)}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  border: '1px solid var(--line)',
                  background: 'var(--surface)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <X size={16} />
              </button>
            </div>
            <div className="section-label" style={{ marginBottom: 10 }}>Pace group</div>
            {groups.map(g => {
              const on = paceId === g.id
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setPaceId(g.id)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    marginBottom: 8,
                    padding: 12,
                    borderRadius: 12,
                    border: `1px solid ${on ? 'rgba(254,199,46,0.5)' : 'var(--line)'}`,
                    background: on ? 'var(--accent-soft)' : 'var(--surface)',
                    cursor: 'pointer',
                    fontFamily: 'var(--font)',
                    color: 'var(--ink)',
                  }}
                >
                  <div style={{ fontWeight: 800 }}>{g.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
                    ~{g.avg_kph} km/h · Capt {g.captain?.split(' ')[0] || 'TBD'} · {g.count} going
                  </div>
                </button>
              )
            })}
            <label
              style={{
                display: 'flex',
                gap: 10,
                alignItems: 'flex-start',
                margin: '12px 0 14px',
                fontSize: 12,
                lineHeight: 1.45,
                color: 'var(--muted)',
                cursor: 'pointer',
              }}
            >
              <input
                type="checkbox"
                checked={waiver}
                onChange={e => setWaiverOn(e.target.checked)}
                style={{ marginTop: 2, width: 18, height: 18, accentColor: 'var(--accent)', flexShrink: 0 }}
              />
              <span>
                I accept the GRC ride waiver — I ride at my own risk on public & gravel roads, carry ID, and follow captain instructions.
              </span>
            </label>
            <button type="button" className="btn-primary" disabled={!waiver} onClick={confirmJoin}>
              Confirm — Niko in
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function ReminderCard({ title, startTime }: { title: string; startTime?: string }) {
  const [status, setStatus] = useState<'idle' | 'on' | 'blocked'>('idle')

  async function enable() {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      setStatus('blocked')
      return
    }
    const perm = await Notification.requestPermission()
    if (perm !== 'granted') {
      setStatus('blocked')
      return
    }
    // Demo: fire a sample reminder now so the rider sees it works
    new Notification('GRC ride reminder', {
      body: `${title} · roll-out ${(startTime || '06:15').slice(0, 5)}. Lights on.`,
      icon: '/icons/icon-192.png',
      tag: 'grc-ride-reminder',
    })
    localStorage.setItem('grc-remind-enabled', '1')
    setStatus('on')
  }

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (localStorage.getItem('grc-remind-enabled') === '1') setStatus('on')
  }, [])

  return (
    <div className="surface" style={{ padding: 12, marginBottom: 12, display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'center' }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 800 }}>Ride reminder</div>
        <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
          {status === 'on'
            ? 'Notifications on for this device'
            : status === 'blocked'
              ? 'Permission blocked in browser settings'
              : 'Ping before roll-out (demo)'}
        </div>
      </div>
      {status !== 'on' && (
        <button type="button" className="chip accent" style={{ border: 'none', cursor: 'pointer' }} onClick={enable}>
          Enable
        </button>
      )}
    </div>
  )
}
