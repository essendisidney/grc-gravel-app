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
  feel?: 1 | 2 | 3 | 4 | 5
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
  const dates = readJson<string[]>(STREAK_KEY, [])
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
    'grc-saved-rides',
    'grc-ride-status',
    'grc-kudos',
    'grc-late-pings',
    'grc-gear-board',
    'grc-incidents',
    'grc-rollout-checks',
    'grc-gate-self',
    'grc-chai-kitty',
    'grc-roll-out',
    'grc-home-clubhouse',
    'grc-emergency-proto',
    'grc-hazards',
    'grc-night-ride',
    'grc-fav-pace',
    'grc-stretch-checks',
    'grc-prep-checks',
    'grc-ride-delay',
    'grc-captain-thanks',
    'grc-regroup-eta',
    'grc-clubhouse-now',
    'grc-phone-charged',
    'grc-finish-checks',
    'grc-cash-float',
    'grc-spare-tube',
    'grc-buddy-check',
    'grc-lights-check',
    'grc-snack-pack',
    'grc-helmet-check',
    'grc-bottles-fill',
    'grc-gloves-check',
    'grc-pump-check',
    'grc-multitool-check',
    'grc-id-card-check',
    'grc-first-aid-check',
    'grc-cleat-check',
    'grc-salt-tabs',
    'grc-whistle-check',
    'grc-buff-check',
    'grc-spoke-key',
    'grc-sun-sleeves',
    'grc-cable-ties',
    'grc-arm-warmers',
    'grc-valve-cores',
    'grc-leg-warmers',
    'grc-patch-kit',
  ]
  keys.forEach(k => {
    try {
      localStorage.removeItem(k)
    } catch {
      /* ignore */
    }
  })
}

const ONBOARD_KEY = 'grc-onboarded'
const SAVED_RIDES_KEY = 'grc-saved-rides'

export function hasCompletedOnboarding() {
  return readJson<boolean>(ONBOARD_KEY, false)
}

export function completeOnboarding() {
  writeJson(ONBOARD_KEY, true)
}

export function getSavedRideIds(): string[] {
  return readJson<string[]>(SAVED_RIDES_KEY, [])
}

export function isRideSaved(rideId: string) {
  return getSavedRideIds().includes(rideId)
}

export function toggleSavedRide(rideId: string) {
  const set = new Set(getSavedRideIds())
  if (set.has(rideId)) set.delete(rideId)
  else set.add(rideId)
  const next = [...set]
  writeJson(SAVED_RIDES_KEY, next)
  return next
}

export type RideFeel = 1 | 2 | 3 | 4 | 5

export function setActivityFeel(id: string, feel: RideFeel) {
  const next = getActivities().map(a => (a.id === id ? { ...a, feel } : a))
  writeJson(ACTIVITY_KEY, next)
  return next
}

/** Suggest PSI range from tire width (demo heuristic for gravel). */
export function suggestPsi(tireMm = 40, riderKg = 75) {
  const base = Math.round(riderKg * 0.42 - (tireMm - 35) * 0.55)
  const front = Math.max(28, Math.min(55, base - 2))
  const rear = Math.max(30, Math.min(58, base + 1))
  return { front, rear, note: `${tireMm} mm · ~${riderKg} kg rider · start soft on Magadi dust` }
}

export type RideDayStatus = 'on' | 'postponed' | 'cancelled'

const RIDE_STATUS_KEY = 'grc-ride-status'
const KUDOS_KEY = 'grc-kudos'

export function getRideStatus(rideId: string): RideDayStatus {
  const all = readJson<Record<string, RideDayStatus>>(RIDE_STATUS_KEY, {})
  return all[rideId] || 'on'
}

export function setRideStatus(rideId: string, status: RideDayStatus) {
  const all = readJson<Record<string, RideDayStatus>>(RIDE_STATUS_KEY, {})
  all[rideId] = status
  writeJson(RIDE_STATUS_KEY, all)
  return status
}

export type Kudos = {
  id: string
  toName: string
  fromName: string
  message: string
  createdAt: string
}

export function getKudos(): Kudos[] {
  return readJson<Kudos[]>(KUDOS_KEY, [
    {
      id: 'k_seed',
      toName: 'Amina Otieno',
      fromName: 'Sam Kariuki',
      message: 'Held the Cruiser line through Magadi dust. Respect.',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    },
  ])
}

export function addKudos(k: Kudos) {
  const next = [k, ...getKudos()].slice(0, 30)
  writeJson(KUDOS_KEY, next)
  return next
}

export type CorridorPr = {
  rideId: string
  title: string
  bestSec: number
  distanceKm: number
  feel?: number
  at: string
}

/** Best elapsed time per ride corridor from logged activities */
export function getCorridorPrs(): CorridorPr[] {
  const map = new Map<string, CorridorPr>()
  for (const a of getActivities()) {
    if (!a.elapsedSec || a.elapsedSec < 60) continue
    const prev = map.get(a.rideId)
    if (!prev || a.elapsedSec < prev.bestSec) {
      map.set(a.rideId, {
        rideId: a.rideId,
        title: a.title,
        bestSec: a.elapsedSec,
        distanceKm: a.distanceKm,
        feel: a.feel,
        at: a.endedAt,
      })
    }
  }
  // demo seed if empty
  if (map.size === 0) {
    return [
      {
        rideId: 'ngong-magadi',
        title: 'Ngong → Magadi',
        bestSec: 3 * 3600 + 42 * 60,
        distanceKm: 86,
        feel: 4,
        at: new Date(Date.now() - 86400000 * 7).toISOString(),
      },
    ]
  }
  return [...map.values()].sort((a, b) => a.bestSec - b.bestSec)
}

export const MEETUP_PINS: Record<string, { id: string; name: string; note: string; km: number }[]> = {
  'ngong-magadi': [
    { id: 'm1', name: 'Tena gate', note: 'Roll-out · lights check', km: 0 },
    { id: 'm2', name: 'Kona Baridi', note: 'Regroup · bottles', km: 28 },
    { id: 'm3', name: 'Magadi flats pin', note: 'Dust caution · stay tight', km: 52 },
    { id: 'm4', name: 'Finish — Magadi', note: 'Photo + cold soda', km: 86 },
  ],
}

export function getMeetupPins(rideId: string) {
  return MEETUP_PINS[rideId] || [
    { id: 'g1', name: 'Start gate', note: 'Club roll-out', km: 0 },
    { id: 'g2', name: 'Mid regroup', note: 'Captain call', km: 20 },
    { id: 'g3', name: 'Finish', note: 'Pack photo', km: 40 },
  ]
}

const LATE_KEY = 'grc-late-pings'
const GEAR_KEY = 'grc-gear-board'

export type LatePing = {
  id: string
  rideId: string
  name: string
  etaMin: number
  note: string
  createdAt: string
}

export function getLatePings(rideId: string): LatePing[] {
  return readJson<LatePing[]>(LATE_KEY, []).filter(p => p.rideId === rideId)
}

export function addLatePing(ping: LatePing) {
  const all = [ping, ...readJson<LatePing[]>(LATE_KEY, [])].slice(0, 40)
  writeJson(LATE_KEY, all)
  return all.filter(p => p.rideId === ping.rideId)
}

export type WaterRefill = {
  id: string
  name: string
  km: number
  note: string
  reliable: boolean
}

export const WATER_REFILLS: Record<string, WaterRefill[]> = {
  'magadi-loop': [
    { id: 'w1', name: 'Tena clubhouse', km: 0, note: 'Fill 2 bottles before roll-out', reliable: true },
    { id: 'w2', name: 'Kona Baridi kiosk', km: 28, note: 'Cold drinks · cash/M-Pesa', reliable: true },
    { id: 'w3', name: 'Magadi town pump', km: 78, note: 'Confirm open · dusty afternoon', reliable: false },
  ],
  'ngong-ridge': [
    { id: 'w1', name: 'Ngong town', km: 0, note: 'Last reliable fill', reliable: true },
    { id: 'w2', name: 'Ridge viewpoint stall', km: 12, note: 'Seasonal — weekends only', reliable: false },
  ],
  'kona-baridi': [
    { id: 'w1', name: 'Tena gate', km: 0, note: 'Club fill-up', reliable: true },
    { id: 'w2', name: 'Kona Baridi', km: 22, note: 'Main regroup bottles', reliable: true },
  ],
}

export function getWaterRefills(routeId: string): WaterRefill[] {
  return (
    WATER_REFILLS[routeId] || [
      { id: 'd1', name: 'Start', km: 0, note: 'Fill before departure', reliable: true },
      { id: 'd2', name: 'Midway kiosk', km: 20, note: 'Ask locals', reliable: false },
    ]
  )
}

