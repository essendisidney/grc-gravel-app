'use client'

import { useEffect, useState } from 'react'

export default function RiderSplash() {
  const [phase, setPhase] = useState<'boot' | 'show' | 'exit' | 'gone'>('boot')

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (sessionStorage.getItem('grc-splash-done') === '1') {
      setPhase('gone')
      return
    }

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setPhase('show')

    const exitAt = reduce ? 600 : 2400
    const goneAt = reduce ? 900 : 3000

    const t1 = window.setTimeout(() => setPhase('exit'), exitAt)
    const t2 = window.setTimeout(() => {
      sessionStorage.setItem('grc-splash-done', '1')
      setPhase('gone')
    }, goneAt)

    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
    }
  }, [])

  if (phase === 'boot' || phase === 'gone') return null

  return (
    <div
      className={`grc-splash ${phase === 'exit' ? 'grc-splash--exit' : ''}`}
      aria-hidden="true"
      role="presentation"
    >
      <div className="grc-splash__orb">
        {/* orbit ring */}
        <svg className="grc-splash__ring" viewBox="0 0 120 120" width="120" height="120">
          <circle
            cx="60"
            cy="60"
            r="52"
            fill="none"
            stroke="rgba(224,122,47,0.22)"
            strokeWidth="1.5"
            strokeDasharray="3 5"
            className="grc-splash__ring-dash"
          />
          <circle
            cx="60"
            cy="60"
            r="44"
            fill="none"
            stroke="rgba(255,252,250,0.12)"
            strokeWidth="1"
          />
          {/* tiny rider orbiting the ring — counter-rotated so they stay upright */}
          <g className="grc-splash__orbit">
            <g transform="translate(60, 8)">
              <g className="grc-splash__rider-fix">
                <circle cx="-7" cy="4" r="3.2" stroke="#E07A2F" strokeWidth="1.2" fill="none" />
                <circle cx="7" cy="4" r="3.2" stroke="#E07A2F" strokeWidth="1.2" fill="none" />
                <path d="M-7 4 L0 -2 L7 4 M0 -2 L3 -6" stroke="#FFFCFA" strokeWidth="1.3" strokeLinecap="round" fill="none" />
                <circle cx="1" cy="-9" r="2.2" fill="#FFFCFA" />
              </g>
            </g>
          </g>
        </svg>

        {/* center crest */}
        <div className="grc-splash__crest">
          <span className="grc-splash__grc">GRC</span>
          <span className="grc-splash__pulse" />
        </div>

        {/* dust motes */}
        <i className="grc-splash__mote m1" />
        <i className="grc-splash__mote m2" />
        <i className="grc-splash__mote m3" />
      </div>

      <p className="grc-splash__whisper">Ride beyond the tarmac</p>
    </div>
  )
}
