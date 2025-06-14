
# Gym Management SaaS Starter

Full-stack (Supabase + Node.js/Express + React + Tailwind) solution refactored from a Car Garage SaaS platform.

## Features

- Multi-tenant (gym_id), RLS-secure database
- Manage gyms, trainers, members, classes, sessions, bookings, equipment, payments
- Modern UI: dashboard, cards, side navigation
- API authentication + RBAC via Supabase JWT
- Example business logic & notification utils

---

## Setup/Deployment

### 1. Clone and Install

```sh
git clone [REPO_URL].git
cd [REPO_NAME]
npm install
```

### 2. Database

- Go to Supabase dashboard, create a new project.
- Run migration:  
  Upload/run `supabase/migrations/2025XX_gym_init.sql` in Supabase SQL Editor.

- Configure RLS:  Adjust policies in Supabase dashboard per table for tenant (gym) access and roles.

### 3. Environment Variables

- Add Supabase secrets to `.env` for backend (see dashboard).
- Set Supabase project URL and public anon key in frontend config.

### 4. Backend

```sh
cd backend
npm install
npm run dev
```

- Exposes /api/ endpoints for CRUD with JWT protection.

### 5. Frontend

```sh
cd frontend
npm install
npm run dev
```

- Modern card-based dashboard at `/dashboard`.

### 6. Deploy

- Push updated code to GitHub.
- Connect Supabase and deploy backend (any Node.js host) and frontend (Vercel/Netlify).
- Connect custom domain if needed.

---

## RLS / Multi-Tenancy

- All tables scoped by `gym_id`.
- Typical policy:  
  ```
  CREATE POLICY "Gym data access"
    ON members
    USING (gym_id = auth.jwt()->>'gym_id')
    WITH CHECK (gym_id = auth.jwt()->>'gym_id');
  ```
- Roles:  
  - **admin**: can manage all gym data.
  - **trainer**: manage sessions, class attendance, own trainees.
  - **member**: see own bookings, make/reschedule bookings.

---

## Best Practices

- Follow designs from industry leaders such as Mindbody, Gymdesk, Traqade for layout patterns.
- Use Supabase Auth for JWT tokens, configure user claims with `gym_id` and `role`.
- Use modern React patterns for UI/UX.

---

## Directory Structure

- `/supabase` — SQL migrations, policies
- `/backend` — Express app, API code, business logic
- `/frontend` — React + Tailwind dashboard and features

---

## Questions?

- Ping the Lovable team for community or professional support, or read `/supabase` and controller code samples for "how to extend".