export type GearOffer = {
  id: string
  item: string
  fromName: string
  note: string
  available: boolean
  createdAt: string
}

export function getGearBoard(): GearOffer[] {
  return readJson<GearOffer[]>(GEAR_KEY, [
    {
      id: 'g_seed1',
      item: 'CO2 + spare tube (700×40)',
      fromName: 'Sam Kariuki',
      note: 'At Tena · Saturday mornings',
      available: true,
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: 'g_seed2',
      item: 'Front light (USB)',
      fromName: 'Amina Otieno',
      note: 'Return after Magadi',
      available: true,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
  ])
}

export function addGearOffer(offer: GearOffer) {
  const next = [offer, ...getGearBoard()].slice(0, 24)
  writeJson(GEAR_KEY, next)
  return next
}

export function claimGear(id: string) {
  const next = getGearBoard().map(g => (g.id === id ? { ...g, available: false } : g))
  writeJson(GEAR_KEY, next)
  return next
}

/** Dust / dry months for Nairobi–Magadi gravel (demo heuristic). */
export const DUST_SEASON_MONTHS = [1, 2, 6, 7, 8, 9] // Jan–Feb, Jun–Sep

export function getDustSeasonStatus(date = new Date()) {
  const month = date.getMonth() + 1
  const inDust = DUST_SEASON_MONTHS.includes(month)
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return {
    inDust,
    monthLabel: labels[month - 1],
    months: DUST_SEASON_MONTHS.map(m => labels[m - 1]),
    tip: inDust
      ? 'Dust season — lights on, tighter groups, extra bottles.'
      : 'Shoulder season — mud pockets possible after rain; check trail reports.',
  }
}

export function getAttendanceSummary(rideId: string) {
  const roster = getRollCall(rideId)
  const present = roster.filter(r => r.present)
  const absent = roster.filter(r => !r.present)
  const byPace = new Map<string, { present: number; total: number }>()
  for (const r of roster) {
    const cur = byPace.get(r.paceGroup) || { present: 0, total: 0 }
    cur.total += 1
    if (r.present) cur.present += 1
    byPace.set(r.paceGroup, cur)
  }
  return {
    total: roster.length,
    present: present.length,
    absent: absent.length,
    presentNames: present.map(r => r.name),
    absentNames: absent.map(r => r.name),
    byPace: [...byPace.entries()].map(([pace, v]) => ({ pace, ...v })),
  }
}

export function attendanceCsv(rideId: string, title = 'Club ride') {
  const roster = getRollCall(rideId)
  const lines = ['name,pace,status', ...roster.map(r => `"${r.name}","${r.paceGroup}",${r.present ? 'present' : 'absent'}`)]
  return `# ${title}\n# exported ${new Date().toISOString()}\n${lines.join('\n')}`
}

const INCIDENT_KEY = 'grc-incidents'
const ROLLOUT_KEY = 'grc-rollout-checks'
const GATE_SELF_KEY = 'grc-gate-self'

export type RideIncident = {
  id: string
  rideId: string
  type: 'puncture' | 'mechanical' | 'medical' | 'other'
  note: string
  kmEst: number
  createdAt: string
  name: string
}

export function getIncidents(rideId: string): RideIncident[] {
  return readJson<RideIncident[]>(INCIDENT_KEY, []).filter(i => i.rideId === rideId)
}

export function addIncident(incident: RideIncident) {
  const next = [incident, ...readJson<RideIncident[]>(INCIDENT_KEY, [])].slice(0, 40)
  writeJson(INCIDENT_KEY, next)
  return next.filter(i => i.rideId === incident.rideId)
}

export type RolloutChecks = {
  lights: boolean
  helmet: boolean
  bottles: boolean
}

export function getRolloutChecks(rideId: string): RolloutChecks {
  const all = readJson<Record<string, RolloutChecks>>(ROLLOUT_KEY, {})
  return all[rideId] || { lights: false, helmet: false, bottles: false }
}

export function setRolloutCheck(rideId: string, key: keyof RolloutChecks, value: boolean) {
  const all = readJson<Record<string, RolloutChecks>>(ROLLOUT_KEY, {})
  const cur = all[rideId] || { lights: false, helmet: false, bottles: false }
  all[rideId] = { ...cur, [key]: value }
  writeJson(ROLLOUT_KEY, all)
  return all[rideId]
}

export function isRolloutReady(rideId: string) {
  const c = getRolloutChecks(rideId)
  return c.lights && c.helmet && c.bottles
}

export function hasGateSelfCheckIn(rideId: string) {
  return readJson<Record<string, string>>(GATE_SELF_KEY, {})[rideId] != null
}

/** Member taps “I’m at the gate” — marks self present on roll call. */
export function gateSelfCheckIn(rideId: string, name: string, paceGroup: string) {
  const all = readJson<Record<string, RollCallRider[]>>(ROLLCALL_KEY, {})
  let list = all[rideId]?.length ? [...all[rideId]] : [...getRollCall(rideId)]
  const idx = list.findIndex(r => r.name.toLowerCase() === name.toLowerCase())
  if (idx >= 0) {
    list[idx] = { ...list[idx], present: true, paceGroup: paceGroup || list[idx].paceGroup }
  } else {
    list = [...list, { id: `self_${Date.now()}`, name, paceGroup, present: true }]
  }
  all[rideId] = list
  writeJson(ROLLCALL_KEY, all)
  const map = readJson<Record<string, string>>(GATE_SELF_KEY, {})
  map[rideId] = new Date().toISOString()
  writeJson(GATE_SELF_KEY, map)
  return list
}

const CHAI_KEY = 'grc-chai-kitty'

export type ChaiKitty = {
  rideId: string
  goalKes: number
  contributions: { id: string; name: string; amountKes: number; at: string }[]
}

export function getChaiKitty(rideId: string): ChaiKitty {
  const all = readJson<Record<string, ChaiKitty>>(CHAI_KEY, {})
  if (all[rideId]) return all[rideId]
  return {
    rideId,
    goalKes: 2000,
    contributions: [
      { id: 'c_seed', name: 'Amina Otieno', amountKes: 200, at: new Date(Date.now() - 3600000).toISOString() },
      { id: 'c_seed2', name: 'Sam Kariuki', amountKes: 100, at: new Date(Date.now() - 1800000).toISOString() },
    ],
  }
}

export function addChaiContribution(rideId: string, name: string, amountKes: number) {
  const all = readJson<Record<string, ChaiKitty>>(CHAI_KEY, {})
  const cur = all[rideId] || getChaiKitty(rideId)
  const next: ChaiKitty = {
    ...cur,
    contributions: [
      { id: `chai_${Date.now()}`, name, amountKes, at: new Date().toISOString() },
      ...cur.contributions,
    ].slice(0, 40),
  }
  all[rideId] = next
  writeJson(CHAI_KEY, all)
  return next
}

export function chaiTotal(kitty: ChaiKitty) {
  return kitty.contributions.reduce((s, c) => s + c.amountKes, 0)
}

/** Build WhatsApp-friendly start list from roll call. */
export function startListText(rideId: string, title: string) {
  const roster = getRollCall(rideId)
  const present = roster.filter(r => r.present)
  const lines = [
    `GRC · ${title}`,
    `Start list · ${present.length}/${roster.length} present`,
    '',
    ...roster.map(r => `${r.present ? '✓' : '○'} ${r.name} · ${r.paceGroup}`),
    '',
    'Lights on. See you at the gate.',
  ]
  return lines.join('\n')
}

export function recoveryTip(feel: number | null | undefined) {
  if (feel == null) return null
  if (feel <= 2) {
    return {
      title: 'Recovery day',
      body: 'Legs cooked — easy spin or rest tomorrow. Salt, water, early sleep.',
    }
  }
  if (feel === 3) {
    return {
      title: 'Active recovery',
      body: 'Steady coffee ride or yoga. Skip intervals until mid-week.',
    }
  }
  return {
    title: 'Bank the fitness',
    body: 'You felt strong — keep hydration high and note the corridor PR.',
  }
}

const ROLL_OUT_KEY = 'grc-roll-out'

export type RollOutBroadcast = {
  rideId: string
  message: string
  at: string
  captainName: string
}

export function getRollOutBroadcast(): RollOutBroadcast | null {
  const b = readJson<RollOutBroadcast | null>(ROLL_OUT_KEY, null)
  if (!b?.at) return null
  // expire after 3 hours
  if (Date.now() - new Date(b.at).getTime() > 3 * 3600 * 1000) return null
  return b
}

export function setRollOutBroadcast(b: RollOutBroadcast) {
  writeJson(ROLL_OUT_KEY, b)
  return b
}

export function clearRollOutBroadcast() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(ROLL_OUT_KEY)
}

