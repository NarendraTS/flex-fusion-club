
-- === Table Renames ===
ALTER TABLE garages RENAME TO gyms;
ALTER TABLE staff RENAME TO trainers;
ALTER TABLE job_cards RENAME TO sessions;
ALTER TABLE attendance RENAME TO member_checkins;
ALTER TABLE inventory RENAME TO equipment;
ALTER TABLE garage_services RENAME TO class_types;
ALTER TABLE promotions RENAME TO promotions; -- keep, or rename to promotion_codes if needed

-- === Rename Foreign Keys & Columns ===
ALTER TABLE trainers        RENAME COLUMN garage_id TO gym_id;
ALTER TABLE sessions        RENAME COLUMN garage_id TO gym_id;
ALTER TABLE member_checkins RENAME COLUMN garage_id TO gym_id;
ALTER TABLE class_types     RENAME COLUMN garage_id TO gym_id;
ALTER TABLE equipment       RENAME COLUMN garage_id TO gym_id;
ALTER TABLE invoices        RENAME COLUMN garage_id TO gym_id;
ALTER TABLE invoice_items   RENAME COLUMN garage_id TO gym_id;
ALTER TABLE promotions      RENAME COLUMN garage_id TO gym_id;

-- Add new member columns if needed for multi-tenancy
-- 1. MEMBERSHIP PLANS
CREATE TABLE IF NOT EXISTS membership_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  gym_id uuid NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
  name text NOT NULL,
  duration_days integer NOT NULL,
  price numeric(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- 2. MEMBERS
CREATE TABLE IF NOT EXISTS members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  gym_id uuid REFERENCES gyms(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text,
  plan_id uuid REFERENCES membership_plans(id),
  join_date date,
  expiry_date date,
  created_at timestamptz DEFAULT now()
);

-- 3. CLASS SCHEDULES
CREATE TABLE IF NOT EXISTS class_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  gym_id uuid NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
  class_type_id uuid NOT NULL REFERENCES class_types(id),
  trainer_id uuid REFERENCES trainers(id),
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- 4. CLASS BOOKINGS
CREATE TABLE IF NOT EXISTS class_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_schedule_id uuid NOT NULL REFERENCES class_schedules(id),
  member_id uuid NOT NULL REFERENCES members(id),
  gym_id uuid NOT NULL REFERENCES gyms(id),
  booking_time timestamptz DEFAULT now(),
  status text DEFAULT 'booked'
);

-- 5. PAYMENTS
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  gym_id uuid NOT NULL REFERENCES gyms(id),
  member_id uuid REFERENCES members(id),
  amount numeric(10,2) NOT NULL,
  payment_date timestamptz DEFAULT now(),
  method text,
  invoice_id uuid REFERENCES invoices(id),
  notes text
);

-- 6. DIET PLANS
CREATE TABLE IF NOT EXISTS diet_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id uuid REFERENCES members(id),
  gym_id uuid REFERENCES gyms(id),
  plan text,
  created_at timestamptz DEFAULT now()
);

-- 7. MEMBER MEASUREMENTS (Optional)
CREATE TABLE IF NOT EXISTS measurements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id uuid REFERENCES members(id),
  gym_id uuid REFERENCES gyms(id),
  date timestamptz DEFAULT now(),
  height_cm int,
  weight_kg int,
  bodyfat_percent numeric(5,2)
);

-- 8. TRAINER ATTENDANCE
CREATE TABLE IF NOT EXISTS trainer_attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trainer_id uuid REFERENCES trainers(id),
  gym_id uuid REFERENCES gyms(id),
  timestamp timestamptz DEFAULT now()
);

-- === RLS POLICY EXAMPLES (apply for all tables with gym_id column!) ===
-- (Pseudo-SQL; set via Supabase's GUI or CLI)

-- Enable RLS
ALTER TABLE gyms              ENABLE ROW LEVEL SECURITY;
ALTER TABLE trainers          ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions          ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment         ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_types       ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_checkins   ENABLE ROW LEVEL SECURITY;
ALTER TABLE members           ENABLE ROW LEVEL SECURITY;
ALTER TABLE membership_plans  ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_schedules   ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_bookings    ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments          ENABLE ROW LEVEL SECURITY;
ALTER TABLE diet_plans        ENABLE ROW LEVEL SECURITY;

-- Policy: User must be member of the gym
-- This is a template! Use Supabase Auth and set claims (X-Hasura-Gym-Id, etc.) as appropriate:
-- Example for trainers:
-- CREATE POLICY "Trainers can manage their gym" ON trainers
--   USING (gym_id = auth.jwt()->>'gym_id');
--   WITH CHECK (gym_id = auth.jwt()->>'gym_id');

-- Adapt similar policies for all above tables.
