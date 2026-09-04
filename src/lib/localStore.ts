'use client'

export type LocalRsvp = {
  rideId: string
  paceGroupId: string
  paceGroupName: string
  status: 'registered' | 'waitlisted'
  joinedAt: string
}

export type LocalMembership = {
  tier: string
  priceKes: number
  phone: string
  paidAt: string
  receipt: string
}

export type LocalSession = {
  id: string
  fullName: string
  phone: string
  title: string
  isCaptain: boolean
  signedInAt: string
}

export type WaitlistRider = {
  id: string
  name: string
  paceGroup: string
  phone: string
  joinedAt: string
}

export type CaptainPing = {
  id: string
  rideId: string
  message: string
  createdAt: string
}

const RSVP_KEY = 'grc-rsvps'
const NOTIF_READ_KEY = 'grc-notif-read'
const MEMBER_KEY = 'grc-membership'
const SESSION_KEY = 'grc-session'
const WAITLIST_KEY = 'grc-waitlist'
const PINGS_KEY = 'grc-captain-pings'
const COOKIE = 'grc_session'

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function writeJson(key: string, value: unknown) {
  if (typeof window === 'undefined') return
  localStorage.setItem(key, JSON.stringify(value))
}

function setAuthCookie(on: boolean) {
  if (typeof document === 'undefined') return
  if (on) {
    document.cookie = `${COOKIE}=1; path=/; max-age=${60 * 60 * 24 * 180}; SameSite=Lax`
  } else {
    document.cookie = `${COOKIE}=; path=/; max-age=0; SameSite=Lax`
  }
}

export function getRsvps(): LocalRsvp[] {
  return readJson<LocalRsvp[]>(RSVP_KEY, [])
}

export function getRsvp(rideId: string): LocalRsvp | null {
  return getRsvps().find(r => r.rideId === rideId) || null
}

export function setRsvp(rsvp: LocalRsvp) {
  const next = getRsvps().filter(r => r.rideId !== rsvp.rideId)
  next.unshift(rsvp)
  writeJson(RSVP_KEY, next)
}

export function clearRsvp(rideId: string) {
  writeJson(RSVP_KEY, getRsvps().filter(r => r.rideId !== rideId))
}

export function getReadNotifIds(): string[] {
  return readJson<string[]>(NOTIF_READ_KEY, [])
}

export function markNotifsRead(ids: string[]) {
  const set = new Set([...getReadNotifIds(), ...ids])
  writeJson(NOTIF_READ_KEY, [...set])
}

export function getMembership(): LocalMembership | null {
  return readJson<LocalMembership | null>(MEMBER_KEY, null)
}

export function setMembership(m: LocalMembership) {
  writeJson(MEMBER_KEY, m)
}

export function getSession(): LocalSession | null {
  return readJson<LocalSession | null>(SESSION_KEY, null)
}

export function setSession(session: LocalSession) {
  writeJson(SESSION_KEY, session)
  setAuthCookie(true)
}

export function clearSession() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(SESSION_KEY)
  setAuthCookie(false)
}

export function getWaitlist(rideId = 'ngong-magadi'): WaitlistRider[] {
  const all = readJson<Record<string, WaitlistRider[]>>(WAITLIST_KEY, {})
  if (all[rideId]?.length) return all[rideId]
  const seed: WaitlistRider[] = [
    { id: 'w1', name: 'Brian Kamau', paceGroup: 'Cruiser', phone: '0712 441 002', joinedAt: new Date(Date.now() - 3600000).toISOString() },
    { id: 'w2', name: 'Faith Wanjiku', paceGroup: 'Social', phone: '0722 118 440', joinedAt: new Date(Date.now() - 7200000).toISOString() },
    { id: 'w3', name: 'Leo Otieno', paceGroup: 'Fast', phone: '0701 993 221', joinedAt: new Date(Date.now() - 10800000).toISOString() },
  ]
  all[rideId] = seed
  writeJson(WAITLIST_KEY, all)
  return seed
}

export function promoteWaitlist(rideId: string, riderId: string) {
  const all = readJson<Record<string, WaitlistRider[]>>(WAITLIST_KEY, {})
  all[rideId] = (all[rideId] || getWaitlist(rideId)).filter(r => r.id !== riderId)
  writeJson(WAITLIST_KEY, all)
  return all[rideId]
}

