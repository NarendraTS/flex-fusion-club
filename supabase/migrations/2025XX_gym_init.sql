
-- === TABLE RENAMES ===
ALTER TABLE garages RENAME TO gyms;
ALTER TABLE staff RENAME TO trainers;
ALTER TABLE job_cards RENAME TO sessions;
ALTER TABLE attendance RENAME TO member_checkins;
ALTER TABLE inventory RENAME TO equipment;
ALTER TABLE garage_services RENAME TO classes;
ALTER TABLE promotions RENAME TO promotion_codes;

-- === COLUMN RENAMES (main FKs) ===
ALTER TABLE trainers        RENAME COLUMN garage_id TO gym_id;
ALTER TABLE sessions        RENAME COLUMN garage_id TO gym_id;
ALTER TABLE member_checkins RENAME COLUMN garage_id TO gym_id;
ALTER TABLE classes         RENAME COLUMN garage_id TO gym_id;
ALTER TABLE equipment       RENAME COLUMN garage_id TO gym_id;
ALTER TABLE invoices        RENAME COLUMN garage_id TO gym_id;
ALTER TABLE invoice_items   RENAME COLUMN garage_id TO gym_id;
ALTER TABLE promotion_codes RENAME COLUMN garage_id TO gym_id;

-- === NEW TABLES ===

-- MEMBERS
CREATE TABLE IF NOT EXISTS members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  gym_id uuid REFERENCES gyms(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text,
  created_at timestamptz DEFAULT now()
);

-- MEMBERSHIPS
CREATE TABLE IF NOT EXISTS memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id uuid NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  gym_id uuid REFERENCES gyms(id) ON DELETE CASCADE,
  plan_name text NOT NULL,
  start_date date NOT NULL,
  expiry_date date NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- EQUIPMENT USAGE
CREATE TABLE IF NOT EXISTS equipment_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id uuid REFERENCES members(id),
  equipment_id uuid REFERENCES equipment(id),
  gym_id uuid REFERENCES gyms(id),
  used_at timestamptz DEFAULT now()
);

-- CLASS BOOKINGS
CREATE TABLE IF NOT EXISTS class_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id uuid NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  member_id uuid NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  gym_id uuid REFERENCES gyms(id) ON DELETE CASCADE,
  status text DEFAULT 'booked',
  booked_at timestamptz DEFAULT now()
);

-- TRAINER ATTENDANCE (for payouts)
CREATE TABLE IF NOT EXISTS trainer_attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trainer_id uuid REFERENCES trainers(id),
  gym_id uuid REFERENCES gyms(id),
  timestamp timestamptz DEFAULT now()
);

-- DIET PLANS (optional)
CREATE TABLE IF NOT EXISTS diet_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id uuid REFERENCES members(id),
  gym_id uuid REFERENCES gyms(id),
  plan text,
  created_at timestamptz DEFAULT now()
);

-- MEASUREMENTS (optional)
CREATE TABLE IF NOT EXISTS measurements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id uuid REFERENCES members(id),
  gym_id uuid REFERENCES gyms(id),
  date timestamptz DEFAULT now(),
  height_cm int,
  weight_kg int,
  bodyfat_percent numeric(5,2)
);

-- === INDEXES FOR PERFORMANCE ===
CREATE INDEX IF NOT EXISTS idx_members_gym_id ON members(gym_id);
CREATE INDEX IF NOT EXISTS idx_trainer_attendance_gym_id ON trainer_attendance(gym_id);

-- === RLS POLICIES (Supabase GUI preferred, but SQL sketch provided) ===
ALTER TABLE gyms ENABLE ROW LEVEL SECURITY;
ALTER TABLE trainers ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE trainer_attendance ENABLE ROW LEVEL SECURITY;

-- Policy Example: Allow only gym users (admins/trainers/members) to read/write their gym's data:
-- (Adjust for each table in Supabase dashboard for best manageability)
-- CREATE POLICY "Gym users can access their gym data" ON members USING (gym_id = auth.jwt()->>'gym_id') WITH CHECK (gym_id = auth.jwt()->>'gym_id');

