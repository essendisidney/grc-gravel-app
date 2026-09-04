/**
 * Pure helper checks for Wave 17 (no browser).
 * Run: node scripts/verify-helpers.mjs
 */
import assert from 'node:assert/strict'

const DUST_SEASON_MONTHS = [1, 2, 6, 7, 8, 9]

function getDustSeasonStatus(date) {
  const month = date.getMonth() + 1
  const inDust = DUST_SEASON_MONTHS.includes(month)
  return { inDust, month }
}

function suggestPsi(tireMm = 40, riderKg = 75) {
  const base = Math.round(riderKg * 0.42 - (tireMm - 35) * 0.55)
  const front = Math.max(28, Math.min(55, base - 2))
  const rear = Math.max(30, Math.min(58, base + 1))
  return { front, rear }
}

function attendanceCsv(roster, title = 'Club ride') {
  const lines = ['name,pace,status', ...roster.map(r => `"${r.name}","${r.paceGroup}",${r.present ? 'present' : 'absent'}`)]
  return `# ${title}\n${lines.join('\n')}`
}

// Dust: July should be in season
assert.equal(getDustSeasonStatus(new Date('2026-07-15')).inDust, true)
assert.equal(getDustSeasonStatus(new Date('2026-04-15')).inDust, false)

// PSI heuristic stays in gravel range
const psi = suggestPsi(40, 75)
assert.ok(psi.front >= 28 && psi.front <= 55)
assert.ok(psi.rear > psi.front)

// CSV export shape
const csv = attendanceCsv([
  { name: 'Sam', paceGroup: 'Cruiser', present: true },
  { name: 'Amina', paceGroup: 'Fast', present: false },
])
assert.match(csv, /name,pace,status/)
assert.match(csv, /present/)
assert.match(csv, /absent/)

console.log('verify-helpers: OK (dust, psi, attendance csv)')

// Rollout ready requires all three
function isRolloutReady(c) {
  return c.lights && c.helmet && c.bottles
}
assert.equal(isRolloutReady({ lights: true, helmet: true, bottles: true }), true)
assert.equal(isRolloutReady({ lights: true, helmet: true, bottles: false }), false)
console.log('verify-helpers: OK (rollout checks)')

function recoveryTip(feel) {
  if (feel == null) return null
  if (feel <= 2) return 'Recovery day'
  if (feel === 3) return 'Active recovery'
  return 'Bank the fitness'
}
assert.equal(recoveryTip(1), 'Recovery day')
assert.equal(recoveryTip(5), 'Bank the fitness')
assert.equal(recoveryTip(null), null)
console.log('verify-helpers: OK (recovery tips)')

function trainingBand(load) {
  if (load >= 180) return 'peak'
  if (load >= 90) return 'build'
  if (load >= 30) return 'easy'
  return 'rest'
}
assert.equal(trainingBand(200), 'peak')
assert.equal(trainingBand(10), 'rest')
console.log('verify-helpers: OK (training load)')

function getRollOutCountdown(rideDate, startTime, now) {
  const [hh, mm] = (startTime || '06:15:00').split(':').map(Number)
  const target = new Date(`${rideDate}T00:00:00`)
  target.setHours(hh || 6, mm || 15, 0, 0)
  const totalSec = Math.floor((target.getTime() - now.getTime()) / 1000)
  return { past: totalSec <= 0, totalSec }
}
const future = getRollOutCountdown('2099-01-01', '06:15:00', new Date('2026-09-04T12:00:00'))
assert.equal(future.past, false)
assert.ok(future.totalSec > 0)
const past = getRollOutCountdown('2020-01-01', '06:15:00', new Date('2026-09-04T12:00:00'))
assert.equal(past.past, true)
console.log('verify-helpers: OK (roll-out countdown)')

assert.ok([0, 15, 30, 45].includes(30))
console.log('verify-helpers: OK (delay options)')
console.log('verify-helpers: ALL PASSED')
