export type MembershipTier = 'founding' | 'elite' | 'member' | 'youth' | 'social'
export type UserRole = 'member' | 'elite_rider' | 'mechanic' | 'admin' | 'super_admin'
export type RideType = 'gravel' | 'road' | 'mtb' | 'social' | 'youth' | 'training' | 'criterium'
export type RideStatus = 'draft' | 'published' | 'cancelled' | 'completed'
export type RegistrationStatus = 'registered' | 'waitlisted' | 'cancelled' | 'attended' | 'no_show'
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'waived'
export type BookingStatus = 'pending' | 'accepted' | 'mechanic_en_route' | 'in_progress' | 'completed' | 'cancelled'
export type RaceStatus = 'draft' | 'upcoming' | 'registration_open' | 'registration_closed' | 'live' | 'completed' | 'cancelled'

export interface Profile {
  id: string
  created_at: string
  updated_at: string
  full_name: string
  username?: string
  phone?: string
  avatar_url?: string
  bio?: string
  membership_number: string
  membership_tier: MembershipTier
  membership_status: 'active' | 'inactive' | 'suspended'
  joined_at: string
  role: UserRole
  is_elite_team: boolean
  total_rides: number
  total_km: number
  total_races: number
  preferred_ride_types: RideType[]
  emergency_contact_name?: string
  emergency_contact_phone?: string
  home_location_lat?: number
  home_location_lng?: number
  home_location_name?: string
}

export interface Ride {
  id: string
  created_at: string
  created_by?: string
  title: string
  description?: string
  ride_type: RideType
  difficulty?: 'easy' | 'moderate' | 'hard' | 'elite'
  ride_date: string
  start_time: string
  estimated_end_time?: string
  start_location_name: string
  start_location_lat?: number
  start_location_lng?: number
  start_location_address?: string
  clubhouse?: 'tena' | 'utawala' | 'external'
  distance_km?: number
  avg_speed_kph?: number
  elevation_gain_m?: number
  route_gpx_url?: string
  route_map_url?: string
  strava_route_id?: string
  max_participants?: number
  min_participants: number
  status: RideStatus
  cancellation_reason?: string
  cover_image_url?: string
  tags: string[]
  // joined
  registration_count?: number
  user_registration?: RideRegistration | null
}

export interface RideRegistration {
  id: string
  created_at: string
  ride_id: string
  user_id: string
  status: RegistrationStatus
  registered_at: string
  cancelled_at?: string
  emergency_note?: string
}

export interface RaceEvent {
  id: string
  created_at: string
  series_name: string
  edition_number: number
  title: string
  race_date: string
  registration_opens_at?: string
  registration_closes_at?: string
  start_time?: string
  venue_name: string
  venue_lat?: number
  venue_lng?: number
  venue_address?: string
  categories: RaceCategory[]
  status: RaceStatus
  description?: string
  cover_image_url?: string
  course_map_url?: string
  results_published: boolean
}

export interface RaceCategory {
  id: string
  name: string
  description: string
  max_slots: number
  fee_kes: number
}

export interface RaceRegistration {
  id: string
  created_at: string
  race_event_id: string
  user_id: string
  category_id: string
  race_number?: number
  fee_kes?: number
  payment_status: PaymentStatus
  mpesa_transaction_id?: string
  paid_at?: string
  status: 'registered' | 'confirmed' | 'cancelled' | 'dns' | 'dnf'
  finish_position?: number
  finish_time?: string
  finish_time_seconds?: number
  dnf_reason?: string
  // joined
  profiles?: Profile
}

export interface RepairBooking {
  id: string
  created_at: string
  customer_id: string
  mechanic_id?: string
  service_type: string
  description?: string
  estimated_duration_hours?: number
  service_location_name?: string
  service_location_lat?: number
  service_location_lng?: number
  service_location_notes?: string
  requested_date?: string
  requested_time_slot?: string
  confirmed_datetime?: string
  completed_at?: string
  quoted_price_kes?: number
  final_price_kes?: number
  payment_status: PaymentStatus
  mpesa_transaction_id?: string
  status: BookingStatus
  customer_rating?: number
  customer_review?: string
  bike_brand?: string
  bike_type?: string
  // joined
  profiles?: Profile
  mechanics?: { profiles: Profile }
}

export interface BadgeDefinition {
  id: string
  name: string
  description?: string
  icon_emoji?: string
  category: 'rides' | 'racing' | 'community' | 'special'
  criteria?: Record<string, unknown>
  is_active: boolean
}

export interface MemberBadge {
  id: string
  awarded_at: string
  user_id: string
  badge_id: string
  awarded_by?: string
  award_reason?: string
  badge_definitions?: BadgeDefinition
}

export interface Post {
  id: string
  created_at: string
  updated_at: string
  author_id: string
  content: string
  post_type: 'general' | 'ride_recap' | 'race_result' | 'announcement' | 'question'
  linked_ride_id?: string
  linked_race_id?: string
  image_urls: string[]
  like_count: number
  comment_count: number
  is_pinned: boolean
  status: 'published' | 'hidden' | 'deleted'
  // joined
  profiles?: Profile
  user_liked?: boolean
}

export interface Notification {
  id: string
  created_at: string
  user_id: string
  title: string
  body?: string
  type: 'ride_reminder' | 'race_open' | 'booking_update' | 'new_post' | 'badge_earned' | 'general'
  action_url?: string
  is_read: boolean
  read_at?: string
}
