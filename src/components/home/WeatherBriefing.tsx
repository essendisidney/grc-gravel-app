'use client'

import { useEffect, useState } from 'react'
import { CloudSun, Droplets, Wind } from 'lucide-react'
import type { ReactNode } from 'react'

type WeatherBrief = {
  tempC: number
  windKph: number
  precipMm: number
  code: number
  label: string
}

function codeLabel(code: number) {
  if (code === 0) return 'Clear skies'
  if (code <= 3) return 'Partly cloudy'
  if (code <= 48) return 'Fog risk'
  if (code <= 67) return 'Rain possible'
  if (code <= 77) return 'Showers / flurries'
  if (code <= 82) return 'Heavy showers'
  return 'Storm watch'
}

function goCall(wx: WeatherBrief): { call: 'GO' | 'CAUTION' | 'NO-GO'; note: string } {
  if (wx.precipMm >= 4 || wx.code >= 80) {
    return { call: 'NO-GO', note: 'Heavy wet — hold or shorten. Dust turns to grease.' }
  }
  if (wx.windKph >= 35 || wx.precipMm >= 1 || wx.code >= 61) {
    return { call: 'CAUTION', note: 'Wind or light rain — lights on, extra bottles, regroup early.' }
  }
  if (wx.tempC >= 30) {
    return { call: 'CAUTION', note: 'Hot Rift day — start early, salt + water.' }
  }
  return { call: 'GO', note: 'Skies look rideable. Roll Magadi with the pack.' }
}

export default function WeatherBriefing() {
  const [wx, setWx] = useState<WeatherBrief | null>(null)
  const [err, setErr] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=-1.2864&longitude=36.8172&current=temperature_2m,precipitation,weather_code,wind_speed_10m&wind_speed_unit=kmh&timezone=Africa%2FNairobi',
    )
      .then(r => r.json())
      .then(data => {
        if (cancelled) return
        const c = data?.current
        if (!c) throw new Error('no current')
        setWx({
          tempC: Math.round(c.temperature_2m),
          windKph: Math.round(c.wind_speed_10m),
          precipMm: c.precipitation ?? 0,
          code: c.weather_code,
          label: codeLabel(c.weather_code),
        })
      })
      .catch(() => {
        if (!cancelled) setErr(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  if (err) {
    return (
      <div className="surface" style={{ padding: 12, marginBottom: 12 }}>
        <div className="eyebrow" style={{ marginBottom: 4 }}>Ride weather</div>
        <div style={{ fontSize: 13, color: 'var(--muted)' }}>Couldn’t reach forecast — check dust & carry water.</div>
      </div>
    )
  }

  if (!wx) {
    return (
      <div className="surface" style={{ padding: 12, marginBottom: 12 }}>
        <div className="eyebrow" style={{ marginBottom: 4 }}>Ride weather</div>
        <div style={{ fontSize: 13, color: 'var(--muted)' }}>Reading Nairobi skies…</div>
      </div>
    )
  }

  const verdict = goCall(wx)
  const callColor =
    verdict.call === 'GO' ? 'var(--good)' : verdict.call === 'NO-GO' ? 'var(--bad)' : 'var(--warn)'

  return (
    <div className="surface" style={{ padding: 14, marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
        <div>
          <div className="eyebrow" style={{ marginBottom: 6 }}>Ride weather · Nairobi</div>
          <div style={{ fontSize: 16, fontWeight: 800 }}>{wx.label}</div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>Open-Meteo · live</div>
        </div>
        <CloudSun size={22} color="var(--accent-ink)" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: 12 }}>
        <WxChip icon={<CloudSun size={13} />} label={`${wx.tempC}°C`} />
        <WxChip icon={<Wind size={13} />} label={`${wx.windKph} km/h`} />
        <WxChip icon={<Droplets size={13} />} label={`${wx.precipMm} mm`} />
      </div>
      <div
        style={{
          marginTop: 12,
          padding: 12,
          borderRadius: 12,
          background: 'var(--bg)',
          display: 'flex',
          gap: 10,
          alignItems: 'flex-start',
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: '0.1em',
            color: callColor,
            flexShrink: 0,
            paddingTop: 2,
          }}
        >
          {verdict.call}
        </span>
        <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.4 }}>{verdict.note}</div>
      </div>
    </div>
  )
}

function WxChip({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        padding: '8px 6px',
        borderRadius: 10,
        background: 'var(--bg)',
        fontSize: 12,
        fontWeight: 700,
      }}
    >
      {icon}
      {label}
    </div>
  )
}