/** Rough training load from logged activities in the last 7 days. */
export function getWeeklyTrainingLoad() {
  const weekAgo = Date.now() - 7 * 86400000
  const acts = getActivities().filter(a => new Date(a.endedAt).getTime() >= weekAgo)
  const km = acts.reduce((s, a) => s + (a.distanceKm || 0), 0)
  const climb = acts.reduce((s, a) => s + (a.elevationM || 0), 0)
  const hours = acts.reduce((s, a) => s + (a.elapsedSec || 0), 0) / 3600
  // demo TSS-ish: km * 1.2 + climb/100
  const load = Math.round(km * 1.2 + climb / 100)
  let band: 'easy' | 'build' | 'peak' | 'rest' = 'rest'
  if (load >= 180) band = 'peak'
  else if (load >= 90) band = 'build'
  else if (load >= 30) band = 'easy'
  return {
    km: Math.round(km * 10) / 10,
    climb: Math.round(climb),
    hours: Math.round(hours * 10) / 10,
    rides: acts.length,
    load: load || (acts.length ? load : 42), // demo seed feel when empty
    band: acts.length ? band : ('easy' as const),
    seeded: acts.length === 0,
  }
}

export function getHeatWindAdvisory(date = new Date()) {
  const month = date.getMonth() + 1
  const hour = date.getHours()
  const heat =
    (month >= 1 && month <= 3) || month === 12
      ? { level: 'elevated' as const, note: 'Rift heat builds by mid-morning — roll early, extra bottles.' }
      : month >= 6 && month <= 9
        ? { level: 'moderate' as const, note: 'Cooler dust mornings — heat still climbs after 10:00.' }
        : { level: 'mild' as const, note: 'Shoulder season temps — watch afternoon storms.' }
  const wind =
    month >= 6 && month <= 9
      ? { level: 'gusty' as const, note: 'Magadi flats often windy — stay in echelon.' }
      : { level: 'light' as const, note: 'Expect valley breezes on the descent.' }
  const morningBias = hour < 9
  return {
    heat,
    wind,
    tip: morningBias
      ? 'Best window: before 09:00 for cooler roll-out.'
      : 'If rolling late, double water and regroup tighter on exposed flats.',
  }
}

export const DEMO_MERCH = [
  { id: 'm1', name: 'GRC gravel jersey', priceKes: 4500, note: 'Gold crest · breathable' },
  { id: 'm2', name: 'Club cap', priceKes: 1200, note: 'Dust-season essential' },
  { id: 'm3', name: 'Bidon 750ml', priceKes: 800, note: 'Clubhouse stock' },
]

const HOME_HOUSE_KEY = 'grc-home-clubhouse'
const EMERGENCY_PROTO_KEY = 'grc-emergency-proto'

export type HomeClubhouse = 'tena' | 'utawala'

export function getHomeClubhouse(): HomeClubhouse {
  return readJson<HomeClubhouse>(HOME_HOUSE_KEY, 'tena')
}

export function setHomeClubhouse(h: HomeClubhouse) {
  writeJson(HOME_HOUSE_KEY, h)
  return h
}

export const EMERGENCY_PROTOCOL = [
  { id: 'stop', label: 'Stop safely · off the road' },
  { id: 'group', label: 'Alert your pace group / captain' },
  { id: 'sos', label: 'Call SOS contact or club line' },
  { id: 'location', label: 'Share pin / landmark if signal' },
  { id: 'stay', label: 'Stay with rider until help arrives' },
]

export function getEmergencyProtoChecked(): string[] {
  return readJson<string[]>(EMERGENCY_PROTO_KEY, [])
}

export function toggleEmergencyProto(id: string) {
  const set = new Set(getEmergencyProtoChecked())
  if (set.has(id)) set.delete(id)
  else set.add(id)
  const next = [...set]
  writeJson(EMERGENCY_PROTO_KEY, next)
  return next
}

export function getWeekDigest() {
  const load = getWeeklyTrainingLoad()
  const streak = getStreak()
  return {
    lines: [
      streak.count > 0
        ? `Saturday streak · ${streak.count} week${streak.count === 1 ? '' : 's'}`
        : 'No Saturday streak yet — join the next Magadi',
      load.seeded
        ? 'Training load waiting on your first logged ride'
        : `This week · ${load.km} km · load ${load.load} (${load.band})`,
      'Club kit pickup · Tena & Utawala — see Club shop',
    ],
  }
}

const HAZARD_KEY = 'grc-hazards'
const NIGHT_KEY = 'grc-night-ride'

export type HazardPin = {
  id: string
  rideId: string
  kind: 'pothole' | 'gravel' | 'cattle' | 'other'
  note: string
  kmApprox: number
  name: string
  createdAt: string
}

