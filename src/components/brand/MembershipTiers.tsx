import Link from 'next/link'

const TIERS = [
  {
    name: 'Regular',
    price: 'KES 1,200',
    period: '/ year',
    includes: ['Clubhouses at Tena & Utawala', 'Member-only rides & events', 'Café discounts at The Gravel'],
  },
  {
    name: 'Gold',
    price: 'KES 5,000',
    period: '/ year',
    includes: ['Everything in Regular', 'One free doorstep wrench service', 'Priority on limited rides'],
  },
  {
    name: 'Family',
    price: 'KES 5,000',
    period: '/ year',
    includes: ['Up to five people on one card', 'Family discounts on workshops'],
  },
]

export default function MembershipTiers({ compact = false, showCta = true }: { compact?: boolean; showCta?: boolean }) {
  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 18, fontWeight: 800 }}>Membership</div>
        <p style={{ fontSize: 13, color: 'var(--muted)', margin: '4px 0 0', lineHeight: 1.45 }}>
          Pick how you belong — paid in KES, clubhouses included.
        </p>
      </div>
      {TIERS.map(tier => (
        <div key={tier.name} className="surface" style={{ padding: 14, marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 8 }}>
            <div style={{ fontSize: 15, fontWeight: 800 }}>{tier.name}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#8A6A00' }}>{tier.price} <span style={{ fontWeight: 500, color: 'var(--muted)' }}>{tier.period}</span></div>
          </div>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: 'var(--muted)', lineHeight: 1.55 }}>
            {tier.includes.map(item => <li key={item}>{item}</li>)}
          </ul>
        </div>
      ))}
      {showCta && (
        <Link href="/passport" className="btn-primary" style={{ textDecoration: 'none' }}>
          Join from KES 1,200 / year
        </Link>
      )}
    </div>
  )
}
