'use client'

import { useEffect, useState } from 'react'
import { Compass, CalendarDays, Wrench, Flag } from 'lucide-react'
import { completeOnboarding, hasCompletedOnboarding } from '@/lib/localStore'

const STEPS = [
  {
    icon: Compass,
    title: 'Discover gravel',
    body: 'Route intel, offline packs, and Magadi dust reports — before you leave the gate.',
  },
  {
    icon: CalendarDays,
    title: 'Niko in on Saturdays',
    body: 'Pick a pace group, add to calendar, roll with captains from Tena & Utawala.',
  },
  {
    icon: Flag,
    title: 'Race & climb',
    body: 'Full Gas race day, Rift 500 season board, and badges that unlock as you ride.',
  },
  {
    icon: Wrench,
    title: 'Wrench at the house',
    body: 'Book The Gravel, log bike service, keep SOS contacts ready for on-ride.',
  },
]

export default function Onboarding() {
  const [show, setShow] = useState(false)
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (!hasCompletedOnboarding()) setShow(true)
  }, [])

  if (!show) return null

  const s = STEPS[step]
  const Icon = s.icon
  const last = step === STEPS.length - 1

  function finish() {
    completeOnboarding()
    setShow(false)
  }

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 9000,
        background: 'rgba(10,10,10,0.55)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        borderRadius: 'inherit',
      }}
    >
      <div
        className="animate-fade-in"
        style={{
          width: '100%',
          background: 'var(--bg)',
          borderRadius: '22px 22px 0 0',
          padding: '20px 16px calc(20px + env(safe-area-inset-bottom))',
        }}
      >
        <div className="eyebrow" style={{ color: 'var(--accent)', marginBottom: 8 }}>
          Wave 15 · Welcome
        </div>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            background: 'var(--accent)',
            color: 'var(--accent-ink)',
            display: 'grid',
            placeItems: 'center',
            marginBottom: 14,
          }}
        >
          <Icon size={22} />
        </div>
        <h2 style={{ margin: '0 0 8px', fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em' }}>
          {s.title}
        </h2>
        <p style={{ margin: '0 0 16px', fontSize: 14, color: 'var(--muted)', lineHeight: 1.5 }}>
          {s.body}
        </p>
        <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
          {STEPS.map((_, i) => (
            <span
              key={i}
              style={{
                flex: 1,
                height: 4,
                borderRadius: 999,
                background: i <= step ? 'var(--accent)' : 'var(--line)',
              }}
            />
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {!last && (
            <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={finish}>
              Skip
            </button>
          )}
          <button
            type="button"
            className="btn-primary"
            style={{ flex: 1 }}
            onClick={() => (last ? finish() : setStep(v => v + 1))}
          >
            {last ? 'Let’s ride' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  )
}
