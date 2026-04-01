# WELA

WELA is a daily Amapiano artist-connection game. Each challenge asks the player to travel from one artist to another through shared songs, using as few hops as possible.

This repository is still named `LogDrum`, but the product inside it is `WELA`.

## Product Direction

- `WELA` is the active product direction
- The game is fully client-side
- There is no backend, auth, account system, or streak economy
- Daily challenges are generated using the South Africa date (`Africa/Johannesburg`)

## Gameplay

- Start from one artist and reach the target artist
- Each valid move must be supported by a shared song
- The connecting song is shown as part of the route
- Your solved path is stored locally so you can compare it with the optimal path
- A practice mode lets you play fresh routes outside the daily challenge

## Tech Stack

- React 18
- TypeScript
- Vite 6
- Tailwind CSS 3
- Local JSON datasets for artists and songs
- Graph-based pathfinding with deterministic daily challenge seeding

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

GitHub Pages is still published from this repository, so the production base path remains `/LogDrum/`.

- Repository: https://github.com/km-webdvlpr/LogDrum
- Live site: https://km-webdvlpr.github.io/LogDrum/