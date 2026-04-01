# Technical Requirements Document

## 1. Technology Stack

Frontend:

- React
- TypeScript
- Vite
- Tailwind CSS

Runtime model:

- Static frontend only
- No backend service
- No authentication layer
- No database dependency

## 2. Project Architecture

```text
src/
  components/
  data/
  engine/
  store/
  types/
docs/
```

The architecture separates presentation, graph logic, local persistence, and typed data structures.

## 3. Game Logic

WELA uses a graph model:

- Artists are nodes
- Shared-song relationships are edges
- Songs are attached to edges as the evidence for valid movement

Daily challenges are generated using the South Africa time zone (`Africa/Johannesburg`).

The challenge generator must:

- Produce deterministic results for a given date
- Prefer artist pairs within a reasonable hop distance
- Guarantee that the selected pair is solvable

## 4. State Management

Application state is managed in React with local persistence only.

Persisted values include:

- Solved challenge history
- Player route
- Hop count
- Optimal route comparison data
- Solve timestamp

Daily history is stored in `localStorage`. Practice play should remain separate from permanent daily history.

## 5. Dataset

The application uses local JSON data files for:

- Artists
- Songs

Song records must support graph construction by including:

- `id`
- `title`
- `year`
- `artists`

Artist records must support challenge and UI rendering by including:

- `id`
- `name`
- `era`

## 6. Share and Result Layer

The result screen should:

- Show the player's completed path
- Compare it with the optimal path
- Generate a shareable text summary

These features must remain fully client-side.

## 7. Deployment

The application is deployed as a static build.

Supported deployment targets include:

- GitHub Pages
- Vercel
- Netlify

For the current setup, the repository name remains `LogDrum`, so the GitHub Pages production base path is `/LogDrum/` even though the product name is `WELA`.