export function getHazards(rideId: string): HazardPin[] {
  return readJson<HazardPin[]>(HAZARD_KEY, [
    {
      id: 'hz_seed',
      rideId: 'ngong-magadi',
      kind: 'gravel',
      note: 'Deep corrugation after Kona Baridi',
      kmApprox: 32,
      name: 'Amina Otieno',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
  ]).filter(h => h.rideId === rideId)
}

export function addHazard(h: HazardPin) {
  const all = [h, ...readJson<HazardPin[]>(HAZARD_KEY, [])].slice(0, 40)
  writeJson(HAZARD_KEY, all)
  return all.filter(x => x.rideId === h.rideId)
}

export function getNightRidePref() {
  return readJson<boolean>(NIGHT_KEY, false)
}

export function setNightRidePref(on: boolean) {
  writeJson(NIGHT_KEY, on)
  return on
}

export function getOfflinePackHealth() {
  const packs = getOfflinePacks()
  if (!packs.length) {
    return { score: 0, label: 'No packs', hint: 'Save a Magadi pack from Discover for patchy signal.', packs: 0 }
  }
  const fresh = packs.filter(p => Date.now() - new Date(p.savedAt).getTime() < 14 * 86400000).length
  const score = Math.round((fresh / packs.length) * 70 + Math.min(30, packs.length * 10))
  const label = score >= 80 ? 'Ready' : score >= 50 ? 'OK' : 'Stale'
  return {
    score,
    label,
    hint:
      label === 'Stale'
        ? 'Re-save route packs — intel older than 2 weeks.'
        : `${packs.length} pack${packs.length === 1 ? '' : 's'} on this device.`,
    packs: packs.length,
    fresh,
  }
}

export function isNewRider() {
  return getActivities().length === 0 && !getRsvp('ngong-magadi')
}

const FAV_PACE_KEY = 'grc-fav-pace'
const STRETCH_KEY = 'grc-stretch-checks'

export function getFavoritePaceId() {
  return readJson<string>(FAV_PACE_KEY, 'cruiser')
}

export function setFavoritePaceId(id: string) {
  writeJson(FAV_PACE_KEY, id)
  return id
}

export const STRETCH_STEPS = [
  { id: 'quads', label: 'Quads · 30s each side' },
  { id: 'hams', label: 'Hamstrings · hinge soft' },
  { id: 'hips', label: 'Hip flexors · Magadi climb unwind' },
  { id: 'calves', label: 'Calves · wall stretch' },
  { id: 'neck', label: 'Neck / shoulders · dust shake-out' },
]

export function getStretchChecked(rideId: string): string[] {
  const all = readJson<Record<string, string[]>>(STRETCH_KEY, {})
  return all[rideId] || []
}

export function toggleStretch(rideId: string, stepId: string) {
  const all = readJson<Record<string, string[]>>(STRETCH_KEY, {})
  const set = new Set(all[rideId] || [])
  if (set.has(stepId)) set.delete(stepId)
  else set.add(stepId)
  all[rideId] = [...set]
  writeJson(STRETCH_KEY, all)
  return all[rideId]
}

/** Countdown to ride start (ride_date + start_time local). */
export function getRollOutCountdown(rideDate: string, startTime: string, now = new Date()) {
  const [hh, mm] = (startTime || '06:15:00').split(':').map(Number)
  const target = new Date(`${rideDate}T00:00:00`)
  if (Number.isNaN(target.getTime())) {
    return { label: 'Soon', totalSec: 0, past: false }
  }
  target.setHours(hh || 6, mm || 15, 0, 0)
  const totalSec = Math.floor((target.getTime() - now.getTime()) / 1000)
  if (totalSec <= 0) {
    return { label: 'Rolling', totalSec: 0, past: true }
  }
  const d = Math.floor(totalSec / 86400)
  const h = Math.floor((totalSec % 86400) / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const label =
    d > 0 ? `${d}d ${h}h` : h > 0 ? `${h}h ${String(m).padStart(2, '0')}m` : `${m}m`
  return { label, totalSec, past: false, days: d, hours: h, minutes: m }
}

export type SignalDeadZone = {
  id: string
  name: string
  fromKm: number
  toKm: number
  note: string
}

export const SIGNAL_DEAD_ZONES: Record<string, SignalDeadZone[]> = {
  'magadi-loop': [
    { id: 's1', name: 'After Kona Baridi', fromKm: 28, toKm: 38, note: 'Patchy Safaricom · download pack first' },
    { id: 's2', name: 'Magadi flats dip', fromKm: 55, toKm: 68, note: 'Expect dropouts · stay with group' },
  ],
  'ngong-ridge': [
    { id: 's1', name: 'Ridge lee side', fromKm: 8, toKm: 14, note: 'Brief dead zone' },
  ],
  'kona-baridi': [
    { id: 's1', name: 'Descent pocket', fromKm: 14, toKm: 18, note: 'Weak signal on climb reverse' },
  ],
}

export function getSignalDeadZones(routeId: string): SignalDeadZone[] {
  return (
    SIGNAL_DEAD_ZONES[routeId] || [
      { id: 'd1', name: 'Mid corridor', fromKm: 15, toKm: 25, note: 'Assume patchy — pack offline' },
    ]
  )
}

const PREP_KEY = 'grc-prep-checks'
const DELAY_KEY = 'grc-ride-delay'

export const PREP_STEPS = [
  { id: 'bottles', label: 'Bottles in fridge' },
  { id: 'lights', label: 'Lights charged' },
  { id: 'tubes', label: 'Tubes + CO2 in jersey' },
  { id: 'alarm', label: 'Alarm set for gate' },
  { id: 'kit', label: 'Kit laid out' },
]

export function getPrepChecked(rideId: string): string[] {
  const all = readJson<Record<string, string[]>>(PREP_KEY, {})
  return all[rideId] || []
}

export function togglePrep(rideId: string, stepId: string) {
  const all = readJson<Record<string, string[]>>(PREP_KEY, {})
  const set = new Set(all[rideId] || [])
  if (set.has(stepId)) set.delete(stepId)
  else set.add(stepId)
  all[rideId] = [...set]
  writeJson(PREP_KEY, all)
  return all[rideId]
}

export function getRideDelayMin(rideId: string) {
  const all = readJson<Record<string, number>>(DELAY_KEY, {})
  return all[rideId] || 0
}

export function setRideDelayMin(rideId: string, minutes: number) {
  const all = readJson<Record<string, number>>(DELAY_KEY, {})
  all[rideId] = Math.max(0, minutes)
  writeJson(DELAY_KEY, all)
  return all[rideId]
}

export type ClimbSegment = {
  id: string
  name: string
  fromKm: number
  toKm: number
  gainM: number
  note: string
}

export const CLIMB_SEGMENTS: Record<string, ClimbSegment[]> = {
  'magadi-loop': [
    { id: 'c1', name: 'Ngong rise', fromKm: 4, toKm: 12, gainM: 280, note: 'Settle early · keep cadence' },
    { id: 'c2', name: 'Olepolos wall', fromKm: 40, toKm: 48, gainM: 320, note: 'Hardest pitch · regroup top' },
  ],
  'ngong-ridge': [
    { id: 'c1', name: 'Ridge punch', fromKm: 3, toKm: 9, gainM: 210, note: 'Short & steep' },
  ],
  'kona-baridi': [
    { id: 'c1', name: 'Baridi climb', fromKm: 10, toKm: 18, gainM: 240, note: 'Steady grind' },
  ],
}

export function getClimbSegments(routeId: string): ClimbSegment[] {
  return (
    CLIMB_SEGMENTS[routeId] || [
      { id: 'c0', name: 'Main climb', fromKm: 8, toKm: 16, gainM: 200, note: 'Demo segment' },
    ]
  )
}

export function getSeasonMilestones() {
  const km = getSeasonKm()
  const streak = getStreak().count
  const rides = getActivities().length
  const defs = [
    { id: 'm1', label: 'First dust', done: rides >= 1 || km > 0, hint: 'Log a ride' },
    { id: 'm2', label: '100 km season', done: km >= 100, hint: `${Math.min(100, Math.round(km))}/100` },
    { id: 'm3', label: '3-Saturday streak', done: streak >= 3, hint: `${streak}/3` },
    { id: 'm4', label: 'Rift 500', done: km >= 500, hint: `${Math.min(500, Math.round(km))}/500` },
  ]
  return defs
}

const THANKS_KEY = 'grc-captain-thanks'
const REGROUP_KEY = 'grc-regroup-eta'

export function getSunriseWindow(startTime = '06:15:00') {
  const [hh, mm] = startTime.split(':').map(Number)
  const startMin = (hh || 6) * 60 + (mm || 15)
  // Nairobi-ish sunrise ~06:20 demo
  const sunrise = 6 * 60 + 20
  const delta = startMin - sunrise
  if (Math.abs(delta) <= 25) {
    return {
      label: 'Golden hour roll-out',
      tip: 'Soft light on Magadi — great for pack photos at Kona Baridi.',
    }
  }
  if (delta < 0) {
    return {
      label: 'Pre-sunrise start',
      tip: 'Lights mandatory. Expect chill air until the ridge.',
    }
  }
  return {
    label: 'Full sun window',
    tip: 'Heat builds fast — extra bottle, early sunscreen.',
  }
}

export function getPrimaryTireHint() {
  const bikes = getBikes()
  const primary = bikes.find(b => b.isPrimary) || bikes[0]
  if (!primary) {
    return { label: 'Add a bike', tip: 'Set tire width in Garage for PSI + tube hints.', href: '/passport/garage' }
  }
  const mm = primary.tireMm || 40
  const psi = suggestPsi(mm, 75)
  return {
    label: primary.name || primary.brand || 'Primary bike',
    tip: `${mm} mm · tubes/CO2 for that size · start ~${psi.front}/${psi.rear} psi`,
    href: '/passport/garage',
  }
}

export function getRegroupEtaMin(rideId: string) {
  const all = readJson<Record<string, number>>(REGROUP_KEY, {})
  return all[rideId] ?? 12
}

export function setRegroupEtaMin(rideId: string, min: number) {
  const all = readJson<Record<string, number>>(REGROUP_KEY, {})
  all[rideId] = Math.max(3, Math.min(45, min))
  writeJson(REGROUP_KEY, all)
  return all[rideId]
}

export function hasThankedCaptain(rideId: string) {
  return readJson<string[]>(THANKS_KEY, []).includes(rideId)
}

export function thankCaptain(rideId: string, captainName: string, fromName: string) {
  const ids = new Set(readJson<string[]>(THANKS_KEY, []))
  ids.add(rideId)
  writeJson(THANKS_KEY, [...ids])
  addKudos({
    id: `thx_${Date.now()}`,
    toName: captainName,
    fromName,
    message: 'Thanks for holding the line today — safe pack, clear calls.',
    createdAt: new Date().toISOString(),
  })
  return true
}

const CLUBHOUSE_NOW_KEY = 'grc-clubhouse-now'

export function getDustMaskTip(date = new Date()) {
  const dust = getDustSeasonStatus(date)
  if (dust.inDust) {
    return {
      show: true,
      title: 'Dust mask / glasses',
      body: 'Magadi dust season — buff or glasses in the jersey pocket before roll-out.',
    }
  }
  return {
    show: true,
    title: 'Eye protection',
    body: 'Shoulder season gravel still kicks — clear glasses recommended on descents.',
  }
}

export function getPostRideNutrition(feel: number | null | undefined, distanceKm: number) {
  if (feel != null && feel <= 2) {
    return {
      title: 'Rebuild meal',
      body: 'Salt + protein within an hour. Mandazi and eggs beat pure sugar.',
    }
  }
  if (distanceKm >= 60) {
    return {
      title: 'Long-day fuel',
      body: 'Two bottles done — chai, banana, then a proper plate. Skip only coffee.',
    }
  }
  return {
    title: 'Easy top-up',
    body: 'Water + something salty. Keep dinner normal; no need to feast.',
  }
}

export type ClubhousePresence = {
  id: string
  name: string
  clubhouse: 'tena' | 'utawala'
  note: string
  at: string
}

export function getClubhouseNow(): ClubhousePresence[] {
  return readJson<ClubhousePresence[]>(CLUBHOUSE_NOW_KEY, [
    {
      id: 'cn1',
      name: 'Sam Kariuki',
      clubhouse: 'tena',
      note: 'Wrench bay',
      at: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    },
    {
      id: 'cn2',
      name: 'Mercy Njeri',
      clubhouse: 'tena',
      note: 'Coffee',
      at: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
    },
    {
      id: 'cn3',
      name: 'Dan Kiprop',
      clubhouse: 'utawala',
      note: 'Kit pickup',
      at: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
    },
  ])
}

export function checkInClubhouseNow(clubhouse: 'tena' | 'utawala', name: string, note = 'Hanging out') {
  const next: ClubhousePresence = {
    id: `cn_${Date.now()}`,
    name,
    clubhouse,
    note,
    at: new Date().toISOString(),
  }
  const list = [next, ...getClubhouseNow().filter(p => p.name !== name)].slice(0, 20)
  writeJson(CLUBHOUSE_NOW_KEY, list)
  return list
}

export function getSpotsPulse(registered: number, max: number) {
  const left = Math.max(0, max - registered)
  if (left === 0) return { label: 'Full', tone: 'full' as const, left: 0 }
  if (left <= 5) return { label: `${left} spots left`, tone: 'hot' as const, left }
  return { label: `${left} open`, tone: 'ok' as const, left }
}

const PHONE_CHARGE_KEY = 'grc-phone-charged'
const FINISH_KEY = 'grc-finish-checks'

export function getPhoneCharged(rideId: string) {
  return readJson<Record<string, boolean>>(PHONE_CHARGE_KEY, {})[rideId] === true
}

export function setPhoneCharged(rideId: string, on: boolean) {
  const all = readJson<Record<string, boolean>>(PHONE_CHARGE_KEY, {})
  all[rideId] = on
  writeJson(PHONE_CHARGE_KEY, all)
  return on
}

export const FINISH_LINE_STEPS = [
  { id: 'stretch', label: 'Quick stretch at the gate' },
  { id: 'photo', label: 'Pack photo' },
  { id: 'chai', label: 'Chai / soda with the pack' },
  { id: 'log', label: 'Log the ride in the app' },
]

export function getFinishChecks(rideId: string): string[] {
  const all = readJson<Record<string, string[]>>(FINISH_KEY, {})
  return all[rideId] || []
}

export function toggleFinishCheck(rideId: string, stepId: string) {
  const all = readJson<Record<string, string[]>>(FINISH_KEY, {})
  const set = new Set(all[rideId] || [])
  if (set.has(stepId)) set.delete(stepId)
  else set.add(stepId)
  all[rideId] = [...set]
  writeJson(FINISH_KEY, all)
  return all[rideId]
}

export function getWeekRsvpSummary(rides: { id: string; title: string; ride_date: string; distance_km?: number }[]) {
  const rsvps = getRsvps()
  const joined = rides.filter(r => rsvps.some(x => x.rideId === r.id && x.status === 'registered'))
  const km = joined.reduce((s, r) => s + (r.distance_km || 0), 0)
  return {
    count: joined.length,
    km: Math.round(km),
    titles: joined.map(r => r.title),
    empty: joined.length === 0,
  }
}

export function getSurfaceMix(gravelPct: number, tarmacPct?: number) {
  const gravel = Math.max(0, Math.min(100, gravelPct || 0))
  const tarmac = tarmacPct != null ? Math.max(0, Math.min(100, tarmacPct)) : Math.max(0, 100 - gravel)
  const other = Math.max(0, 100 - gravel - tarmac)
  return { gravel, tarmac, other }
}

/** Leave-home cue — Nairobi traffic buffer before Magadi roll-out */
export function getLeaveHomeCue(startTime = '06:15:00', bufferMin = 50) {
  const [hh, mm] = startTime.split(':').map(Number)
  const startMin = (hh || 6) * 60 + (mm || 15)
  const leaveMin = Math.max(0, startMin - bufferMin)
  const lh = Math.floor(leaveMin / 60)
  const lm = leaveMin % 60
  const label = `${String(lh).padStart(2, '0')}:${String(lm).padStart(2, '0')}`
  return {
    leaveBy: label,
    bufferMin,
    tip: `Aim to leave home by ${label} for a calm gate arrival — Saturday Ngong Road traffic adds ~${bufferMin} min.`,
  }
}

const CASH_FLOAT_KEY = 'grc-cash-float'

export function getCashFloatPacked(rideId: string) {
  return readJson<Record<string, boolean>>(CASH_FLOAT_KEY, {})[rideId] === true
}

export function setCashFloatPacked(rideId: string, on: boolean) {
  const all = readJson<Record<string, boolean>>(CASH_FLOAT_KEY, {})
  all[rideId] = on
  writeJson(CASH_FLOAT_KEY, all)
  return on
}

export function getGateParkingTip(routeId: string) {
  const tips: Record<string, { title: string; body: string }> = {
    'magadi-loop': {
      title: 'Park at Ngong gate lot',
      body: 'Arrive early — overflow spills onto the verge. Lock bikes facing the roll-out line, not the highway.',
    },
    'ngong-ridge': {
      title: 'Ridge trailhead parking',
      body: 'Tight shoulder near the forest gate. Don’t block matatu turnarounds.',
    },
    'kona-baridi': {
      title: 'Kona Baridi pull-off',
      body: 'Use the chai stop shoulder — leave space for regroup vans.',
    },
    'kiserian-classic': {
      title: 'Kiserian market edge',
      body: 'Park past the market stalls; keep the taxi bay clear.',
    },
    'hells-gate-loop': {
      title: 'Park HQ lot',
      body: 'Pay park fees first, then stage bikes near the main gate briefing spot.',
    },
  }
  return (
    tips[routeId] || {
      title: 'Gate parking',
      body: 'Arrive 15 min early. Stage bikes clear of the roll-out line and keep the shoulder free for late cars.',
    }
  )
}

export function getDustRinseTip(distanceKm = 60) {
  if (distanceKm >= 80) {
    return {
      title: 'Full rinse tonight',
      body: 'Long Magadi dust day — hose the drivetrain, wipe the cassette, and check sealant before next Saturday.',
    }
  }
  if (distanceKm >= 40) {
    return {
      title: 'Quick dust rinse',
      body: 'Wipe chain + brake tracks before the bike sits overnight. Dry dust eats pads fast.',
    }
  }
  return {
    title: 'Wipe-down',
    body: 'Short loop — still wipe the chain and check for grit in the jockey wheels.',
  }
}

export function getUvSunscreenTip(startTime = '06:15:00') {
  const [hh] = startTime.split(':').map(Number)
  if ((hh || 6) < 7) {
    return {
      title: 'SPF before the ridge',
      body: 'Early start still burns on Magadi — ears, neck, and the backs of calves. Reapply at the first regroup.',
    }
  }
  return {
    title: 'High-UV corridor',
    body: 'Mid-morning Magadi is harsh. SPF 50 + sunglasses — shade is scarce past Kona Baridi.',
  }
}

export function getReturnTrafficTip(startTime = '06:15:00') {
  const [hh, mm] = startTime.split(':').map(Number)
  const startMin = (hh || 6) * 60 + (mm || 15)
  const backMin = startMin + 4 * 60 + 30
  const bh = Math.floor((backMin % (24 * 60)) / 60)
  const bm = backMin % 60
  const backLabel = `${String(bh).padStart(2, '0')}:${String(bm).padStart(2, '0')}`
  return {
    backAround: backLabel,
    tip: `Expect Ngong Road clog ~${backLabel} if the pack rolls on schedule. Fuel up at the gate before the drive home.`,
  }
}

const SPARE_TUBE_KEY = 'grc-spare-tube'
const BUDDY_CHECK_KEY = 'grc-buddy-check'

export function getSpareTubePacked(rideId: string) {
  return readJson<Record<string, boolean>>(SPARE_TUBE_KEY, {})[rideId] === true
}

export function setSpareTubePacked(rideId: string, on: boolean) {
  const all = readJson<Record<string, boolean>>(SPARE_TUBE_KEY, {})
  all[rideId] = on
  writeJson(SPARE_TUBE_KEY, all)
  return on
}

export function getBuddyChecked(rideId: string) {
  return readJson<Record<string, boolean>>(BUDDY_CHECK_KEY, {})[rideId] === true
}

export function setBuddyChecked(rideId: string, on: boolean) {
  const all = readJson<Record<string, boolean>>(BUDDY_CHECK_KEY, {})
  all[rideId] = on
  writeJson(BUDDY_CHECK_KEY, all)
  return on
}

const LIGHTS_KEY = 'grc-lights-check'
const SNACK_KEY = 'grc-snack-pack'

export function getLightsReady(rideId: string) {
  return readJson<Record<string, boolean>>(LIGHTS_KEY, {})[rideId] === true
}

export function setLightsReady(rideId: string, on: boolean) {
  const all = readJson<Record<string, boolean>>(LIGHTS_KEY, {})
  all[rideId] = on
  writeJson(LIGHTS_KEY, all)
  return on
}

export function getSnackPacked(rideId: string) {
  return readJson<Record<string, boolean>>(SNACK_KEY, {})[rideId] === true
}

export function setSnackPacked(rideId: string, on: boolean) {
  const all = readJson<Record<string, boolean>>(SNACK_KEY, {})
  all[rideId] = on
  writeJson(SNACK_KEY, all)
  return on
}

export function getPhotoSpotTip(routeId: string) {
  const tips: Record<string, { title: string; body: string }> = {
    'magadi-loop': {
      title: 'Kona Baridi overlook',
      body: 'Best pack shot facing the Rift — soft light ~30 min after sunrise. Stage bikes off the verge.',
    },
    'ngong-ridge': {
      title: 'Ridge crest windbreak',
      body: 'Wide shot of Nairobi behind the pack. Keep the frame clear of power lines if you can.',
    },
    'kona-baridi': {
      title: 'Chai stop wall',
      body: 'Classic GRC group photo against the shop wall after the climb.',
    },
    'kiserian-classic': {
      title: 'Market road rollers',
      body: 'Low-angle shot on the gravel rollers past the stalls — dusty gold hour.',
    },
    'hells-gate-loop': {
      title: 'Cliff gate frame',
      body: 'Ride through the rock gate for the hero still — one by one, not a pile-up.',
    },
  }
  return (
    tips[routeId] || {
      title: 'Pack photo spot',
      body: 'Ask the captain for the regroup shot — one clean frame beats twenty blurry ones.',
    }
  )
}

export function getChainLubeTip(distanceKm = 60) {
  if (distanceKm >= 70) {
    return {
      title: 'Re-lube before next Saturday',
      body: 'Long dusty day stripped the film — wipe, one drop per roller, wipe again. Dry lube for Magadi season.',
    }
  }
  return {
    title: 'Quick chain wipe',
    body: 'Dust + chain = grind. Wipe tonight so the next roll feels quiet.',
  }
}

const HELMET_KEY = 'grc-helmet-check'
const BOTTLES_KEY = 'grc-bottles-fill'

export function getHelmetReady(rideId: string) {
  return readJson<Record<string, boolean>>(HELMET_KEY, {})[rideId] === true
}

export function setHelmetReady(rideId: string, on: boolean) {
  const all = readJson<Record<string, boolean>>(HELMET_KEY, {})
  all[rideId] = on
  writeJson(HELMET_KEY, all)
  return on
}

export function getBottlesFilled(rideId: string) {
  return readJson<Record<string, boolean>>(BOTTLES_KEY, {})[rideId] === true
}

export function setBottlesFilled(rideId: string, on: boolean) {
  const all = readJson<Record<string, boolean>>(BOTTLES_KEY, {})
  all[rideId] = on
  writeJson(BOTTLES_KEY, all)
  return on
}

export function getMatatuCautionTip(routeId: string) {
  const tips: Record<string, { title: string; body: string }> = {
    'magadi-loop': {
      title: 'Share the Magadi road',
      body: 'Matatus and trucks move fast on the tarmac sections — ride single file, no sudden swerves at the verge.',
    },
    'ngong-ridge': {
      title: 'Ngong Road traffic',
      body: 'Expect matatus near the forest gate. Hold your line and let them pass wide.',
    },
    'kiserian-classic': {
      title: 'Market edge caution',
      body: 'Pedestrians + bodas near the stalls. Soft pace until you’re clear of town.',
    },
    'hells-gate-loop': {
      title: 'Park vehicles',
      body: 'Safari vans stop without warning — leave a buffer and call obstacles early.',
    },
  }
  return (
    tips[routeId] || {
      title: 'Road share',
      body: 'Assume vehicles don’t see gravel riders. Bright kit, clear signals, single file on busy stretches.',
    }
  )
}

export function getSaddleBagTip(distanceKm = 60, feel?: number | null) {
  if (feel === 1 || feel === 2 || distanceKm >= 80) {
    return {
      title: 'Saddle time recovery',
      body: 'Long Magadi hours — stand and walk tonight, light hip openers, and check saddle height before next Saturday.',
    }
  }
  if (distanceKm >= 50) {
    return {
      title: 'Shake out the hips',
      body: 'A short walk after the car ride home keeps the lower back happy.',
    }
  }
  return {
    title: 'Easy cool-down',
    body: 'Unclip, walk 2 minutes, hydrate — small habits beat next-day stiffness.',
  }
}

const GLOVES_KEY = 'grc-gloves-check'
const PUMP_KEY = 'grc-pump-check'

export function getGlovesReady(rideId: string) {
  return readJson<Record<string, boolean>>(GLOVES_KEY, {})[rideId] === true
}

export function setGlovesReady(rideId: string, on: boolean) {
  const all = readJson<Record<string, boolean>>(GLOVES_KEY, {})
  all[rideId] = on
  writeJson(GLOVES_KEY, all)
  return on
}

export function getPumpPacked(rideId: string) {
  return readJson<Record<string, boolean>>(PUMP_KEY, {})[rideId] === true
}

export function setPumpPacked(rideId: string, on: boolean) {
  const all = readJson<Record<string, boolean>>(PUMP_KEY, {})
  all[rideId] = on
  writeJson(PUMP_KEY, all)
  return on
}

export function getRegroupRuleTip(routeId: string) {
  const tips: Record<string, { title: string; body: string }> = {
    'magadi-loop': {
      title: 'Wait at every regroup',
      body: 'No one left behind on Magadi — soft pedal at Kona Baridi and the flats until the captain rolls.',
    },
    'ngong-ridge': {
      title: 'Crest and hold',
      body: 'Stop just past the ridge crest, not on the blind side. Call “clear” before descending.',
    },
    'kona-baridi': {
      title: 'Chai stop regroup',
      body: 'Full pack count before leaving the shop. Captains call the next segment.',
    },
    'kiserian-classic': {
      title: 'Town exit hold',
      body: 'Regroup once clear of market traffic — then open the rollers together.',
    },
    'hells-gate-loop': {
      title: 'Gate-to-gate count',
      body: 'Headcount at park entry and exit. Don’t skip the captain’s whistle.',
    },
  }
  return (
    tips[routeId] || {
      title: 'Club regroup rule',
      body: 'Stay soft until the last rider and the captain say go. Gaps are fine; abandonments aren’t.',
    }
  )
}

export function getBrakePadTip(distanceKm = 60) {
  if (distanceKm >= 70) {
    return {
      title: 'Check pad bite',
      body: 'Long dusty descents glaze pads — a quick wipe of the rotors tonight keeps tomorrow’s braking honest.',
    }
  }
  return {
    title: 'Brake wipe',
    body: 'Dust on rotors = squeal. Wipe pads/rotors after Magadi-style gravel before the next ride.',
  }
}

const MULTITOOL_KEY = 'grc-multitool-check'
const ID_CARD_KEY = 'grc-id-card-check'

export function getMultiToolPacked(rideId: string) {
  return readJson<Record<string, boolean>>(MULTITOOL_KEY, {})[rideId] === true
}

export function setMultiToolPacked(rideId: string, on: boolean) {
  const all = readJson<Record<string, boolean>>(MULTITOOL_KEY, {})
  all[rideId] = on
  writeJson(MULTITOOL_KEY, all)
  return on
}

export function getIdCardPacked(rideId: string) {
  return readJson<Record<string, boolean>>(ID_CARD_KEY, {})[rideId] === true
}

export function setIdCardPacked(rideId: string, on: boolean) {
  const all = readJson<Record<string, boolean>>(ID_CARD_KEY, {})
  all[rideId] = on
  writeJson(ID_CARD_KEY, all)
  return on
}

export function getDescentCautionTip(routeId: string) {
  const tips: Record<string, { title: string; body: string }> = {
    'magadi-loop': {
      title: 'Soft hands on the drop',
      body: 'Corrugations after Kona Baridi — brake early, wide vision, don’t lock the front on loose gravel.',
    },
    'ngong-ridge': {
      title: 'Ridge descent discipline',
      body: 'Blind corners and goats. Call “rider back” and leave space — no hero lines.',
    },
    'kona-baridi': {
      title: 'Shop-road rollers',
      body: 'Fast rollers into town traffic. Feather brakes before the stalls appear.',
    },
    'kiserian-classic': {
      title: 'Market approach',
      body: 'Descend into town single file. Expect bodas cutting across the verge.',
    },
    'hells-gate-loop': {
      title: 'Park gravel drops',
      body: 'Steep park sections get sandy — stay seated, light rear brake, eyes up.',
    },
  }
  return (
    tips[routeId] || {
      title: 'Descent caution',
      body: 'Loose gravel rewards patience. Brake before the corner, look through it, trust the pack order.',
    }
  )
}

export function getKitWashTip(distanceKm = 60) {
  if (distanceKm >= 70) {
    return {
      title: 'Rinse the kit tonight',
      body: 'Magadi dust embeds in jersey fabric — cold rinse + hang dry so tomorrow’s kit doesn’t smell like the corridor.',
    }
  }
  return {
    title: 'Shake out the kit',
    body: 'Turn the jersey inside out, shake the dust, and air it before the hamper. Pads last longer that way.',
  }
}

const FIRST_AID_KEY = 'grc-first-aid-check'
const CLEAT_KEY = 'grc-cleat-check'

export function getFirstAidPacked(rideId: string) {
  return readJson<Record<string, boolean>>(FIRST_AID_KEY, {})[rideId] === true
}

export function setFirstAidPacked(rideId: string, on: boolean) {
  const all = readJson<Record<string, boolean>>(FIRST_AID_KEY, {})
  all[rideId] = on
  writeJson(FIRST_AID_KEY, all)
  return on
}

export function getCleatsChecked(rideId: string) {
  return readJson<Record<string, boolean>>(CLEAT_KEY, {})[rideId] === true
}

export function setCleatsChecked(rideId: string, on: boolean) {
  const all = readJson<Record<string, boolean>>(CLEAT_KEY, {})
  all[rideId] = on
  writeJson(CLEAT_KEY, all)
  return on
}

export function getChaiStopEtaTip(routeId: string) {
  const tips: Record<string, { title: string; body: string; eta: string }> = {
    'magadi-loop': {
      title: 'Kona Baridi chai',
      eta: '~1h 40m',
      body: 'Typical Cruiser ETA to the chai stop on Magadi — fill bottles and soft pedal after.',
    },
    'ngong-ridge': {
      title: 'Forest-edge break',
      eta: '~55m',
      body: 'Short ridge loop — quick sip stop near the crest before the drop.',
    },
    'kona-baridi': {
      title: 'Shop wall stop',
      eta: '~1h 10m',
      body: 'Plan the chai break at the shop — count heads before rolling again.',
    },
    'kiserian-classic': {
      title: 'Market soda stop',
      eta: '~45m',
      body: 'Quick soda at the market edge if the pack wants shade.',
    },
    'hells-gate-loop': {
      title: 'Park picnic pull-off',
      eta: '~1h 20m',
      body: 'Mid-loop shade stop — keep snacks wildlife-safe.',
    },
  }
  return (
    tips[routeId] || {
      title: 'Fuel stop window',
      eta: '~1h',
      body: 'Ask the captain for the planned chai / soda stop before roll-out.',
    }
  )
}

export function getShoeCleanTip(distanceKm = 60) {
  if (distanceKm >= 70) {
    return {
      title: 'Knock the cleats clean',
      body: 'Magadi grit jams cleats — tap soles, brush the mechanism, and check bolt torque before next Saturday.',
    }
  }
  return {
    title: 'Wipe the soles',
    body: 'Dust in cleats = noisy clip-in. A quick brush tonight keeps engagement crisp.',
  }
}

const SALT_KEY = 'grc-salt-tabs'
const WHISTLE_KEY = 'grc-whistle-check'

export function getSaltTabsPacked(rideId: string) {
  return readJson<Record<string, boolean>>(SALT_KEY, {})[rideId] === true
}

export function setSaltTabsPacked(rideId: string, on: boolean) {
  const all = readJson<Record<string, boolean>>(SALT_KEY, {})
  all[rideId] = on
  writeJson(SALT_KEY, all)
  return on
}

export function getWhistlePacked(rideId: string) {
  return readJson<Record<string, boolean>>(WHISTLE_KEY, {})[rideId] === true
}

export function setWhistlePacked(rideId: string, on: boolean) {
  const all = readJson<Record<string, boolean>>(WHISTLE_KEY, {})
  all[rideId] = on
  writeJson(WHISTLE_KEY, all)
  return on
}

export function getCattleCrossingTip(routeId: string) {
  const tips: Record<string, { title: string; body: string }> = {
    'magadi-loop': {
      title: 'Livestock on the corridor',
      body: 'Cattle and goats drift across Magadi gravel — soft brake, no sudden horns, give herders space.',
    },
    'ngong-ridge': {
      title: 'Goats on the ridge',
      body: 'Expect flocks near the crest. Soft pedal and call “stock” to the pack behind.',
    },
    'kona-baridi': {
      title: 'Herd traffic',
      body: 'Morning drives near the chai road — yield early, don’t cut between animals.',
    },
    'kiserian-classic': {
      title: 'Village livestock',
      body: 'Dogs and cows near homesteads. Soft pace until you’re clear of the boma.',
    },
    'hells-gate-loop': {
      title: 'Park wildlife first',
      body: 'Buffalo / zebra have right of way. Stop, wait, then roll — never force a gap.',
    },
  }
  return (
    tips[routeId] || {
      title: 'Share the track',
      body: 'Kenyan gravel means livestock. Soft hands, early calls, zero aggression toward animals or herders.',
    }
  )
}

export function getSleepRecoveryTip(distanceKm = 60, feel?: number | null) {
  if (feel === 1 || feel === 2 || distanceKm >= 80) {
    return {
      title: 'Early night tonight',
      body: 'Hard Magadi day — hydrate, eat, lights out early. Skip the late WhatsApp scroll if you can.',
    }
  }
  if (distanceKm >= 50) {
    return {
      title: 'Protect sleep',
      body: 'Corridor rides tax recovery. Aim for 7–8 hours so next Saturday’s legs show up.',
    }
  }
  return {
    title: 'Easy evening',
    body: 'Short loop still counts — stretch, water, normal bedtime. Consistency beats hero weeks.',
  }
}

const BUFF_KEY = 'grc-buff-check'
const SPOKE_KEY = 'grc-spoke-key'

export function getBuffPacked(rideId: string) {
  return readJson<Record<string, boolean>>(BUFF_KEY, {})[rideId] === true
}

export function setBuffPacked(rideId: string, on: boolean) {
  const all = readJson<Record<string, boolean>>(BUFF_KEY, {})
  all[rideId] = on
  writeJson(BUFF_KEY, all)
  return on
}

export function getSpokeKeyPacked(rideId: string) {
  return readJson<Record<string, boolean>>(SPOKE_KEY, {})[rideId] === true
}

export function setSpokeKeyPacked(rideId: string, on: boolean) {
  const all = readJson<Record<string, boolean>>(SPOKE_KEY, {})
  all[rideId] = on
  writeJson(SPOKE_KEY, all)
  return on
}

export function getBlindCornerTip(routeId: string) {
  const tips: Record<string, { title: string; body: string }> = {
    'magadi-loop': {
      title: 'Dust-blind bends',
      body: 'Pack dust can wipe vision on Magadi corners — soft speed, leave a gap, call “slow” early.',
    },
    'ngong-ridge': {
      title: 'Crest blind spots',
      body: 'Don’t overtake over the ridge crest. Wait until you see the full descent line.',
    },
    'kona-baridi': {
      title: 'Shop approach bend',
      body: 'Tight bend into town traffic — single file, eyes up, no hero pass.',
    },
    'kiserian-classic': {
      title: 'Homestead corners',
      body: 'Kids and dogs appear late on village bends. Soft hands until the road opens.',
    },
    'hells-gate-loop': {
      title: 'Park rock blinders',
      body: 'Rock outcrops hide oncoming riders — keep right, call your line.',
    },
  }
  return (
    tips[routeId] || {
      title: 'Blind corner rule',
      body: 'Assume someone is coming. Soft speed, clear calls, never dive the inside on gravel.',
    }
  )
}

export function getFoamRollTip(distanceKm = 60, feel?: number | null) {
  if (feel === 1 || feel === 2 || distanceKm >= 80) {
    return {
      title: 'Roll the legs tonight',
      body: 'Quads + IT band after a hard Magadi — 5 quiet minutes beats tomorrow’s hobble.',
    }
  }
  if (distanceKm >= 50) {
    return {
      title: 'Light foam roll',
      body: 'Calves and hips after the corridor. Keep it gentle — recovery, not punishment.',
    }
  }
  return {
    title: 'Optional roll',
    body: 'Short ride — a quick calf roll is enough if anything feels tight.',
  }
}

const SLEEVES_KEY = 'grc-sun-sleeves'
const CABLE_TIES_KEY = 'grc-cable-ties'

export function getSunSleevesPacked(rideId: string) {
  return readJson<Record<string, boolean>>(SLEEVES_KEY, {})[rideId] === true
}

export function setSunSleevesPacked(rideId: string, on: boolean) {
  const all = readJson<Record<string, boolean>>(SLEEVES_KEY, {})
  all[rideId] = on
  writeJson(SLEEVES_KEY, all)
  return on
}

export function getCableTiesPacked(rideId: string) {
  return readJson<Record<string, boolean>>(CABLE_TIES_KEY, {})[rideId] === true
}

export function setCableTiesPacked(rideId: string, on: boolean) {
  const all = readJson<Record<string, boolean>>(CABLE_TIES_KEY, {})
  all[rideId] = on
  writeJson(CABLE_TIES_KEY, all)
  return on
}

export function getWashoutTip(routeId: string) {
  const tips: Record<string, { title: string; body: string }> = {
    'magadi-loop': {
      title: 'Rain washouts',
      body: 'After storms, Magadi cuts deep channels across the track — soft approach, unweight the front, don’t dive the line.',
    },
    'ngong-ridge': {
      title: 'Ridge ruts',
      body: 'Erosion lines on the crest — pick a high line and call the rut for riders behind.',
    },
    'kona-baridi': {
      title: 'Shoulder washouts',
      body: 'Verge drops near the chai road after rain. Stay on packed gravel when you can.',
    },
    'kiserian-classic': {
      title: 'Gully crossings',
      body: 'Seasonal gullies after showers — slow in, pedals level, eyes through.',
    },
    'hells-gate-loop': {
      title: 'Park drainage cuts',
      body: 'Water bars and washouts in the park — soft speed, one rider at a time on narrow cuts.',
    },
  }
  return (
    tips[routeId] || {
      title: 'Washout awareness',
      body: 'Kenyan gravel changes after rain. Soft speed into dips and never assume yesterday’s line still exists.',
    }
  )
}

export function getProteinTip(distanceKm = 60, feel?: number | null) {
  if (feel === 1 || feel === 2 || distanceKm >= 80) {
    return {
      title: 'Protein within the hour',
      body: 'Hard Magadi day — eggs, milk, or a simple shake with your chai so legs rebuild overnight.',
    }
  }
  if (distanceKm >= 50) {
    return {
      title: 'Real food + protein',
      body: 'Corridor ride done — pair carbs with protein at the next meal, not just soda and mandazi.',
    }
  }
  return {
    title: 'Normal meal is fine',
    body: 'Short loop — eat something balanced when you’re home. No need to overthink it.',
  }
}

const ARM_WARMERS_KEY = 'grc-arm-warmers'
const VALVE_CORES_KEY = 'grc-valve-cores'

export function getArmWarmersPacked(rideId: string) {
  return readJson<Record<string, boolean>>(ARM_WARMERS_KEY, {})[rideId] === true
}

export function setArmWarmersPacked(rideId: string, on: boolean) {
  const all = readJson<Record<string, boolean>>(ARM_WARMERS_KEY, {})
  all[rideId] = on
  writeJson(ARM_WARMERS_KEY, all)
  return on
}

export function getValveCoresPacked(rideId: string) {
  return readJson<Record<string, boolean>>(VALVE_CORES_KEY, {})[rideId] === true
}

export function setValveCoresPacked(rideId: string, on: boolean) {
  const all = readJson<Record<string, boolean>>(VALVE_CORES_KEY, {})
  all[rideId] = on
  writeJson(VALVE_CORES_KEY, all)
  return on
}

export function getSoftSandTip(routeId: string) {
  const tips: Record<string, { title: string; body: string }> = {
    'magadi-loop': {
      title: 'Soft sand patches',
      body: 'Stay light on the front through Magadi sand ribbons — higher cadence, don’t stab the brakes mid-patch.',
    },
    'ngong-ridge': {
      title: 'Dusty soft shoulders',
      body: 'Ridge edges get powdery — keep the packed line and call soft spots early.',
    },
    'kona-baridi': {
      title: 'Verge sand',
      body: 'Soft sand near the chai approach after dry weeks. Soft pedal, wide vision.',
    },
    'kiserian-classic': {
      title: 'Loose farm tracks',
      body: 'Sandy farm connectors after harvest — sit back a touch and keep pedaling through.',
    },
    'hells-gate-loop': {
      title: 'Park sand traps',
      body: 'Sandy park sections reward momentum. Soft hands, look through, no panic weave.',
    },
  }
  return (
    tips[routeId] || {
      title: 'Soft sand rule',
      body: 'Momentum over panic. Soft hands, higher cadence, and don’t stab the front brake in powder.',
    }
  )
}

export function getElectrolyteFollowUpTip(distanceKm = 60, feel?: number | null) {
  if (feel === 1 || feel === 2 || distanceKm >= 80) {
    return {
      title: 'Salt + water tonight',
      body: 'Hard Magadi sweat day — keep sipping with a salty snack so tomorrow doesn’t start crampy.',
    }
  }
  if (distanceKm >= 50) {
    return {
      title: 'Rehydrate properly',
      body: 'Corridor ride done — water plus something salty with dinner beats plain soda alone.',
    }
  }
  return {
    title: 'Normal fluids',
    body: 'Short loop — finish your bottle at home and you’re fine.',
  }
}

const LEG_WARMERS_KEY = 'grc-leg-warmers'
const PATCH_KIT_KEY = 'grc-patch-kit'

export function getLegWarmersPacked(rideId: string) {
  return readJson<Record<string, boolean>>(LEG_WARMERS_KEY, {})[rideId] === true
}

export function setLegWarmersPacked(rideId: string, on: boolean) {
  const all = readJson<Record<string, boolean>>(LEG_WARMERS_KEY, {})
  all[rideId] = on
  writeJson(LEG_WARMERS_KEY, all)
  return on
}

export function getPatchKitPacked(rideId: string) {
  return readJson<Record<string, boolean>>(PATCH_KIT_KEY, {})[rideId] === true
}

export function setPatchKitPacked(rideId: string, on: boolean) {
  const all = readJson<Record<string, boolean>>(PATCH_KIT_KEY, {})
  all[rideId] = on
  writeJson(PATCH_KIT_KEY, all)
  return on
}

export function getCattleGridTip(routeId: string) {
  const tips: Record<string, { title: string; body: string }> = {
    'magadi-loop': {
      title: 'Grid crossings',
      body: 'Cattle grids on Magadi access roads — soft speed, straight line, no sudden lean on wet metal.',
    },
    'ngong-ridge': {
      title: 'Farm grid caution',
      body: 'Metal grids near forest edges get slick at dawn. Unweight slightly and roll square.',
    },
    'kona-baridi': {
      title: 'Shop-road grids',
      body: 'Expect grids near farm gates before chai — call them early for the pack.',
    },
    'kiserian-classic': {
      title: 'Homestead grids',
      body: 'Village grids after rain are polished. Soft pedal, eyes up, one at a time.',
    },
    'hells-gate-loop': {
      title: 'Park access grids',
      body: 'Entry grids can catch narrow tires — choose the cleanest bars and keep momentum gentle.',
    },
  }
  return (
    tips[routeId] || {
      title: 'Cattle grid rule',
      body: 'Straight, soft, and square. Never brake hard mid-grid — especially when wet.',
    }
  )
}

export function getCoolDownWalkTip(distanceKm = 60, feel?: number | null) {
  if (feel === 1 || feel === 2 || distanceKm >= 80) {
    return {
      title: 'Walk before you drive',
      body: 'Hard Magadi day — 5 minutes on foot at the gate loosens calves before the Ngong Road sit.',
    }
  }
  if (distanceKm >= 50) {
    return {
      title: 'Short cool-down walk',
      body: 'Unclip, walk the lot once, then pack the bike. Legs thank you on the drive home.',
    }
  }
  return {
    title: 'Easy unclip',
    body: 'Short loop — still stand and walk a minute before hopping in the car.',
  }
}
