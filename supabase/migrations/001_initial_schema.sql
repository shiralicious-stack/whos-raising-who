-- ============================================================
-- Who's Raising Who — Initial Schema
-- Run this in Supabase SQL Editor after creating your project
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- PROFILES
-- ============================================================
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  avatar_url text,
  role text not null default 'member' check (role in ('member', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- MEMBERSHIP TIERS
-- ============================================================
create table public.membership_tiers (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  price_monthly numeric(10,2) not null,
  price_annual numeric(10,2) not null,
  stripe_price_id_monthly text,
  stripe_price_id_annual text,
  features jsonb not null default '[]'::jsonb,
  tier_level integer not null check (tier_level in (1, 2, 3)),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Seed default tiers
insert into public.membership_tiers (name, description, price_monthly, price_annual, tier_level, features) values
(
  'Community',
  'Join the community and access foundational content.',
  19.00,
  190.00,
  1,
  '["Access to community forum","Monthly group Q&A webinar","Foundational course library"]'::jsonb
),
(
  'Growth',
  'Deepen your practice with full course access and live group calls.',
  49.00,
  490.00,
  2,
  '["Everything in Community","Full course library access","Weekly live group coaching calls","Event recordings archive"]'::jsonb
),
(
  'VIP',
  'Total transformation with 1:1 coaching and priority access.',
  149.00,
  1490.00,
  3,
  '["Everything in Growth","Monthly 1:1 coaching session with Shira","Priority booking","Private Slack channel access","Early access to new courses"]'::jsonb
);

-- ============================================================
-- SUBSCRIPTIONS
-- ============================================================
create table public.subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  tier_id uuid references public.membership_tiers(id) not null,
  stripe_subscription_id text unique,
  stripe_customer_id text,
  status text not null default 'active' check (status in ('active','past_due','canceled','trialing','incomplete')),
  interval text not null default 'monthly' check (interval in ('monthly','annual')),
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_subscriptions_user_id on public.subscriptions(user_id);
create index idx_subscriptions_stripe_id on public.subscriptions(stripe_subscription_id);

-- ============================================================
-- COURSES
-- ============================================================
create table public.courses (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  title text not null,
  description text,
  thumbnail_url text,
  price numeric(10,2),              -- null = included in tier
  min_tier_level integer default 1 check (min_tier_level in (1, 2, 3)),
  published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_courses_slug on public.courses(slug);
create index idx_courses_published on public.courses(published);

-- ============================================================
-- MODULES
-- ============================================================
create table public.modules (
  id uuid primary key default uuid_generate_v4(),
  course_id uuid references public.courses(id) on delete cascade not null,
  title text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index idx_modules_course_id on public.modules(course_id);

-- ============================================================
-- LESSONS
-- ============================================================
create table public.lessons (
  id uuid primary key default uuid_generate_v4(),
  module_id uuid references public.modules(id) on delete cascade not null,
  title text not null,
  mux_asset_id text,
  mux_playback_id text,
  duration_seconds integer,
  sort_order integer not null default 0,
  is_preview boolean not null default false,
  created_at timestamptz not null default now()
);

create index idx_lessons_module_id on public.lessons(module_id);

-- ============================================================
-- LESSON PROGRESS
-- ============================================================
create table public.lesson_progress (
  user_id uuid references public.profiles(id) on delete cascade not null,
  lesson_id uuid references public.lessons(id) on delete cascade not null,
  completed_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

-- ============================================================
-- COURSE PURCHASES (a-la-carte)
-- ============================================================
create table public.course_purchases (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  course_id uuid references public.courses(id) on delete cascade not null,
  stripe_payment_intent_id text unique,
  amount_paid numeric(10,2),
  created_at timestamptz not null default now(),
  unique(user_id, course_id)
);

-- ============================================================
-- EVENTS
-- ============================================================
create table public.events (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  type text not null check (type in ('webinar','group_call','one_on_one','recurring')),
  daily_room_name text unique,
  daily_room_url text,
  scheduled_at timestamptz not null,
  duration_minutes integer not null default 60,
  min_tier_level integer not null default 1 check (min_tier_level in (1, 2, 3)),
  max_participants integer,
  is_recurring boolean not null default false,
  recurrence_rule text,               -- iCal RRULE string
  recording_url text,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create index idx_events_scheduled_at on public.events(scheduled_at);

-- ============================================================
-- EVENT REGISTRATIONS
-- ============================================================
create table public.event_registrations (
  event_id uuid references public.events(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  registered_at timestamptz not null default now(),
  primary key (event_id, user_id)
);

-- ============================================================
-- BOOKINGS (1:1 sessions)
-- ============================================================
create table public.bookings (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  scheduled_at timestamptz not null,
  duration_minutes integer not null default 50,
  daily_room_name text unique,
  daily_room_url text,
  notes text,
  status text not null default 'pending' check (status in ('pending','confirmed','cancelled','completed')),
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_bookings_user_id on public.bookings(user_id);
create index idx_bookings_scheduled_at on public.bookings(scheduled_at);
create index idx_bookings_status on public.bookings(status);

-- ============================================================
-- UPDATED_AT triggers
-- ============================================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at before update on public.profiles
  for each row execute procedure public.set_updated_at();
create trigger subscriptions_updated_at before update on public.subscriptions
  for each row execute procedure public.set_updated_at();
create trigger courses_updated_at before update on public.courses
  for each row execute procedure public.set_updated_at();
create trigger bookings_updated_at before update on public.bookings
  for each row execute procedure public.set_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Helper: is the current user an admin?
create or replace function public.is_admin()
returns boolean language sql security definer as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- Helper: get user's active tier level (0 if no subscription)
create or replace function public.user_tier_level()
returns integer language sql security definer as $$
  select coalesce(
    (select mt.tier_level
     from public.subscriptions s
     join public.membership_tiers mt on mt.id = s.tier_id
     where s.user_id = auth.uid()
       and s.status in ('active','trialing')
     order by mt.tier_level desc
     limit 1),
    0
  );
$$;

-- -------- profiles --------
alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select using (auth.uid() = id);

create policy "Admins can view all profiles"
  on public.profiles for select using (public.is_admin());

create policy "Users can update their own profile"
  on public.profiles for update using (auth.uid() = id);

create policy "Admins can update any profile"
  on public.profiles for update using (public.is_admin());

-- -------- membership_tiers --------
alter table public.membership_tiers enable row level security;

create policy "Anyone can view active tiers"
  on public.membership_tiers for select using (is_active = true);

create policy "Admins can manage tiers"
  on public.membership_tiers for all using (public.is_admin());

-- -------- subscriptions --------
alter table public.subscriptions enable row level security;

create policy "Users can view their own subscription"
  on public.subscriptions for select using (auth.uid() = user_id);

create policy "Admins can view all subscriptions"
  on public.subscriptions for select using (public.is_admin());

create policy "Service role can manage subscriptions"
  on public.subscriptions for all using (true);

-- -------- courses --------
alter table public.courses enable row level security;

create policy "Published courses are publicly visible"
  on public.courses for select using (published = true);

create policy "Admins can manage courses"
  on public.courses for all using (public.is_admin());

-- -------- modules --------
alter table public.modules enable row level security;

create policy "Members can view modules of accessible courses"
  on public.modules for select using (
    exists (
      select 1 from public.courses c
      where c.id = course_id and c.published = true
    )
  );

create policy "Admins can manage modules"
  on public.modules for all using (public.is_admin());

-- -------- lessons --------
alter table public.lessons enable row level security;

create policy "Members can view lessons of accessible courses"
  on public.lessons for select using (
    exists (
      select 1 from public.modules m
      join public.courses c on c.id = m.course_id
      where m.id = module_id and c.published = true
    )
  );

create policy "Admins can manage lessons"
  on public.lessons for all using (public.is_admin());

-- -------- lesson_progress --------
alter table public.lesson_progress enable row level security;

create policy "Users can manage their own progress"
  on public.lesson_progress for all using (auth.uid() = user_id);

create policy "Admins can view all progress"
  on public.lesson_progress for select using (public.is_admin());

-- -------- course_purchases --------
alter table public.course_purchases enable row level security;

create policy "Users can view their own purchases"
  on public.course_purchases for select using (auth.uid() = user_id);

create policy "Admins can view all purchases"
  on public.course_purchases for select using (public.is_admin());

create policy "Service role can insert purchases"
  on public.course_purchases for insert with check (true);

-- -------- events --------
alter table public.events enable row level security;

create policy "Published events visible to all authenticated users"
  on public.events for select using (auth.uid() is not null and published = true);

create policy "Admins can manage events"
  on public.events for all using (public.is_admin());

-- -------- event_registrations --------
alter table public.event_registrations enable row level security;

create policy "Users can view their own registrations"
  on public.event_registrations for select using (auth.uid() = user_id);

create policy "Users can register for events"
  on public.event_registrations for insert with check (auth.uid() = user_id);

create policy "Users can cancel their registration"
  on public.event_registrations for delete using (auth.uid() = user_id);

create policy "Admins can manage all registrations"
  on public.event_registrations for all using (public.is_admin());

-- -------- bookings --------
alter table public.bookings enable row level security;

create policy "Users can view their own bookings"
  on public.bookings for select using (auth.uid() = user_id);

create policy "Users can create bookings"
  on public.bookings for insert with check (auth.uid() = user_id);

create policy "Users can cancel their bookings"
  on public.bookings for update using (auth.uid() = user_id);

create policy "Admins can manage all bookings"
  on public.bookings for all using (public.is_admin());
