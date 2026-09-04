import { Suspense } from 'react'
import LiveRideClient from './LiveRideClient'

export default function LiveRidePage() {
  return (
    <Suspense fallback={<div style={{ padding: 24, color: 'var(--muted)' }}>Loading ride…</div>}>
      <LiveRideClient />
    </Suspense>
  )
}
