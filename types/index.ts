export type UserRole = 'member' | 'admin'

export interface Profile {
  id: string
  full_name: string | null
  avatar_url: string | null
  role: UserRole
  created_at: string
  updated_at: string
}

export interface MembershipTier {
  id: string
  name: string
  description: string | null
  price_monthly: number
  price_annual: number
  stripe_price_id_monthly: string | null
  stripe_price_id_annual: string | null
  features: string[]
  tier_level: 1 | 2 | 3
  is_active: boolean
  created_at: string
}

export interface Subscription {
  id: string
  user_id: string
  tier_id: string
  stripe_subscription_id: string | null
  stripe_customer_id: string | null
  status: 'active' | 'past_due' | 'canceled' | 'trialing' | 'incomplete'
  interval: 'monthly' | 'annual'
  current_period_start: string | null
  current_period_end: string | null
  cancel_at_period_end: boolean
  created_at: string
  updated_at: string
  membership_tiers?: MembershipTier
}

export interface Course {
  id: string
  slug: string
  title: string
  description: string | null
  thumbnail_url: string | null
  price: number | null
  min_tier_level: 1 | 2 | 3
  published: boolean
  sort_order: number
  created_at: string
  updated_at: string
  modules?: Module[]
}

export interface Module {
  id: string
  course_id: string
  title: string
  sort_order: number
  created_at: string
  lessons?: Lesson[]
}

export interface Lesson {
  id: string
  module_id: string
  title: string
  mux_asset_id: string | null
  mux_playback_id: string | null
  duration_seconds: number | null
  sort_order: number
  is_preview: boolean
  created_at: string
}

export interface LessonProgress {
  user_id: string
  lesson_id: string
  completed_at: string
}

export interface CoursePurchase {
  id: string
  user_id: string
  course_id: string
  stripe_payment_intent_id: string | null
  amount_paid: number | null
  created_at: string
}

export type EventType = 'webinar' | 'group_call' | 'one_on_one' | 'recurring'

export interface Event {
  id: string
  title: string
  description: string | null
  type: EventType
  daily_room_name: string | null
  daily_room_url: string | null
  scheduled_at: string
  duration_minutes: number
  min_tier_level: 1 | 2 | 3
  max_participants: number | null
  is_recurring: boolean
  recurrence_rule: string | null
  recording_url: string | null
  published: boolean
  created_at: string
}

export interface EventRegistration {
  event_id: string
  user_id: string
  registered_at: string
}

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed'

export interface Booking {
  id: string
  user_id: string
  scheduled_at: string
  duration_minutes: number
  daily_room_name: string | null
  daily_room_url: string | null
  recording_url: string | null
  notes: string | null
  status: BookingStatus
  admin_notes: string | null
  created_at: string
  updated_at: string
  profiles?: Profile
}
