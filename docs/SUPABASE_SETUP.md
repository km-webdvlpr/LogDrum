# Supabase Setup

## Goal

Get LogDrum connected to a real Supabase backend with:

- Email magic-link login
- Player profiles
- Daily challenge storage
- Synced guesses and results
- Admin dashboard access

## 1. Run The Schema

1. Open your Supabase project.
2. Go to `SQL Editor`.
3. Create a new query.
4. Paste the full contents of [`supabase/schema.sql`](../supabase/schema.sql).
5. Run the query.

This creates the required tables, policies, and helper functions.

## 2. Get Client Credentials

Go to `Settings -> API` and copy:

- `Project URL`
- `anon public` key or `publishable` key

These are the only credentials needed in the frontend app.

Do not use the `service_role` key in the frontend.

## 3. Configure Local Env

Create `.env.local` in the project root with:

```env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
VITE_ADMIN_EMAILS=your-email@example.com
```

`VITE_ADMIN_EMAILS` can contain multiple comma-separated emails later if needed.

## 4. Configure Auth URLs

Go to `Authentication -> URL Configuration`.

Set:

- `Site URL`:
  - local: `http://localhost:5173`
  - production later: `https://km-webdvlpr.github.io/LogDrum/`

Add redirect URLs:

- `http://localhost:5173`
- `https://km-webdvlpr.github.io/LogDrum/`

## 5. Enable Email Auth

Go to `Authentication -> Providers -> Email`.

Confirm email auth is enabled.

Use magic-link login for v1.

## 6. Start The App

Run:

```bash
npm install
npm run dev
```

## 7. Create Your Admin User

1. Open the app locally.
2. Sign in with the email address you listed in `VITE_ADMIN_EMAILS`.
3. Check your email and complete the magic-link login.

After that first login, your profile record will exist in the `profiles` table.

## 8. Mark Yourself As Admin

Back in Supabase, run:

```sql
update public.profiles
set is_admin = true
where email = 'your-email@example.com';
```

Replace with your real admin email.

## 9. Import The Starter Library

Once you reload the app and open the Control Room:

1. Click `Import Starter Library`
2. Wait for the success message

This pushes the current 30-song starter dataset into Supabase from the app itself.

## 10. Assign The Daily Challenge

In the Control Room:

1. Enter the RSA challenge date in `YYYY-MM-DD`
2. Enter the `song_id`
3. Save the daily challenge

## 11. Send Me These Values

When ready, send me:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- the admin email you used

Then I can finish the final activation pass with you.
