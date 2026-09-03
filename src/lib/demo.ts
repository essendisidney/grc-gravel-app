import type { Ride } from '@/lib/types/database'

function dayOffset(days: number) {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().split('T')[0]
}

const RIDER_STACK = [
  { initials: 'VD', color: '#E07A2F' },
  { initials: 'AO', color: '#2A6F97' },
  { initials: 'MK', color: '#2F7D4B' },
  { initials: 'JN', color: '#6B4C9A' },
  { initials: 'SK', color: '#B33A3A' },
]

export type RouteIntel = {
  gravel_pct: number
  tarmac_pct: number
  roughness: number
  best_months: string
  water_points: number
  signal: 'Good' | 'Patchy' | 'Poor'
  road_condition: 'Good' | 'Fair' | 'Rough'
  est_hours?: string
}

export type DemoRide = Ride & RouteIntel & {
  avg_speed_kph?: number
  going?: { initials: string; color: string }[]
  interested_count?: number
  route_label?: string
  cover_image?: string
  pace_groups?: { id: string; name: string; avg_kph: number; count: number }[]
}

export const DEMO_WEEK_STATS = {
  km: 127,
  kmDelta: 18,
  climbed_m: 2430,
  climbedDelta: 24,
  rides: 3,
  rank_nairobi: 18,
}

export const DEMO_CLUB = {
  name: 'Gravel Riders Club',
  short: 'GRC',
  tagline: 'Ride. Connect. Compete. Belong.',
  members: 400,
  elite_rank: 3,
  bikes_repaired: 13000,
  clubhouses: [
    { id: 'tena', name: 'The Gravel — Tena', address: 'Off Manyanja Road, Tena Estate, Nairobi' },
    { id: 'utawala', name: 'The Gravel — Utawala', address: 'Kibiku Road, Utawala Estate, Nairobi' },
  ],
  contact: {
    email: 'ridewithus@gravelriders.club',
    phones: ['+254 780 222216', '+254 777 222216'],
    web: 'https://gravelriders.club',
  },
  membership: [
    { name: 'Regular', price_kes: 1200, period: 'year' },
    { name: 'Junior', price_kes: 600, period: 'year' },
    { name: 'Gold', price_kes: 5000, period: 'year' },
    { name: 'Family', price_kes: 5000, period: 'year' },
  ],
}

export const DEMO_RIDES: DemoRide[] = [
  {
    id: 'ngong-magadi',
    created_at: new Date().toISOString(),
    title: 'Ngong → Magadi',
    route_label: 'NGONG → MAGADI',
    description:
      'Out of the city into open Rift Country. Dust, climb, and long sightlines. Multiple pace groups from Tena roll-out. Tubes, snacks, charged phone.',
    ride_type: 'gravel',
    difficulty: 'hard',
    ride_date: dayOffset(1),
    start_time: '06:15:00',
    estimated_end_time: '11:00:00',
    start_location_name: 'Ngong Town',
    start_location_address: 'Roll toward Magadi Road',
    clubhouse: 'tena',
    distance_km: 86,
    elevation_gain_m: 1240,
    max_participants: 40,
    min_participants: 8,
    status: 'published',
    tags: ['adventure', 'gravel'],
    registration_count: 32,
    interested_count: 8,
    user_registration: null,
    avg_speed_kph: 22,
    going: RIDER_STACK,
    cover_image: '/brand/hero-adventure.jpg',
    gravel_pct: 82,
    tarmac_pct: 18,
    roughness: 4.2,
    best_months: 'Jun–Oct',
    water_points: 3,
    signal: 'Patchy',
    road_condition: 'Good',
    est_hours: '3h 56m',
    pace_groups: [
      { id: 'fast', name: 'Fast', avg_kph: 27, count: 9 },
      { id: 'cruiser', name: 'Cruiser', avg_kph: 21, count: 15 },
      { id: 'social', name: 'Social', avg_kph: 17, count: 8 },
    ],
  },
  {
    id: 'kiserian-loop',
    created_at: new Date().toISOString(),
    title: 'Kiserian Loop',
    route_label: 'KISERIAN LOOP',
    description: 'Club Saturday loop. Mixed surface, regroup points, ride captains on every pace group.',
    ride_type: 'gravel',
    difficulty: 'moderate',
    ride_date: dayOffset(2),
    start_time: '06:30:00',
    start_location_name: 'The Gravel — Tena',
    clubhouse: 'tena',
    distance_km: 54,
    elevation_gain_m: 620,
    max_participants: 45,
    min_participants: 6,
    status: 'published',
    tags: ['club'],
    registration_count: 21,
    interested_count: 5,
    user_registration: { status: 'registered' } as any,
    avg_speed_kph: 23,
    going: RIDER_STACK.slice(0, 4),
    cover_image: '/brand/ride-gravel.jpg',
    gravel_pct: 65,
    tarmac_pct: 35,
    roughness: 3.1,
    best_months: 'Year-round',
    water_points: 4,
    signal: 'Good',
    road_condition: 'Good',
    pace_groups: [
      { id: 'fast', name: 'Fast', avg_kph: 26, count: 6 },
      { id: 'cruiser', name: 'Cruiser', avg_kph: 21, count: 10 },
      { id: 'social', name: 'Social', avg_kph: 17, count: 5 },
    ],
  },
  {
    id: 'hells-gate',
    created_at: new Date().toISOString(),
    title: "Hell's Gate",
    route_label: "HELL'S GATE",
    description: 'Naivasha corridor adventure. Wind, cliffs, and long gravel. Early start mandatory.',
    ride_type: 'gravel',
    difficulty: 'hard',
    ride_date: dayOffset(5),
    start_time: '05:45:00',
    start_location_name: 'Naivasha Gate',
    clubhouse: 'external',
    distance_km: 72,
    elevation_gain_m: 890,
    max_participants: 25,
    min_participants: 6,
    status: 'published',
    tags: ['adventure'],
    registration_count: 14,
    interested_count: 11,
    user_registration: null,
    avg_speed_kph: 21,
    going: RIDER_STACK.slice(0, 3),
    cover_image: '/brand/community.jpg',
    gravel_pct: 88,
    tarmac_pct: 12,
    roughness: 4.6,
    best_months: 'Jun–Sep',
    water_points: 2,
    signal: 'Patchy',
    road_condition: 'Fair',
  },
  {
    id: 'full-gas-warmup',
    created_at: new Date().toISOString(),
    title: 'Full Gas — Openers',
    route_label: 'FULL GAS OPENERS',
    description: 'Pre-crit openers at Utawala. Short, sharp, honest. Check the bike before race weekend.',
    ride_type: 'criterium',
    difficulty: 'elite',
    ride_date: dayOffset(8),
    start_time: '16:30:00',
    start_location_name: 'The Gravel — Utawala',
    clubhouse: 'utawala',
    distance_km: 32,
    elevation_gain_m: 210,
    max_participants: 30,
    min_participants: 6,
    status: 'published',
    tags: ['race'],
    registration_count: 19,
    user_registration: null,
    avg_speed_kph: 32,
    going: RIDER_STACK.slice(1),
    cover_image: '/brand/hero-adventure.jpg',
    gravel_pct: 5,
    tarmac_pct: 95,
    roughness: 1.2,
    best_months: 'Year-round',
    water_points: 1,
    signal: 'Good',
    road_condition: 'Good',
  },
]

