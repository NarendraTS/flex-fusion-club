
# Gym Management SaaS (Postgres + Supabase + React + Tailwind)

## Quick Start

1. **Deploy Database**
    - Run the SQL in `supabase/migrations/repurpose_garage_to_gym.sql` on your Postgres/Supabase instance.

2. **Configure Supabase RLS**
    - Set up policies so every user only sees gym data matching their jwt "gym_id" (see migration for hints).

3. **Backend**
    - Use the scaffold in `backend/` (REST API or Supabase Edge Functions).
    - Configure `.env` with Supabase JWT secret.

4. **Frontend**
    - `src/` contains all pages using React and Tailwind.
    - Deploy to Vercel or Netlify as a static SPA.

5. **Run Locally**
    - `cd backend && npm install && npm run dev`
    - `cd frontend && npm install && npm run dev`

6. **Deploy**
    - Push code to GitHub.
    - Connect to Supabase and your deploy host (Vercel/Netlify).

## Notes

- Auth via Supabase JWT (claims must contain gym_id!)
- RLS policies are mandatory for isolation.
- Frontend URLs: `/dashboard`, `/trainers`, `/members`, `/sessions`, `/payments`, `/equipment`, `/classes`

