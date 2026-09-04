'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

/**
 * Cold-start brand splash — sits inside `.phone-shell` so it covers
 * the app frame (full-bleed on phones, framed preview on desktop).
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
    // Wait one frame so the phone shell paints first — logo lands in-place
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
        <Image
          src="/brand/logo.png"
          alt=""
          width={168}
          height={168}
          priority
          sizes="168px"
        />
      </div>
      <p className="grc-splash__whisper">Ride beyond the tarmac</p>
      <div className="grc-splash__bar" aria-hidden>
        <i />
      </div>
    </div>
  )
}
