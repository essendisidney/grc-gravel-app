'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
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
        maxWidth: 366,
        zIndex: 60,
        background: 'var(--charcoal)',
        color: '#fff',
        borderRadius: 16,
        padding: 14,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <Image
          src="/brand/logo.png"
          alt="GRC"
          width={40}
          height={40}
          style={{ borderRadius: 10, objectFit: 'cover', flexShrink: 0 }}
        />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 800 }}>Install GRC</div>
          <div style={{ fontSize: 12, opacity: 0.72, marginTop: 2, lineHeight: 1.35 }}>
            Add to home screen — offline shell, full-screen club app
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
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
            padding: '10px 12px',
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
            padding: '10px 14px',
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
    </div>
  )
}