export function getCaptainPings(): CaptainPing[] {
  return readJson<CaptainPing[]>(PINGS_KEY, [])
}

export function addCaptainPing(ping: CaptainPing) {
  const next = [ping, ...getCaptainPings()].slice(0, 20)
  writeJson(PINGS_KEY, next)
  return next
}

export type OfflinePack = {
  routeId: string
  name: string
  regionId: string
  distanceKm: number
  elevationM: number
  gravelPct: number
  signal: string
  waterPoints: number
  savedAt: string
  gpx: string
}

export type RollCallRider = {
  id: string
  name: string
  paceGroup: string
  present: boolean
}

export type LiveRide = {
  rideId: string
  paceGroupName: string
  startedAt: string
}

const OFFLINE_KEY = 'grc-offline-packs'
const WAIVER_KEY = 'grc-waivers'
const ROLLCALL_KEY = 'grc-rollcall'
const LIVE_KEY = 'grc-live-ride'

export function getOfflinePacks(): OfflinePack[] {
  return readJson<OfflinePack[]>(OFFLINE_KEY, [])
}

export function isRouteSaved(routeId: string) {
  return getOfflinePacks().some(p => p.routeId === routeId)
}

export function saveOfflinePack(pack: OfflinePack) {
  const next = [pack, ...getOfflinePacks().filter(p => p.routeId !== pack.routeId)].slice(0, 12)
  writeJson(OFFLINE_KEY, next)
  return next
}

export function removeOfflinePack(routeId: string) {
  const next = getOfflinePacks().filter(p => p.routeId !== routeId)
  writeJson(OFFLINE_KEY, next)
  return next
}

export function hasWaiver(rideId: string) {
  return readJson<string[]>(WAIVER_KEY, []).includes(rideId)
}

export function setWaiver(rideId: string) {
  const set = new Set([...readJson<string[]>(WAIVER_KEY, []), rideId])
  writeJson(WAIVER_KEY, [...set])
}

export function getRollCall(rideId = 'ngong-magadi'): RollCallRider[] {
  const all = readJson<Record<string, RollCallRider[]>>(ROLLCALL_KEY, {})
  if (all[rideId]?.length) return all[rideId]
  const seed: RollCallRider[] = [
    { id: 'rc1', name: 'Amina Otieno', paceGroup: 'Cruiser', present: false },
    { id: 'rc2', name: 'Victor Dawa', paceGroup: 'Fast', present: true },
    { id: 'rc3', name: 'James Njoroge', paceGroup: 'Social', present: false },
    { id: 'rc4', name: 'Mercy Njeri', paceGroup: 'Cruiser', present: false },
    { id: 'rc5', name: 'Sam Kariuki', paceGroup: 'Fast', present: false },
    { id: 'rc6', name: 'Brian Kamau', paceGroup: 'Cruiser', present: false },
  ]
  all[rideId] = seed
  writeJson(ROLLCALL_KEY, all)
  return seed
}

export function toggleRollCall(rideId: string, riderId: string) {
  const all = readJson<Record<string, RollCallRider[]>>(ROLLCALL_KEY, {})
  const list = (all[rideId] || getRollCall(rideId)).map(r =>
    r.id === riderId ? { ...r, present: !r.present } : r,
  )
  all[rideId] = list
  writeJson(ROLLCALL_KEY, all)
  return list
}

export function getLiveRide(): LiveRide | null {
  return readJson<LiveRide | null>(LIVE_KEY, null)
}

export function startLiveRide(ride: LiveRide) {
  writeJson(LIVE_KEY, ride)
}

export function endLiveRide() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(LIVE_KEY)
}

export type RideActivity = {
  id: string
  rideId: string
  title: string
  paceGroupName: string
  elapsedSec: number
  distanceKm: number
  elevationM: number
  endedAt: string
  note?: string
}

const ACTIVITY_KEY = 'grc-activities'

export function getActivities(): RideActivity[] {
  return readJson<RideActivity[]>(ACTIVITY_KEY, [])
}

export function addActivity(activity: RideActivity) {
  const next = [activity, ...getActivities()].slice(0, 30)
  writeJson(ACTIVITY_KEY, next)
  return next
}

export function updateActivityNote(id: string, note: string) {
  const next = getActivities().map(a => (a.id === id ? { ...a, note: note.trim() } : a))
  writeJson(ACTIVITY_KEY, next)
  return next
}

