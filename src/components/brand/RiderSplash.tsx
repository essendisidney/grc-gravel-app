'use client'

import { useEffect, useState } from 'react'

const LINES = [
  'Rolling out…',
  'Beyond the tarmac',
  'Dust · climb · sightlines',
]

export default function RiderSplash() {
  const [phase, setPhase] = useState<'boot' | 'show' | 'exit' | 'gone'>('boot')
  const [lineIdx, setLineIdx] = useState(0)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (sessionStorage.getItem('grc-splash-done') === '1') {
      setPhase('gone')
      return
    }

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setPhase('show')

    // One deliberate beat per line — no rush
    const lineTimer = reduce
      ? null
      : window.setInterval(() => {
          setLineIdx(i => {
            if (i >= LINES.length - 1) {
              if (lineTimer) window.clearInterval(lineTimer)
              return i
            }
            return i + 1
          })
        }, 1700)

    const exitAt = reduce ? 900 : 5600
    const goneAt = reduce ? 1300 : 6800

    const t1 = window.setTimeout(() => setPhase('exit'), exitAt)
    const t2 = window.setTimeout(() => {
      sessionStorage.setItem('grc-splash-done', '1')
      setPhase('gone')
    }, goneAt)

    return () => {
      if (lineTimer) window.clearInterval(lineTimer)
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
      <div className="grc-splash__glow" />
      <div className="grc-splash__topo" />

      <div className="grc-splash__stage">
        {/* scrolling road */}
        <div className="grc-splash__horizon" />
        <div className="grc-splash__road">
          <div className="grc-splash__dashes" />
        </div>

        {/* dust kicks */}
        <span className="grc-splash__dust d1" />
        <span className="grc-splash__dust d2" />
        <span className="grc-splash__dust d3" />
        <span className="grc-splash__dust d4" />
        <span className="grc-splash__dust d5" />

        {/* rider SVG */}
        <svg
          className="grc-splash__bike"
          viewBox="0 0 220 140"
          width="220"
          height="140"
          fill="none"
          aria-hidden
        >
          {/* rear wheel */}
          <g className="grc-splash__wheel grc-splash__wheel--rear">
            <circle cx="48" cy="98" r="28" stroke="#E07A2F" strokeWidth="3.5" />
            <circle cx="48" cy="98" r="4" fill="#E07A2F" />
            <path d="M48 70 L48 126 M20 98 L76 98 M28 78 L68 118 M28 118 L68 78" stroke="#E07A2F" strokeWidth="1.6" opacity="0.85" />
          </g>

          {/* front wheel */}
          <g className="grc-splash__wheel grc-splash__wheel--front">
            <circle cx="168" cy="98" r="28" stroke="#E07A2F" strokeWidth="3.5" />
            <circle cx="168" cy="98" r="4" fill="#E07A2F" />
            <path d="M168 70 L168 126 M140 98 L196 98 M148 78 L188 118 M148 118 L188 78" stroke="#E07A2F" strokeWidth="1.6" opacity="0.85" />
          </g>

          {/* frame + rider body (bobs) */}
          <g className="grc-splash__body">
            {/* frame */}
            <path
              d="M48 98 L95 70 L130 98 M95 70 L120 55 L155 70 L168 98 M95 70 L78 98"
              stroke="#FFFCFA"
              strokeWidth="3.2"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {/* seat */}
            <path d="M88 68 L104 64" stroke="#FFFCFA" strokeWidth="3" strokeLinecap="round" />
            {/* bars */}
            <path d="M155 70 L168 58 L178 56" stroke="#FFFCFA" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

            {/* rider */}
            <circle cx="118" cy="38" r="11" fill="#FFFCFA" />
            {/* helmet stripe */}
            <path d="M108 34 Q118 26 128 34" stroke="#E07A2F" strokeWidth="2.5" fill="none" />
            {/* torso */}
            <path d="M118 48 L108 72 L130 68 Z" fill="#E07A2F" />
            {/* arms to bars */}
            <path d="M118 52 L155 66" stroke="#FFFCFA" strokeWidth="3" strokeLinecap="round" />
            {/* back arm */}
            <path d="M114 54 L100 68" stroke="#FFFCFA" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />

            {/* pedaling crank */}
            <g className="grc-splash__crank">
              <circle cx="108" cy="98" r="7" stroke="#FFFCFA" strokeWidth="2.5" />
              <path d="M108 91 L108 78" stroke="#FFFCFA" strokeWidth="3" strokeLinecap="round" />
              <path d="M108 105 L108 118" stroke="#E07A2F" strokeWidth="3" strokeLinecap="round" />
            </g>
            <path d="M112 72 L108 90" stroke="#FFFCFA" strokeWidth="3.2" strokeLinecap="round" />
            <path d="M112 72 L118 94" stroke="#E07A2F" strokeWidth="3.2" strokeLinecap="round" opacity="0.9" />
          </g>
        </svg>
      </div>

      <div className="grc-splash__brand">
        <div className="grc-splash__mark">GRC</div>
        <div className="grc-splash__line" key={lineIdx}>
          {LINES[lineIdx]}
        </div>
        <div className="grc-splash__trail">
          <div className="grc-splash__trail-fill" />
        </div>
      </div>
    </div>
  )
}
