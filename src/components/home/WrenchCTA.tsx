import Link from 'next/link'
import { Wrench, ChevronRight } from 'lucide-react'

export default function WrenchCTA() {
  return (
    <div style={{ padding: '0 16px 24px' }}>
      <Link href="/wrench" style={{ textDecoration: 'none' }}>
        <div
          style={{
            background: '#1A1E2A',
            borderRadius: 16,
            padding: 18,
            border: '1px solid #1E2436',
            display: 'flex',
            gap: 14,
            alignItems: 'center',
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: 'rgba(245,197,24,0.10)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Wrench size={24} color="#F5C518" />
          </div>

          <div style={{ flex: 1 }}>
            <div
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 18,
                fontWeight: 700,
                color: '#F0F2F5',
                marginBottom: 3,
              }}
            >
              Bike broken on Ngong?
            </div>
            <div style={{ fontSize: 12, color: '#8892A4', marginBottom: 10, lineHeight: 1.4 }}>
              GRC mechanic to your gate — Nairobi, same-day where we can.
            </div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                background: '#F5C518',
                color: '#0D0F14',
                fontSize: 11,
                fontWeight: 700,
                padding: '6px 12px',
                borderRadius: 8,
              }}
            >
              Book a Mechanic
              <ChevronRight size={12} />
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}
