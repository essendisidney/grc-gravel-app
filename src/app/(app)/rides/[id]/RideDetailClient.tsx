'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, CheckCircle2, Clock } from 'lucide-react'
import { registerForRide, cancelRideRegistration } from '../actions'
import type { RideRegistration } from '@/lib/types/database'

interface RideDetailClientProps {
  rideId: string
  userRegistration: RideRegistration | null
  spotsLeft: number | null
}

export default function RideDetailClient({
  rideId,
  userRegistration,
  spotsLeft,
}: RideDetailClientProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [registration, setRegistration] = useState(userRegistration)

  async function handleRegister() {
    setLoading(true)
    setMessage('')
    const result = await registerForRide(rideId)
    if (result.success) {
      setRegistration({ status: result.status } as any)
      setMessage(
        result.status === 'registered'
          ? "Niko in. See you at the gate — don't be late."
          : "You're on the waitlist. We'll ping you if a spot opens."
      )
    } else {
      setMessage(result.error || 'Something went wrong')
    }
    setLoading(false)
    router.refresh()
  }

  async function handleCancel() {
    if (!confirm('Cancel your registration for this ride?')) return
    setLoading(true)
    const result = await cancelRideRegistration(rideId)
    if (result.success) {
      setRegistration(null)
      setMessage('Registration cancelled')
    } else {
      setMessage(result.error || 'Something went wrong')
    }
    setLoading(false)
    router.refresh()
  }

  const isRegistered = registration?.status === 'registered'
  const isWaitlisted = registration?.status === 'waitlisted'
  const isFull = spotsLeft !== null && spotsLeft <= 0 && !isRegistered && !isWaitlisted

  return (
    <div>
      {/* Status message */}
      {message && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: 12,
            marginBottom: 14,
            background: message.includes('wrong') || message.includes('error')
              ? 'rgba(239,68,68,0.1)'
              : 'rgba(34,197,94,0.1)',
            border: `1px solid ${message.includes('wrong') || message.includes('error')
              ? 'rgba(239,68,68,0.3)'
              : 'rgba(34,197,94,0.3)'}`,
            fontSize: 13,
            color: message.includes('wrong') || message.includes('error') ? '#EF4444' : '#22C55E',
          }}
        >
          {message}
        </div>
      )}

      {/* Currently registered */}
      {isRegistered && (
        <div style={{ marginBottom: 12 }}>
          <div
            style={{
              background: 'rgba(245,197,24,0.1)',
              border: '1px solid rgba(245,197,24,0.3)',
              borderRadius: 14,
              padding: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 10,
            }}
          >
            <CheckCircle2 size={20} color="#F5C518" />
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#F5C518' }}>
                Niko in
              </div>
              <div style={{ fontSize: 12, color: '#8892A4' }}>
                Lights on. We don't wait past roll-out.
              </div>
            </div>
          </div>
          <button
            onClick={handleCancel}
            disabled={loading}
            className="btn-danger"
          >
            {loading ? <Loader2 size={14} /> : 'Cancel Registration'}
          </button>
        </div>
      )}

      {/* Waitlisted */}
      {isWaitlisted && (
        <div style={{ marginBottom: 12 }}>
          <div
            style={{
              background: 'rgba(249,115,22,0.1)',
              border: '1px solid rgba(249,115,22,0.3)',
              borderRadius: 14,
              padding: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 10,
            }}
          >
            <Clock size={20} color="#FB923C" />
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#FB923C' }}>
                You're on the waitlist
              </div>
              <div style={{ fontSize: 12, color: '#8892A4' }}>
                We'll notify you if a spot opens up
              </div>
            </div>
          </div>
          <button onClick={handleCancel} disabled={loading} className="btn-danger">
            Leave Waitlist
          </button>
        </div>
      )}

      {/* Register button */}
      {!isRegistered && !isWaitlisted && (
        <button onClick={handleRegister} disabled={loading} className="btn-primary">
          {loading && <Loader2 size={16} className="animate-spin" />}
          {isFull
            ? 'Join Waitlist'
            : loading
            ? 'Registering...'
            : "I'm in"}
        </button>
      )}

      {/* Capacity note */}
      {spotsLeft !== null && !isRegistered && !isWaitlisted && (
        <div
          style={{
            textAlign: 'center',
            marginTop: 10,
            fontSize: 12,
            color: spotsLeft <= 5 ? '#EF4444' : '#8892A4',
          }}
        >
          {spotsLeft <= 0 ? 'Ride is full — join the waitlist' : `${spotsLeft} spots remaining`}
        </div>
      )}
    </div>
  )
}
