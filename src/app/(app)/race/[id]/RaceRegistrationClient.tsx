'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, CheckCircle2, CreditCard, Phone } from 'lucide-react'
import { formatKES, normalizePhone } from '@/lib/utils'

interface RaceRegistrationClientProps {
  raceId: string
  categories: any[]
  userRegistration: any
  regCounts: Record<string, number>
}

export default function RaceRegistrationClient({
  raceId,
  categories,
  userRegistration,
  regCounts,
}: RaceRegistrationClientProps) {
  const router = useRouter()
  const [selectedCat, setSelectedCat] = useState<any>(null)
  const [step, setStep] = useState<'select' | 'pay' | 'waiting' | 'done'>('select')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [checkoutId, setCheckoutId] = useState('')

  if (userRegistration && !['cancelled'].includes(userRegistration.status)) {
    const cat = categories.find(c => c.id === userRegistration.category_id)
    return (
      <div style={{ background: 'rgba(245,197,24,0.08)', border: '1px solid rgba(245,197,24,0.25)', borderRadius: 16, padding: 18, display: 'flex', gap: 12, alignItems: 'center' }}>
        <CheckCircle2 size={24} color="#F5C518" />
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#F5C518', marginBottom: 2 }}>You're registered!</div>
          <div style={{ fontSize: 13, color: '#8892A4' }}>
            {cat?.name} · Race #{userRegistration.race_number || 'TBD'}
          </div>
          {userRegistration.payment_status === 'pending' && (
            <div style={{ fontSize: 12, color: '#FB923C', marginTop: 4 }}>⏳ Payment pending</div>
          )}
        </div>
      </div>
    )
  }

  async function handlePay() {
    if (!selectedCat || !phone) return
    setLoading(true)
    setError('')

    try {
      // No M-Pesa backend yet — confirm locally so the flow is visible
      await new Promise(r => setTimeout(r, 700))
      setStep('done')
    } catch (e: any) {
      setError(e.message)
    }
    setLoading(false)
  }

  function pollPaymentStatus(cid: string) {
    let attempts = 0
    const interval = setInterval(async () => {
      attempts++
      const res = await fetch(`/api/mpesa/status?checkoutRequestId=${cid}`)
      const data = await res.json()

      if (data.status === 'success') {
        clearInterval(interval)
        setStep('done')
        router.refresh()
      } else if (data.status === 'failed' || attempts > 20) {
        clearInterval(interval)
        setError(data.status === 'failed' ? 'Payment failed. Please try again.' : 'Payment timed out. If amount was deducted, contact us.')
        setStep('pay')
      }
    }, 3000)
  }

  const catColors: Record<string, string> = { cat_a: '#EF4444', cat_b: '#60A5FA', cat_c: '#22C55E' }

  if (step === 'done') {
    return (
      <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 16, padding: 24, textAlign: 'center' }}>
        <CheckCircle2 size={40} color="#22C55E" style={{ margin: '0 auto 10px' }} />
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 22, fontWeight: 700, color: '#22C55E', marginBottom: 6 }}>
          Registration Confirmed!
        </div>
        <div style={{ fontSize: 13, color: '#8892A4' }}>
          You're in for {selectedCat?.name}. See you on race day! 🏁
        </div>
      </div>
    )
  }

  if (step === 'waiting') {
    return (
      <div style={{ background: '#1A1E2A', border: '1px solid #1E2436', borderRadius: 16, padding: 24, textAlign: 'center' }}>
        <Loader2 size={32} color="#F5C518" style={{ margin: '0 auto 12px', animation: 'spin 1s linear infinite' }} />
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 20, fontWeight: 700, marginBottom: 6 }}>
          Check your phone
        </div>
        <div style={{ fontSize: 13, color: '#8892A4', lineHeight: 1.6 }}>
          An M-Pesa prompt has been sent to <strong style={{ color: '#F0F2F5' }}>{phone}</strong>.
          Enter your PIN to complete payment.
        </div>
        <div style={{ marginTop: 16, fontSize: 12, color: '#8892A4' }}>Waiting for confirmation...</div>
        <button onClick={() => setStep('pay')} style={{ marginTop: 14, background: 'none', border: 'none', color: '#8892A4', fontSize: 13, cursor: 'pointer', textDecoration: 'underline' }}>
          Cancel
        </button>
      </div>
    )
  }

  if (step === 'pay') {
    return (
      <div>
        {/* Back to selection */}
        <button onClick={() => setStep('select')} style={{ background: 'none', border: 'none', color: '#8892A4', fontSize: 13, cursor: 'pointer', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 4 }}>
          ← Back to categories
        </button>

        <div style={{ background: '#1A1E2A', borderRadius: 16, border: '1px solid #1E2436', padding: 20, marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 12, color: '#8892A4', marginBottom: 2 }}>Registering for</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#F0F2F5' }}>{selectedCat?.name}</div>
            </div>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 26, fontWeight: 700, color: '#F5C518' }}>
              {formatKES(selectedCat?.fee_kes || 0)}
            </div>
          </div>

          <div style={{ marginBottom: 8 }}>
            <label style={{ fontSize: 12, color: '#8892A4', display: 'block', marginBottom: 6, fontWeight: 500 }}>
              M-Pesa phone number
            </label>
            <div style={{ position: 'relative' }}>
              <Phone size={15} color="#8892A4" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
              <input
                className="grc-input"
                type="tel"
                placeholder="0712 345 678"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                style={{ paddingLeft: 38 }}
              />
            </div>
          </div>

          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#EF4444', marginBottom: 14 }}>
              {error}
            </div>
          )}

          <button
            className="btn-primary"
            onClick={handlePay}
            disabled={loading || !phone}
            style={{ marginTop: 8 }}
          >
            {loading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <CreditCard size={16} />}
            {loading ? 'Initiating...' : `Pay ${formatKES(selectedCat?.fee_kes || 0)} via M-Pesa`}
          </button>
        </div>
      </div>
    )
  }

  // Step: select category
  return (
    <div>
      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 18, fontWeight: 700, marginBottom: 12 }}>
        Choose your category
      </div>
      {categories.map((cat: any) => {
        const count = regCounts[cat.id] || 0
        const spotsLeft = cat.max_slots - count
        const full = spotsLeft <= 0
        const color = catColors[cat.id] || '#8892A4'

        return (
          <button
            key={cat.id}
            disabled={full}
            onClick={() => { setSelectedCat(cat); setStep('pay') }}
            style={{
              width: '100%', textAlign: 'left',
              background: '#1A1E2A', borderRadius: 14,
              border: `1px solid ${selectedCat?.id === cat.id ? color : '#1E2436'}`,
              padding: 16, marginBottom: 10, cursor: full ? 'not-allowed' : 'pointer',
              opacity: full ? 0.5 : 1, fontFamily: "'Space Grotesk', sans-serif",
              transition: 'border-color 0.15s',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#F0F2F5', marginBottom: 2 }}>{cat.name}</div>
                <div style={{ fontSize: 12, color: '#8892A4' }}>{cat.description}</div>
                <div style={{ fontSize: 11, color: full ? '#EF4444' : '#8892A4', marginTop: 4 }}>
                  {full ? 'Full' : `${spotsLeft} spots left`}
                </div>
              </div>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 22, fontWeight: 700, color }}>
                {formatKES(cat.fee_kes)}
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
