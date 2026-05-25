# GeoGuessr Flag Quiz

A Vite + React spaced-repetition quiz for flags and country TLDs, now with Supabase persistence.

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Create an env file:

```bash
cp .env.example .env.local
```

3. Start the app:

```bash
npm run dev
```

## Environment variables

Add the following variables in `.env.local` (and in Vercel project env settings):

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
VITE_PROFILE_ID=adryan
```

- `VITE_SUPABASE_URL`: Supabase project URL.
- `VITE_SUPABASE_ANON_KEY`: Supabase public anon key (safe for browser use).
- `VITE_PROFILE_ID`: Row key used by the app to read/write one shared progress row. Defaults to `adryan` if omitted.

> Do **not** use or expose the `service_role` key in this frontend app.

## Supabase setup

1. Create a Supabase project.
2. In Supabase SQL Editor, run `supabase.sql` from this repo.
3. Confirm table `public.quiz_progress` exists with columns:
   - `profile_id` (primary key)
   - `cards` (jsonb)
   - `stats` (jsonb)
   - `updated_at` (timestamp with time zone)
4. Copy your project URL and anon key into environment variables.

## Vercel deployment

1. Push this repository to GitHub.
2. Import the repo in Vercel.
3. In Vercel project settings, set:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_PROFILE_ID` (optional; defaults to `adryan`)
4. Deploy.
5. On future env changes, redeploy so Vite rebuilds with updated values.
