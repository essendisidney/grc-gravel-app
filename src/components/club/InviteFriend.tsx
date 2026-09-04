'use client'

import { useState } from 'react'
import { Check, Share2 } from 'lucide-react'
import { getSession } from '@/lib/localStore'

export default function InviteFriend() {
  const [copied, setCopied] = useState(false)

  async function invite() {
    const name = getSession()?.fullName || 'A GRC rider'
    const text = [
      `${name} wants you on Gravel Riders Club.`,
      'Saturday Magadi, Full Gas, wrench at the gate.',
      'https://grc-gravel-app.vercel.app',
      'Ride beyond the tarmac.',
    ].join('\n')

    try {
      if (navigator.share) {
        await navigator.share({ title: 'Join GRC', text, url: 'https://grc-gravel-app.vercel.app' })
        return
      }
    } catch {
      /* fall through to clipboard */
    }

    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      /* ignore */
    }
  }

  return (
    <button type="button" className="btn-secondary" onClick={invite} style={{ marginBottom: 12 }}>
      {copied ? <Check size={16} /> : <Share2 size={16} />}
      {copied ? 'Invite copied' : 'Invite a friend'}
    </button>
  )
}
