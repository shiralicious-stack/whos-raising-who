-- Coaching appointment slots (50-min sessions, open to anyone)
create table if not exists public.coaching_slots (
  id uuid primary key default gen_random_uuid(),
  scheduled_at timestamptz not null,
  duration_minutes integer not null default 50,
  is_booked boolean not null default false,
  created_at timestamptz not null default now()
);

-- Coaching bookings
create table if not exists public.coaching_bookings (
  id uuid primary key default gen_random_uuid(),
  slot_id uuid not null references public.coaching_slots(id) on delete cascade,
  name text not null,
  email text not null,
  notes text,
  created_at timestamptz not null default now()
);

-- RLS
alter table public.coaching_slots enable row level security;
alter table public.coaching_bookings enable row level security;

-- Public can read available (unbooked future) slots
create policy "Public can view available coaching slots"
  on public.coaching_slots for select
  using (is_booked = false and scheduled_at > now());

-- Service role manages everything (used by API routes via admin client)
-- No additional policies needed — admin client bypasses RLS
