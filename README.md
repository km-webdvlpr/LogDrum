# WELA

A daily Amapiano artist-connection game. Navigate from one artist to another through shared songs, in as few hops as possible.

Built as a non-commercial portfolio piece — no backend, no accounts, no streaks.

## How It Works

- One new challenge is generated each day using the South Africa date (`Africa/Johannesburg`)
- Start at one artist, reach the destination by hopping through artists who share songs
- Tap a valid artist to move — the connecting song is shown at each step
- Your path and hop count are saved locally; compare against the optimal route

## Stack

- React 18 + TypeScript + Vite 6 + Tailwind CSS 3
- Pure graph engine (BFS pathfinding, adjacency + edge maps)
- Deterministic daily seeding via LCG hash from SA timezone date
- No backend — all state in localStorage

## Local Development

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
npm run preview
```

## Deployment

Deployed to GitHub Pages via GitHub Actions on push to `main`.
Live at: https://km-webdvlpr.github.io/LogDrum/
