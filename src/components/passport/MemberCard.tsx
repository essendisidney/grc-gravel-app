'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  checkInClubhouse,
  getClubhouseCheckIns,
  type ClubhouseCheckIn,
} from '@/lib/localStore'

type Props = {
  name: string
  membershipNumber: string
  title: string
  isCaptain?: boolean
}

export default function MemberCard({ name, membershipNumber, title, isCaptain }: Props) {
  const [open, setOpen] = useState(false)
  const [checkIns, setCheckIns] = useState<ClubhouseCheckIn[]>([])
  const [justIn, setJustIn] = useState<string | null>(null)

  useEffect(() => {
    setCheckIns(getClubhouseCheckIns())
  }, [])

  const pattern = useMemo(() => {
    // Deterministic faux QR from membership number
    const seed = membershipNumber.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
    const cells: boolean[] = []
    for (let i = 0; i < 49; i++) {
      cells.push(((seed * (i + 3)) % 7) > 2)
    }
    return cells
  }, [membershipNumber])

  function checkIn(house: 'tena' | 'utawala') {
    const next = checkInClubhouse(house)
    setCheckIns(next)
    setJustIn(house)
    window.setTimeout(() => setJustIn(null), 2200)
  }

  return (
    <div style={{ marginBottom: 16 }}>
      <button
        type="button"
        className="btn-secondary"
        onClick={() => setOpen(v => !v)}
        style={{ marginBottom: open ? 10 : 0 }}
      >
        {open ? 'Hide member card' : 'Show member card'}
      </button>

      {open && (
        <div
          style={{
            borderRadius: 20,
            overflow: 'hidden',
            background: 'linear-gradient(160deg, #0A0A0A 0%, #1C1814 100%)',
            color: '#fff',
            padding: 18,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.16em', color: '#FEC72E', textTransform: 'uppercase' }}>
                Gravel Riders Club
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, marginTop: 8, letterSpacing: '-0.02em' }}>{name}</div>
              <div style={{ fontSize: 12, opacity: 0.65, marginTop: 4 }}>
                {title}
                {isCaptain ? ' · Captain' : ''}
              </div>
              <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: '0.08em', marginTop: 12, color: '#FEC72E' }}>
                {membershipNumber}
              </div>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/grc-hex.png?v=3"
              alt=""
              width={48}
              height={48}
              style={{ borderRadius: 12, objectFit: 'cover', flexShrink: 0 }}
            />
          </div>

          <div
            style={{
              marginTop: 18,
              display: 'flex',
              gap: 14,
              alignItems: 'center',
              padding: 12,
              borderRadius: 14,
              background: 'rgba(255,255,255,0.06)',
            }}
          >
            <div
              style={{
                width: 84,
                height: 84,
                background: '#fff',
                borderRadius: 10,
                padding: 6,
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: 2,
                flexShrink: 0,
              }}
              aria-hidden
            >
              {pattern.map((on, i) => (
                <span
                  key={i}
                  style={{
                    background: on ? '#0A0A0A' : '#fff',
                    borderRadius: 1,
                  }}
                />
              ))}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 700, lineHeight: 1.4 }}>
                Gate / clubhouse check-in
              </div>
              <div style={{ fontSize: 11, opacity: 0.55, marginTop: 4, lineHeight: 1.4 }}>
                Demo QR — tap a house below. No live scanner yet.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            {(['tena', 'utawala'] as const).map(h => (
              <button
                key={h}
                type="button"
                onClick={() => checkIn(h)}
                style={{
                  flex: 1,
                  border: 'none',
                  borderRadius: 12,
                  padding: '12px 10px',
                  background: justIn === h ? '#FEC72E' : 'rgba(254,199,46,0.16)',
                  color: justIn === h ? '#0A0A0A' : '#FEC72E',
                  fontWeight: 800,
                  fontSize: 12,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  fontFamily: 'var(--font)',
                }}
              >
                {justIn === h ? 'Checked in' : h}
              </button>
            ))}
          </div>

          {checkIns[0] && (
            <div style={{ marginTop: 12, fontSize: 11, opacity: 0.5 }}>
              Last: {checkIns[0].clubhouse} · {new Date(checkIns[0].at).toLocaleString()}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
