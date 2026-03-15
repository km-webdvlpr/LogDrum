# LogDrum

LogDrum is a non-commercial portfolio project: a daily Amapiano discovery game where players guess the Song of the Day using progressive clues.

## What It Is

- A mobile-first daily puzzle inspired by music discovery, not by existing puzzle branding
- A cultural web experience rooted in South African Amapiano energy and Johannesburg-inspired visual direction
- A front-end portfolio piece showing product thinking, documentation discipline, and polished interaction design

## How The Daily Puzzle Works

- One new puzzle is selected each day using the South Africa date (`Africa/Johannesburg`)
- Players get up to 6 guesses to identify the song title
- After each incorrect guess, a new clue is revealed
- Guesses autocomplete from the local dataset
- Progress is stored in `localStorage`, including streak, solved history, and completion state
- After the puzzle ends, players enter the "After the Drop" screen with song details and an official Spotify embed if a `spotify_id` exists

## Constraints

- Non-commercial only
- No copyrighted lyrics
- No self-hosted or proxied audio
- Spotify embeds are used only as post-puzzle discovery rewards

## Local Development

```bash
npm install
npm run dev
```

Then open the local Vite URL shown in the terminal.

## Production Build

```bash
npm run build
npm run preview
```

## Docs

- [`docs/BRD.md`](./docs/BRD.md)
- [`docs/PRD.md`](./docs/PRD.md)
- [`docs/TRD.md`](./docs/TRD.md)
- [`docs/SUPABASE_SETUP.md`](./docs/SUPABASE_SETUP.md)

## Deployment

This project is compatible with static hosting providers such as GitHub Pages, Vercel, and Netlify.

## Supabase Setup

1. Create a Supabase project.
2. In the SQL editor, run [`supabase/schema.sql`](./supabase/schema.sql).
3. Copy [`.env.example`](./.env.example) to `.env.local`.
4. Set:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_ADMIN_EMAILS`
5. Mark your own user as admin by updating `profiles.is_admin = true` in Supabase after your first login.

Without Supabase env values, LogDrum still runs in local gameplay mode for frontend iteration.
