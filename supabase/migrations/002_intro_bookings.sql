-- ============================================================
-- Intro call availability & bookings
-- ============================================================

CREATE TABLE intro_slots (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scheduled_at     TIMESTAMPTZ NOT NULL,
  duration_minutes INT NOT NULL DEFAULT 30,
  is_booked        BOOLEAN NOT NULL DEFAULT FALSE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE intro_bookings (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_id    UUID NOT NULL REFERENCES intro_slots(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  notes      TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_intro_slots_scheduled_at ON intro_slots(scheduled_at);
CREATE INDEX idx_intro_slots_is_booked ON intro_slots(is_booked);

-- RLS
ALTER TABLE intro_slots    ENABLE ROW LEVEL SECURITY;
ALTER TABLE intro_bookings ENABLE ROW LEVEL SECURITY;

-- Public can read available (unbooked) future slots
CREATE POLICY "Public can view available slots"
  ON intro_slots FOR SELECT
  USING (is_booked = FALSE AND scheduled_at > NOW());

-- Admins can do everything on slots
CREATE POLICY "Admins full access to slots"
  ON intro_slots FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- No public read on bookings — admins only
CREATE POLICY "Admins full access to bookings"
  ON intro_bookings FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Service role can insert bookings (used by API route)
CREATE POLICY "Service role can insert bookings"
  ON intro_bookings FOR INSERT
  WITH CHECK (TRUE);

-- Service role can update slots (mark as booked)
CREATE POLICY "Service role can update slots"
  ON intro_slots FOR UPDATE
  USING (TRUE)
  WITH CHECK (TRUE);
