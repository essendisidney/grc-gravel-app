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
