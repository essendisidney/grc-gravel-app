'use client'

import { useEffect, useState } from 'react'
import { Download } from 'lucide-react'

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function PwaRegister() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null)
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!('serviceWorker' in navigator)) return

    navigator.serviceWorker.register('/sw.js').catch(() => {})

    const onBip = (e: Event) => {
      e.preventDefault()
      setDeferred(e as BeforeInstallPromptEvent)
      const dismissed = localStorage.getItem('grc-pwa-dismiss')
      if (!dismissed) setShow(true)
    }
    window.addEventListener('beforeinstallprompt', onBip)
    return () => window.removeEventListener('beforeinstallprompt', onBip)
  }, [])

  async function install() {
    if (!deferred) return
    await deferred.prompt()
    await deferred.userChoice
    setDeferred(null)
    setShow(false)
  }

  function dismiss() {
    localStorage.setItem('grc-pwa-dismiss', '1')
    setShow(false)
  }

  if (!show) return null

  return (
    <div
      style={{
        position: 'fixed',
        left: '50%',
        transform: 'translateX(-50%)',
        bottom: 'calc(var(--nav-h) + 12px + env(safe-area-inset-bottom))',
        width: 'calc(100% - 28px)',
        maxWidth: 402,
        zIndex: 60,
        background: 'var(--charcoal)',
        color: '#fff',
        borderRadius: 16,
        padding: '14px 14px 14px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 800 }}>Install GRC</div>
        <div style={{ fontSize: 12, opacity: 0.72, marginTop: 2 }}>
          Add to home screen — offline shell, full-screen club app
        </div>
      </div>
      <button
        type="button"
        onClick={dismiss}
        style={{
          background: 'transparent',
          border: 'none',
          color: 'rgba(255,255,255,0.55)',
          fontSize: 12,
          fontWeight: 600,
          cursor: 'pointer',
          fontFamily: 'var(--font)',
        }}
      >
        Later
      </button>
      <button
        type="button"
        onClick={install}
        className="pressable"
        style={{
          border: 'none',
          borderRadius: 12,
          padding: '10px 12px',
          background: 'var(--accent)',
          color: '#fff',
          fontWeight: 700,
          fontSize: 12,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          cursor: 'pointer',
          fontFamily: 'var(--font)',
        }}
      >
        <Download size={14} /> Install
      </button>
    </div>
  )
}
