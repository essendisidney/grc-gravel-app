'use client'

import Link from 'next/link'
import { Search } from 'lucide-react'

export default function SearchChip({ href = '/search' }: { href?: string }) {
  return (
    <Link
      href={href}
      className="pressable"
      style={{
        width: 36,
        height: 36,
        borderRadius: 10,
        background: 'var(--surface)',
        border: '1px solid var(--line)',
        display: 'grid',
        placeItems: 'center',
        color: 'var(--ink)',
        textDecoration: 'none',
      }}
      aria-label="Search"
    >
      <Search size={16} />
    </Link>
  )
}
