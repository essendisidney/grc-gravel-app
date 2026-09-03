'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignupPage() {
  const router = useRouter()
  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{
          width: 56, height: 56, borderRadius: 14, background: 'var(--club)',
          color: 'var(--club-ink)', fontWeight: 800, fontSize: 18,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12,
        }}>GRC</div>
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