export type EmergencyContact = {
  name: string
  phone: string
}

export type ClubStory = {
  id: string
  content: string
  rideTitle?: string
  distanceKm?: number
  createdAt: string
  authorName: string
}

export type LocalWrenchBooking = {
  id: string
  serviceName: string
  serviceId: string
  date: string
  timeSlot: string
  location: string
  bikeInfo?: string
  notes?: string
  priceKes: number
  status: 'pending' | 'accepted' | 'mechanic_en_route' | 'in_progress' | 'completed'
  createdAt: string
}

const EMERGENCY_KEY = 'grc-emergency'
const STORIES_KEY = 'grc-club-stories'
const WRENCH_KEY = 'grc-wrench-bookings'

export function getEmergencyContact(): EmergencyContact | null {
  return readJson<EmergencyContact | null>(EMERGENCY_KEY, null)
}

export function setEmergencyContact(contact: EmergencyContact) {
  writeJson(EMERGENCY_KEY, contact)
}

export function getClubStories(): ClubStory[] {
  return readJson<ClubStory[]>(STORIES_KEY, [])
}

export function addClubStory(story: ClubStory) {
  const next = [story, ...getClubStories()].slice(0, 40)
  writeJson(STORIES_KEY, next)
  return next
}

export function getWrenchBookings(): LocalWrenchBooking[] {
  return readJson<LocalWrenchBooking[]>(WRENCH_KEY, [])
}

export function addWrenchBooking(booking: LocalWrenchBooking) {
  const next = [booking, ...getWrenchBookings()].slice(0, 20)
  writeJson(WRENCH_KEY, next)
  return next
}

export type RaceEntry = {
  raceId: string
  categoryId: string
  categoryName: string
  bib: number
  phone: string
  registeredAt: string
}

export type RaceCheckIn = {
  raceId: string
  bib: number
  name: string
  checkedInAt: string
}

const RACE_ENTRY_KEY = 'grc-race-entry'
const RACE_CHECKIN_KEY = 'grc-race-checkin'

export function getRaceEntry(raceId: string): RaceEntry | null {
  const all = readJson<Record<string, RaceEntry>>(RACE_ENTRY_KEY, {})
  return all[raceId] || null
}

export function setRaceEntry(entry: RaceEntry) {
  const all = readJson<Record<string, RaceEntry>>(RACE_ENTRY_KEY, {})
  all[entry.raceId] = entry
  writeJson(RACE_ENTRY_KEY, all)
}

export function getRaceCheckIns(raceId: string): RaceCheckIn[] {
  const all = readJson<Record<string, RaceCheckIn[]>>(RACE_CHECKIN_KEY, {})
  return all[raceId] || []
}

export function toggleRaceCheckIn(raceId: string, bib: number, name: string) {
  const all = readJson<Record<string, RaceCheckIn[]>>(RACE_CHECKIN_KEY, {})
  const list = all[raceId] || []
  const exists = list.find(c => c.bib === bib)
  all[raceId] = exists
    ? list.filter(c => c.bib !== bib)
    : [{ raceId, bib, name, checkedInAt: new Date().toISOString() }, ...list]
  writeJson(RACE_CHECKIN_KEY, all)
  return all[raceId]
}

export type ClubAnnouncement = {
  id: string
  title: string
  body: string
  createdAt: string
  authorName: string
}

const FAV_KEY = 'grc-favorites'
const ANNOUNCE_KEY = 'grc-announcements'

export function getFavorites(): string[] {
  return readJson<string[]>(FAV_KEY, [])
}

export function isFavorite(routeId: string) {
  return getFavorites().includes(routeId)
}

export function toggleFavorite(routeId: string) {
  const set = new Set(getFavorites())
  if (set.has(routeId)) set.delete(routeId)
  else set.add(routeId)
  const next = [...set]
  writeJson(FAV_KEY, next)
  return next
}

export function getAnnouncements(): ClubAnnouncement[] {
  return readJson<ClubAnnouncement[]>(ANNOUNCE_KEY, [])
}

export function addAnnouncement(a: ClubAnnouncement) {
  const next = [a, ...getAnnouncements()].slice(0, 10)
  writeJson(ANNOUNCE_KEY, next)
  return next
}

export type GarageBike = {
  id: string
  name: string
  brand: string
  type: 'gravel' | 'road' | 'mtb' | 'hybrid'
  tireMm?: number
  notes?: string
  isPrimary?: boolean
}