export type DiscoverRoute = {
  id: string
  name: string
  region_id: string
  distance_km: number
  elevation_m: number
  image?: string
} & RouteIntel

export type DiscoverRegion = {
  id: string
  name: string
  route_count: number
  blurb: string
}

export const DEMO_REGIONS: DiscoverRegion[] = [
  { id: 'ngong', name: 'Ngong', route_count: 42, blurb: 'Climbs, ridges, and Magadi Road exits.' },
  { id: 'kiserian', name: 'Kiserian', route_count: 17, blurb: 'Club loops and mixed-surface rollers.' },
  { id: 'magadi', name: 'Magadi', route_count: 31, blurb: 'Long gravel, dust, and open Rift lines.' },
  { id: 'naivasha', name: 'Naivasha', route_count: 64, blurb: 'Hell’s Gate, lakeshore, and wind.' },
]

export const DEMO_ROUTES: DiscoverRoute[] = [
  {
    id: 'magadi-loop',
    region_id: 'magadi',
    name: 'Magadi Loop',
    distance_km: 94.2,
    elevation_m: 1340,
    gravel_pct: 78,
    tarmac_pct: 22,
    roughness: 4.2,
    best_months: 'Jun–Oct',
    water_points: 3,
    signal: 'Patchy',
    road_condition: 'Good',
    est_hours: '4h 20m',
    image: '/brand/hero-adventure.jpg',
  },
  {
    id: 'ngong-ridge',
    region_id: 'ngong',
    name: 'Ngong Ridge Out-and-Back',
    distance_km: 48.5,
    elevation_m: 980,
    gravel_pct: 55,
    tarmac_pct: 45,
    roughness: 3.4,
    best_months: 'Year-round',
    water_points: 2,
    signal: 'Good',
    road_condition: 'Good',
    est_hours: '2h 40m',
    image: '/brand/ride-gravel.jpg',
  },
  {
    id: 'kona-baridi',
    region_id: 'ngong',
    name: 'Kona Baridi Connector',
    distance_km: 61,
    elevation_m: 1105,
    gravel_pct: 70,
    tarmac_pct: 30,
    roughness: 3.8,
    best_months: 'May–Nov',
    water_points: 2,
    signal: 'Patchy',
    road_condition: 'Fair',
    est_hours: '3h 10m',
    image: '/brand/clubhouse.jpg',
  },
  {
    id: 'kiserian-classic',
    region_id: 'kiserian',
    name: 'Kiserian Classic',
    distance_km: 42,
    elevation_m: 510,
    gravel_pct: 60,
    tarmac_pct: 40,
    roughness: 2.9,
    best_months: 'Year-round',
    water_points: 4,
    signal: 'Good',
    road_condition: 'Good',
    est_hours: '2h 05m',
    image: '/brand/community.jpg',
  },
  {
    id: 'hells-gate-loop',
    region_id: 'naivasha',
    name: "Hell's Gate Loop",
    distance_km: 68,
    elevation_m: 720,
    gravel_pct: 85,
    tarmac_pct: 15,
    roughness: 4.5,
    best_months: 'Jun–Sep',
    water_points: 2,
    signal: 'Poor',
    road_condition: 'Rough',
    est_hours: '3h 35m',
    image: '/brand/ride-gravel.jpg',
  },
]

