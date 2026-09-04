'use client'

import { Download } from 'lucide-react'
import {
  getActivities,
  getSeasonKm,
  getStreak,
  getWeekKm,
  getWeeklyGoalKm,
  getLiveBadges,
  getSession,
  SEASON_GOAL_KM,
} from '@/lib/localStore'

export function buildSeasonExport() {
  const session = getSession()
  return {
    exportedAt: new Date().toISOString(),
    club: 'Gravel Riders Club',
    rider: session?.fullName || 'Guest',
    seasonKm: getSeasonKm(),
    seasonGoalKm: SEASON_GOAL_KM,
    weekKm: getWeekKm(),
    weeklyGoalKm: getWeeklyGoalKm(),
    saturdayStreak: getStreak(),
    badges: getLiveBadges().filter(b => b.earned).map(b => b.name),
    activities: getActivities().map(a => ({
      title: a.title,
      distanceKm: a.distanceKm,
      elevationM: a.elevationM,
      elapsedSec: a.elapsedSec,
      pace: a.paceGroupName,
      endedAt: a.endedAt,
      note: a.note || null,
    })),
  }
}

export default function ExportSeasonButton() {
  function download() {
    const payload = buildSeasonExport()
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `grc-season-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <button type="button" className="btn-secondary" onClick={download} style={{ marginBottom: 12 }}>
      <Download size={16} /> Export season stats
    </button>
  )
}