const BIKES_KEY = 'grc-bikes'
const KIT_KEY = 'grc-kit-checks'
const CARPOOL_KEY = 'grc-carpool'

export const DEFAULT_KIT = [
  { id: 'lights', label: 'Front + rear lights' },
  { id: 'bottles', label: '2 bottles filled' },
  { id: 'tubes', label: 'Spare tube / plugs' },
  { id: 'pump', label: 'Pump or CO₂' },
  { id: 'cash', label: 'Cash / M-Pesa float' },
  { id: 'helmet', label: 'Helmet + gloves' },
  { id: 'snack', label: 'Bars / bananas' },
  { id: 'phone', label: 'Phone charged + offline pack' },
] as const

export function getBikes(): GarageBike[] {
  return readJson<GarageBike[]>(BIKES_KEY, [
    {
      id: 'b_default',
      name: 'Daily gravel',
      brand: 'Trek Checkpoint',
      type: 'gravel',
      tireMm: 40,
      isPrimary: true,
    },
  ])
}

export function saveBikes(bikes: GarageBike[]) {
  writeJson(BIKES_KEY, bikes)
  return bikes
}

export function addBike(bike: GarageBike) {
  const list = getBikes()
  const next = bike.isPrimary
    ? [bike, ...list.map(b => ({ ...b, isPrimary: false }))]
    : [...list, bike]
  return saveBikes(next)
}

export function setPrimaryBike(id: string) {
  return saveBikes(getBikes().map(b => ({ ...b, isPrimary: b.id === id })))
}

export function removeBike(id: string) {
  const next = getBikes().filter(b => b.id !== id)
  if (next.length && !next.some(b => b.isPrimary)) next[0].isPrimary = true
  return saveBikes(next)
}

export function getKitChecked(rideId: string): string[] {
  const all = readJson<Record<string, string[]>>(KIT_KEY, {})
  return all[rideId] || []
}

export function toggleKitItem(rideId: string, itemId: string) {
  const all = readJson<Record<string, string[]>>(KIT_KEY, {})
  const set = new Set(all[rideId] || [])
  if (set.has(itemId)) set.delete(itemId)
  else set.add(itemId)
  all[rideId] = [...set]
  writeJson(KIT_KEY, all)
  return all[rideId]
}

export type CarpoolOffer = {
  id: string
  rideId: string
  name: string
  role: 'offer' | 'need'
  seats: number
  fromArea: string
  note: string
  phone?: string
  createdAt: string
}

export function getCarpool(rideId: string): CarpoolOffer[] {
  const all = readJson<Record<string, CarpoolOffer[]>>(CARPOOL_KEY, {})
  if (all[rideId]) return all[rideId]
  // seed demo offers for Magadi
  if (rideId === 'ngong-magadi') {
    return [
      {
        id: 'c1',
        rideId,
        name: 'James Njoroge',
        role: 'offer',
        seats: 2,
        fromArea: 'Utawala',
        note: 'Leaving 05:20. Bike rack for 2.',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'c2',
        rideId,
        name: 'Faith Wanjiku',
        role: 'need',
        seats: 1,
        fromArea: 'South B',
        note: 'Need lift to Tena gate.',
        createdAt: new Date().toISOString(),
      },
    ]
  }
  return []
}

export function addCarpool(offer: CarpoolOffer) {
  const all = readJson<Record<string, CarpoolOffer[]>>(CARPOOL_KEY, {})
  const base = all[offer.rideId] || getCarpool(offer.rideId)
  const next = [offer, ...base].slice(0, 20)
  all[offer.rideId] = next
  writeJson(CARPOOL_KEY, all)
  return next
}

/** Season goal — Rift 500 km from logged activities */
export const SEASON_GOAL_KM = 500

export function getSeasonKm(): number {
  const fromActivities = getActivities().reduce((sum, a) => sum + (a.distanceKm || 0), 0)
  // demo floor so new users still see progress
  return Math.max(fromActivities, 186)
}

export type ConditionTag = 'dust' | 'mud' | 'wind' | 'signal' | 'heat' | 'clear'

export type TrailCondition = {
  id: string
  routeId: string
  tags: ConditionTag[]
  note: string
  authorName: string
  createdAt: string
}