export const DEMO_PROFILE = {
  id: 'demo-user',
  full_name: 'Amina Otieno',
  membership_number: 'GRC-0412',
  membership_tier: 'elite',
  membership_status: 'active',
  role: 'member',
  is_elite_team: true,
  total_rides: 47,
  total_km: 1840,
  total_races: 6,
  home_location_name: 'Tena, Nairobi',
  title: 'Rift Valley Rider',
}

export const DEMO_BADGES = [
  { id: 'ngong', name: 'Ngong Climber', earned: true },
  { id: 'magadi', name: 'Magadi Veteran', earned: true },
  { id: 'hells', name: "Hell's Gate Survivor", earned: false },
  { id: 'rift', name: 'Rift Runner', earned: true },
]

export const DEMO_POSTS = [
  {
    id: 'p1',
    content:
      'Saturday is Ngong → Magadi. Three pace groups. Lights on. If you’re late past 06:20, we won’t wait — the calendar is the start line now.',
    post_type: 'announcement',
    is_pinned: true,
    like_count: 42,
    comment_count: 11,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    user_liked: false,
    profiles: {
      full_name: 'Victor Dawa',
      membership_tier: 'founding',
      role: 'super_admin',
      is_elite_team: true,
    },
  },
  {
    id: 'p2',
    content:
      'Doorstep wrench bookings this week: book early if Magadi is on your calendar. 12,000+ bikes fixed citywide — keep yours ready.',
    post_type: 'general',
    is_pinned: false,
    like_count: 28,
    comment_count: 6,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    user_liked: true,
    profiles: {
      full_name: 'Amina Otieno',
      membership_tier: 'elite',
      role: 'member',
      is_elite_team: true,
    },
  },
]

export const DEMO_RACES = [
  {
    id: 'full-gas-1',
    title: 'Full Gas Criterium — Round 4',
    series_name: 'Full Gas',
    edition_number: 4,
    race_date: dayOffset(9),
    start_time: '07:00:00',
    venue_name: 'Kasarani Stadium',
    status: 'registration_open',
    results_published: false,
    categories: [
      { id: 'cat_a', name: 'Cat A', fee_kes: 1500, max_slots: 40, description: 'Elite / open men' },
      { id: 'cat_b', name: 'Cat B', fee_kes: 1000, max_slots: 50, description: 'Club racers' },
      { id: 'women', name: 'Women', fee_kes: 800, max_slots: 30, description: 'Women open' },
      { id: 'junior', name: 'Junior', fee_kes: 500, max_slots: 40, description: 'Under 17' },
    ],
  },
]

export const DEMO_MEMBERS = [
  { id: '1', full_name: 'Victor Dawa', membership_number: 'GRC-0001', membership_tier: 'founding', phone: '0780 222 216', role: 'super_admin', is_elite_team: true },
  { id: '2', full_name: 'Amina Otieno', membership_number: 'GRC-0412', membership_tier: 'elite', phone: '0712 000 412', role: 'member', is_elite_team: true },
  { id: '3', full_name: 'James Njoroge', membership_number: 'GRC-0088', membership_tier: 'member', phone: '0722 000 088', role: 'member', is_elite_team: false },
]

export const DEMO_NOTIFICATIONS = [
  { id: 'n1', type: 'ride_reminder', title: 'Ngong → Magadi', body: 'Roll-out 06:15. 32 going. Pick your pace group.', is_read: false, created_at: new Date(Date.now() - 1000 * 60 * 40).toISOString(), link: '/rides/ngong-magadi' },
  { id: 'n2', type: 'race_open', title: 'Full Gas at Kasarani', body: 'Round 4 registration open. Juniors, women, elite.', is_read: false, created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), link: '/race/full-gas-1' },
  { id: 'n3', type: 'general', title: 'Discover Magadi', body: 'New route intel: Magadi Loop — gravel 78%, signal patchy.', is_read: true, created_at: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(), link: '/discover/magadi' },
]

export const DEMO_NOTICE = {
  title: 'Ngong → Magadi this Saturday',
  body: '06:15 roll-out. Fast / Cruiser / Social groups. Lights on.',
}
