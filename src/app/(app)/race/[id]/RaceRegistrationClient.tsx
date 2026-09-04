'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Loader2, CheckCircle2, Flag } from 'lucide-react'
import { formatKES } from '@/lib/utils'
import { getRaceEntry, getSession, setRaceEntry } from '@/lib/localStore'

interface RaceRegistrationClientProps {
  raceId: string
  categories: any[]
  userRegistration: any
  regCounts: Record<string, number>
}

export default function RaceRegistrationClient({
  raceId,
  categories,
  regCounts,
}: RaceRegistrationClientProps) {
  const [selectedCat, setSelectedCat] = useState<any>(null)
  const [step, setStep] = useState<'select' | 'confirm' | 'done'>('select')
  const [loading, setLoading] = useState(false)
  const [entry, setEntry] = useState(() => (typeof window !== 'undefined' ? getRaceEntry(raceId) : null))
  const [bib, setBib] = useState(0)

  useEffect(() => {
    setEntry(getRaceEntry(raceId))
  }, [raceId])

  if (entry || step === 'done') {
    const e = entry || {
      bib,
      categoryName: selectedCat?.name || 'Category',
      raceId,
    }
    return (
      <div className="surface" style={{ padding: 18 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
          <CheckCircle2 size={24} color="var(--good)" />
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--good)' }}>You’re on the start list</div>
            <div style={{ fontSize: 13, color: 'var(--muted)' }}>
              {e.categoryName} · Bib #{e.bib}
            </div>
          </div>
        </div>
        <p style={{ margin: '0 0 12px', fontSize: 12, color: 'var(--muted)', lineHeight: 1.45 }}>
          Entry fee via M-Pesa comes later — bib reserved on this device for race-day demo.
        </p>
        <Link
          href={`/race/${raceId}/day`}
          className="btn-primary"
          style={{ textDecoration: 'none', display: 'flex' }}
        >
          <Flag size={16} /> Open race day
        </Link>
      </div>
    )
  }

  async function confirmEntry() {
    if (!selectedCat) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 500))
    const assignedBib = 100 + Math.floor(Math.random() * 80)
    const session = getSession()
    const next = {
      raceId,
      categoryId: selectedCat.id,
      categoryName: selectedCat.name,
      bib: assignedBib,
      phone: session?.phone || '',
      registeredAt: new Date().toISOString(),
    }
    setRaceEntry(next)
    setEntry(next)
    setBib(assignedBib)
    setStep('done')
    setLoading(false)
  }

  if (step === 'confirm' && selectedCat) {
    return (
      <div className="surface" style={{ padding: 16 }}>
        <button
          type="button"
          onClick={() => setStep('select')}
          style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: 13, cursor: 'pointer', marginBottom: 12, fontFamily: 'var(--font)' }}
        >
          ← Back
        </button>
        <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 4 }}>{selectedCat.name}</div>
        <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 12 }}>{selectedCat.description}</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--accent)', marginBottom: 12 }}>
          {formatKES(selectedCat.fee_kes)}
        </div>
        <p style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.45, marginBottom: 14 }}>
          M-Pesa checkout is deferred. Confirm to reserve a demo bib for race-day check-in.
        </p>
        <button type="button" className="btn-primary" onClick={confirmEntry} disabled={loading}>
          {loading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : null}
          {loading ? 'Reserving…' : 'Confirm entry · get bib'}
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="section-label" style={{ marginBottom: 10 }}>Choose category</div>
      {categories.map((cat: any) => {
        const count = regCounts[cat.id] || 0
        const spotsLeft = cat.max_slots - count
        const full = spotsLeft <= 0
        return (
          <button
            key={cat.id}
            type="button"
            disabled={full}
            onClick={() => {
              setSelectedCat(cat)
              setStep('confirm')
            }}
            className="surface"
            style={{
              width: '100%',
              textAlign: 'left',
              padding: 14,
              marginBottom: 10,
              cursor: full ? 'not-allowed' : 'pointer',
              opacity: full ? 0.5 : 1,
              fontFamily: 'var(--font)',
              color: 'var(--ink)',
              border: '1px solid var(--line)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800 }}>{cat.name}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{cat.description}</div>
                <div style={{ fontSize: 11, color: full ? 'var(--bad)' : 'var(--muted)', marginTop: 4 }}>
                  {full ? 'Full' : `${spotsLeft} spots left`}
                </div>
              </div>
              <div style={{ fontSize: 16, fontWeight: 800 }}>{formatKES(cat.fee_kes)}</div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
