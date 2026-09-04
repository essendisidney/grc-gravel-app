'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import TopBar from '@/components/layout/TopBar'
import {
  clearDemoCaches,
  getNotifPrefs,
  resetSplash,
  setNotifPrefs,
  type NotifPrefs,
} from '@/lib/localStore'

const TOGGLES: { key: keyof NotifPrefs; label: string; hint: string }[] = [
  { key: 'rideReminders', label: 'Ride reminders', hint: 'Saturday roll-out pings' },
  { key: 'captainPings', label: 'Captain pings', hint: 'Pace group regroups' },
  { key: 'raceAlerts', label: 'Race alerts', hint: 'Full Gas openers' },
  { key: 'wrenchUpdates', label: 'Wrench updates', hint: 'Booking status' },
]

export default function SettingsPage() {
  const router = useRouter()
  const [prefs, setPrefs] = useState<NotifPrefs | null>(null)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    setPrefs(getNotifPrefs())
  }, [])

  function toggle(key: keyof NotifPrefs) {
    if (!prefs) return
    const next = { ...prefs, [key]: !prefs[key] }
    setPrefs(setNotifPrefs(next))
  }

  function replaySplash() {
    resetSplash()
    setMsg('Splash will play on next cold open — refresh now.')
    window.setTimeout(() => router.refresh(), 400)
  }

  function wipeDemo() {
    if (!confirm('Clear local demo data (RSVPs, packs, notes)? You stay signed in.')) return
    clearDemoCaches()
    setMsg('Demo caches cleared.')
    router.refresh()
  }

  return (
    <div>
      <TopBar showBack title="Settings" backHref="/passport" showNotifications={false} />
      <div className="animate-fade-in" style={{ padding: '0 16px 28px' }}>
        <div className="eyebrow" style={{ color: 'var(--accent)', marginBottom: 6 }}>Wave 13</div>
        <h1 style={{ margin: '0 0 8px', fontSize: 26, fontWeight: 800 }}>Club prefs</h1>
        <p style={{ margin: '0 0 16px', fontSize: 14, color: 'var(--muted)', lineHeight: 1.45 }}>
          Demo preferences on this device. Live push comes later with real backend.
        </p>

        {msg && (
          <div
            className="surface"
            style={{
              padding: 12,
              marginBottom: 12,
              background: 'var(--accent-soft)',
              border: '1px solid rgba(254,199,46,0.35)',
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            {msg}
          </div>
        )}

        <div className="eyebrow" style={{ marginBottom: 10 }}>Notifications</div>
        {prefs &&
          TOGGLES.map(t => (
            <button
              key={t.key}
              type="button"
              onClick={() => toggle(t.key)}
              className="surface"
              style={{
                width: '100%',
                padding: 14,
                marginBottom: 8,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 12,
                cursor: 'pointer',
                border: '1px solid var(--line)',
                fontFamily: 'var(--font)',
                color: 'var(--ink)',
                textAlign: 'left',
              }}
            >
              <div>
                <div style={{ fontWeight: 800, fontSize: 14 }}>{t.label}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{t.hint}</div>
              </div>
              <span className={prefs[t.key] ? 'chip accent' : 'chip'} style={{ border: 'none' }}>
                {prefs[t.key] ? 'ON' : 'OFF'}
              </span>
            </button>
          ))}

        <div className="eyebrow" style={{ margin: '18px 0 10px' }}>Device</div>
        <button type="button" className="btn-secondary" onClick={replaySplash} style={{ marginBottom: 8 }}>
          Replay brand splash
        </button>
        <button type="button" className="btn-secondary" onClick={wipeDemo} style={{ marginBottom: 8 }}>
          Clear demo data
        </button>
        <Link href="/profile/edit" className="btn-secondary" style={{ textDecoration: 'none', display: 'flex', marginBottom: 8 }}>
          Edit profile / SOS contact
        </Link>
        <Link href="/join" className="btn-secondary" style={{ textDecoration: 'none', display: 'flex' }}>
          Membership tiers · M-Pesa later
        </Link>
      </div>
    </div>
  )
}