const CONDITIONS_KEY = 'grc-conditions'
const STREAK_KEY = 'grc-saturday-streak'

export function getConditions(routeId: string): TrailCondition[] {
  const all = readJson<Record<string, TrailCondition[]>>(CONDITIONS_KEY, {})
  if (all[routeId]?.length) return all[routeId]
  if (routeId === 'magadi-loop' || routeId === 'ngong-magadi') {
    return [
      {
        id: 'cond_seed_1',
        routeId,
        tags: ['dust', 'heat'],
        note: 'Magadi flats blowing hard after 09:00. Lights help in the haze.',
        authorName: 'Amina Otieno',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
      },
      {
        id: 'cond_seed_2',
        routeId,
        tags: ['signal'],
        note: 'Patchy Safaricom past Kona Baridi — download the offline pack.',
        authorName: 'Sam Kariuki',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 40).toISOString(),
      },
    ]
  }
  return []
}

export function addCondition(c: TrailCondition) {
  const all = readJson<Record<string, TrailCondition[]>>(CONDITIONS_KEY, {})
  const base = all[c.routeId] || getConditions(c.routeId)
  const next = [c, ...base].slice(0, 25)
  all[c.routeId] = next
  writeJson(CONDITIONS_KEY, all)
  return next
}

/** Mark this Saturday as ridden (RSVP or finished activity). */
export function markSaturdayRidden(isoDate = new Date().toISOString()) {
  const d = new Date(isoDate)
  // Count any ride day toward streak demo; prefer Saturdays when available
  const key = d.toISOString().slice(0, 10)
  const dates = new Set(readJson<string[]>(STREAK_KEY, []))
  dates.add(key)
  const list = [...dates].sort().reverse().slice(0, 52)
  writeJson(STREAK_KEY, list)
  return getStreak()
}

export function getStreak(): { count: number; lastDate: string | null } {
  let dates = readJson<string[]>(STREAK_KEY, [])
  if (!dates.length) {
    // demo seed: last 3 Saturdays so streak reads live
    const simple: string[] = []
    const cur = new Date()
    const day = cur.getDay()
    const backToSat = day === 6 ? 7 : (day + 1) % 7
    cur.setDate(cur.getDate() - backToSat)
    for (let i = 0; i < 3; i++) {
      simple.push(new Date(cur).toISOString().slice(0, 10))
      cur.setDate(cur.getDate() - 7)
    }
    return { count: 3, lastDate: simple[0] }
  }
  const sorted = [...dates].sort().reverse()
  let count = 1
  for (let i = 0; i < sorted.length - 1; i++) {
    const a = new Date(sorted[i] + 'T12:00:00')
    const b = new Date(sorted[i + 1] + 'T12:00:00')
    const diffDays = Math.round((a.getTime() - b.getTime()) / 86400000)
    if (diffDays >= 6 && diffDays <= 8) count++
    else break
  }
  return { count, lastDate: sorted[0] }
}

const WEEKLY_GOAL_KEY = 'grc-weekly-goal'
const CHECKIN_KEY = 'grc-clubhouse-checkins'

export function getWeeklyGoalKm(): number {
  return readJson<number>(WEEKLY_GOAL_KEY, 80)
}

export function setWeeklyGoalKm(km: number) {
  const v = Math.max(20, Math.min(300, Math.round(km)))
  writeJson(WEEKLY_GOAL_KEY, v)
  return v
}

export function getWeekKm(): number {
  const start = new Date()
  start.setHours(0, 0, 0, 0)
  start.setDate(start.getDate() - start.getDay()) // Sunday start
  const fromActivities = getActivities()
    .filter(a => new Date(a.endedAt) >= start)
    .reduce((sum, a) => sum + (a.distanceKm || 0), 0)
  return Math.max(fromActivities, 42) // demo floor mid-week
}

export type ClubhouseCheckIn = {
  id: string
  clubhouse: 'tena' | 'utawala'
  at: string
}

export function getClubhouseCheckIns(): ClubhouseCheckIn[] {
  return readJson<ClubhouseCheckIn[]>(CHECKIN_KEY, [])
}

export function checkInClubhouse(clubhouse: 'tena' | 'utawala') {
  const next: ClubhouseCheckIn[] = [
    { id: `ch_${Date.now()}`, clubhouse, at: new Date().toISOString() },
    ...getClubhouseCheckIns(),
  ].slice(0, 20)
  writeJson(CHECKIN_KEY, next)
  return next
}

