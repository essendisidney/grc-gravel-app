'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

type Props = {
  title: string
  pace: string
  distanceKm: number
  elevationM: number
  elapsedLabel: string
  riderName?: string
}

export default function ShareRideCard({
  title,
  pace,
  distanceKm,
  elevationM,
  elapsedLabel,
  riderName = 'GRC rider',
}: Props) {
  const [copied, setCopied] = useState(false)

  async function copyCard() {
    const text = [
      `GRC · ${title}`,
      `${riderName} · ${pace}`,
      `${distanceKm} km · ${elevationM} m ↑ · ${elapsedLabel}`,
      'Ride beyond the tarmac · gravelriders.club',
    ].join('\n')
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      /* ignore */
    }
  }

  return (
    <div style={{ marginBottom: 14 }}>
      <div
        style={{
          borderRadius: 20,
          overflow: 'hidden',
          background: 'linear-gradient(155deg, #0A0A0A 0%, #1A1612 55%, #2A2218 100%)',
          color: '#fff',
          padding: 18,
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse at 90% 10%, rgba(254,199,46,0.28), transparent 45%)',
            pointerEvents: 'none',
          }}
        />
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/grc-hex.png?v=3"
              alt=""
              width={40}
              height={40}
              style={{ borderRadius: 10, objectFit: 'cover' }}
            />
            <div
              style={{
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: '#FEC72E',
              }}
            >
              Wave 10 · Share
            </div>
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.55 }}>
            {riderName}
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.03em', marginTop: 4, lineHeight: 1.15 }}>
            {title}
          </div>
          <div style={{ fontSize: 13, color: '#FEC72E', fontWeight: 700, marginTop: 8 }}>{pace} pack</div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: 10,
              marginTop: 18,
              paddingTop: 14,
              borderTop: '1px solid rgba(255,255,255,0.12)',
            }}
          >
            <div>
              <div style={{ fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.5 }}>Time</div>
              <div style={{ fontSize: 16, fontWeight: 800, marginTop: 4 }}>{elapsedLabel}</div>
            </div>
            <div>
              <div style={{ fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.5 }}>Km</div>
              <div style={{ fontSize: 16, fontWeight: 800, marginTop: 4 }}>{distanceKm}</div>
            </div>
            <div>
              <div style={{ fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.5 }}>Climb</div>
              <div style={{ fontSize: 16, fontWeight: 800, marginTop: 4 }}>{elevationM} m</div>
            </div>
          </div>
          <div style={{ marginTop: 16, fontSize: 11, opacity: 0.45, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Ride beyond the tarmac
          </div>
        </div>
      </div>
      <button type="button" className="btn-secondary" onClick={copyCard} style={{ marginTop: 10 }}>
        {copied ? <Check size={16} /> : <Copy size={16} />}
        {copied ? 'Copied' : 'Copy share text'}
      </button>
    </div>
  )
}
