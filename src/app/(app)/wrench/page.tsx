import TopBar from '@/components/layout/TopBar'
import WrenchClient from './WrenchClient'

const SERVICES = [
  { id: 'basic_service', label: 'Basic Service', desc: 'Clean, lube chain, inflate tyres, safety check', price: 800, duration: 1 },
  { id: 'full_service', label: 'Full Service', desc: 'Complete bike overhaul', price: 2500, duration: 3 },
  { id: 'tubeless_setup', label: 'Tubeless Setup', desc: 'Sealant & tape included', price: 1800, duration: 2 },
  { id: 'brake_bleed', label: 'Brake Bleed', desc: 'Hydraulic flush & bleed', price: 1200, duration: 1.5 },
  { id: 'repair', label: 'Repair / Diagnosis', desc: 'Quote on inspection', price: 500, duration: 1 },
]

export default function WrenchPage() {
  return (
    <div>
      <TopBar title="Wrench" showNotifications />
      <p style={{ padding: '0 16px 8px', fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>
        Doorstep bike repair — GRC mechanics, priced in KES.
      </p>
      <WrenchClient services={SERVICES} activeBookings={[]} pastBookings={[]} />
    </div>
  )
}