/** Demo season board — merge local season km for "you" */
export function getSeasonLeaderboard(youName?: string, youKm?: number) {
  const board = [
    { name: 'Victor Dawa', km: 412, elite: true },
    { name: 'Amina Otieno', km: 388, elite: true },
    { name: 'Dan Kiprop', km: 341, elite: true },
    { name: 'Mercy Njeri', km: 298, elite: true },
    { name: 'Leo Otieno', km: 244, elite: false },
    { name: 'Sam Kariuki', km: 221, elite: false },
    { name: 'Faith Wanjiku', km: 198, elite: false },
    { name: 'James Njoroge', km: 176, elite: false },
  ]
  const you = youName || 'You'
  const km = youKm ?? getSeasonKm()
  const withoutYou = board.filter(b => b.name !== you)
  return [...withoutYou, { name: you, km, elite: false, isYou: true as const }]
    .sort((a, b) => b.km - a.km)
    .map((row, i) => ({ ...row, rank: i + 1 }))
}

export type BikeService = {
  id: string
  bikeId: string
  kind: 'tune' | 'tires' | 'chain' | 'brake' | 'other'
  note: string
  at: string
  kmAtService?: number
}

const SERVICE_KEY = 'grc-bike-service'

export function getBikeServices(bikeId?: string): BikeService[] {
  const all = readJson<BikeService[]>(SERVICE_KEY, [])
  if (!bikeId) return all
  return all.filter(s => s.bikeId === bikeId)
}

export function addBikeService(s: BikeService) {
  const next = [s, ...getBikeServices()].slice(0, 40)
  writeJson(SERVICE_KEY, next)
  return next.filter(x => x.bikeId === s.bikeId)
}

export type LiveBadge = {
  id: string
  name: string
  hint: string
  earned: boolean
}

export function getLiveBadges(): LiveBadge[] {
  const streak = getStreak().count
  const season = getSeasonKm()
  const rides = getActivities().length
  const checkIns = getClubhouseCheckIns().length
  return [
    {
      id: 'ngong',
      name: 'Ngong Climber',
      hint: 'Log any climb activity',
      earned: rides >= 1 || season >= 50,
    },
    {
      id: 'magadi',
      name: 'Magadi Veteran',
      hint: 'Reach 150 season km',
      earned: season >= 150,
    },
    {
      id: 'streak3',
      name: 'Saturday Flame',
      hint: '3-week Saturday streak',
      earned: streak >= 3,
    },
    {
      id: 'rift',
      name: 'Rift Runner',
      hint: '250 km toward Rift 500',
      earned: season >= 250,
    },
    {
      id: 'hells',
      name: "Hell's Gate Survivor",
      hint: 'Finish Hell\'s Gate ride (demo: 400 km)',
      earned: season >= 400,
    },
    {
      id: 'house',
      name: 'Clubhouse Regular',
      hint: 'Check in at Tena or Utawala',
      earned: checkIns >= 1,
    },
  ]
}

export type NotifPrefs = {
  rideReminders: boolean
  captainPings: boolean
  raceAlerts: boolean
  wrenchUpdates: boolean
}

const PREFS_KEY = 'grc-notif-prefs'

export function getNotifPrefs(): NotifPrefs {
  return readJson<NotifPrefs>(PREFS_KEY, {
    rideReminders: true,
    captainPings: true,
    raceAlerts: true,
    wrenchUpdates: true,
  })
}

export function setNotifPrefs(prefs: NotifPrefs) {
  writeJson(PREFS_KEY, prefs)
  return prefs
}

export function resetSplash() {
  if (typeof sessionStorage !== 'undefined') sessionStorage.removeItem('grc-splash-done')
}

/** Soft clear of demo local data (keeps session). */
export function clearDemoCaches() {
  const keys = [
    'grc-rsvps',
    'grc-favorites',
    'grc-announcements',
    'grc-kit-checks',
    'grc-carpool',
    'grc-conditions',
    'grc-saturday-streak',
    'grc-weekly-goal',
    'grc-clubhouse-checkins',
    'grc-bike-service',
    'grc-activities',
    'grc-club-stories',
    'grc-offline-packs',
  ]
  keys.forEach(k => {
    try {
      localStorage.removeItem(k)
    } catch {
      /* ignore */
    }
  })
}
