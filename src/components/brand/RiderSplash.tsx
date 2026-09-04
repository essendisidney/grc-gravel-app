'use client'

import { useEffect, useState } from 'react'

/**
 * Cold-start brand splash — inside `.phone-shell` so it covers the app frame.
 * Skipped after first show in the session.
 */
export default function RiderSplash() {
  const [phase, setPhase] = useState<'boot' | 'show' | 'exit' | 'gone'>('boot')

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (sessionStorage.getItem('grc-splash-done') === '1') {
      setPhase('gone')
      return
    }

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const raf = window.requestAnimationFrame(() => setPhase('show'))

    const exitAt = reduce ? 500 : 2200
    const goneAt = reduce ? 800 : 2750

    const t1 = window.setTimeout(() => setPhase('exit'), exitAt)
    const t2 = window.setTimeout(() => {
      sessionStorage.setItem('grc-splash-done', '1')
      setPhase('gone')
    }, goneAt)

    return () => {
      window.cancelAnimationFrame(raf)
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
      <div className="grc-splash__mark">
        <span className="grc-splash__ring" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/grc-hex.png?v=3"
          alt=""
          width={168}
          height={168}
        />
      </div>
      <p className="grc-splash__whisper">Ride beyond the tarmac</p>
      <div className="grc-splash__bar" aria-hidden>
        <i />
      </div>
    </div>
  )
}
