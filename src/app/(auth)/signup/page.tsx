'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import GrcLogo from '@/components/brand/GrcLogo'

export default function SignupPage() {
  const router = useRouter()
  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ display: 'inline-block', marginBottom: 12 }}>
          <GrcLogo size={56} rounded={14} />
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 8px' }}>Join the club</h1>
        <p style={{ margin: 0, fontSize: 14, color: 'var(--muted)', lineHeight: 1.5 }}>
          Regular from KES 1,200 / year. Phone + M-Pesa next.
        </p>
      </div>
      <div className="surface" style={{ padding: 20 }}>
        <button className="btn-primary" onClick={() => router.push('/')}>Enter as a rider</button>
      </div>
      <p style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: 'var(--muted)' }}>
        Already a member? <Link href="/login" style={{ color: 'var(--navy)', fontWeight: 700, textDecoration: 'none' }}>Sign in</Link>
      </p>
    </div>
  )
}
