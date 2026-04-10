# WELA Arcade Art Direction

## Source

This document captures the arcade redesign direction supplied via:

- `wela_arcade_redesign_concept.html`

The goal is to lock the art direction into the project so it can guide execution.

## Why This Matters

This reference is valuable because it goes beyond "make it feel more arcade."

It defines:

- a clear cabinet-inspired visual language
- a stronger type system
- a more disciplined color system
- more assertive layout framing
- motion with purpose
- a stronger opinion about what makes the product feel like a game instead of a soft web app

## Core Framing

The right conceptual frame is:

`African Arcade Cabinet`

Not:

- generic 80s nostalgia
- neon cyberpunk
- an American mall arcade copy
- a web app with retro fonts pasted on top

The closest emotional direction is:

- jukebox energy
- tavern confidence
- utilitarian theatre
- culturally specific pride
- premium through specificity

## What This Direction Clarifies Well

### 1. The interface should feel like hardware

The cabinet framing, ticker strip, scoreboard hierarchy, footer bar, and labeled panels all make the screen feel like a machine with rules.

That is much stronger than the current "soft card" feel.

### 2. Typography must do different jobs

The brief makes it clear that one font cannot carry the whole experience.

Recommended role split:

- `Orbitron`: score, timer, numerical game state
- `Black Han Sans`: artist names, short high-impact labels
- `Space Mono`: system chrome, metadata, control labels
- `DM Sans`: readable human body copy

This is a much sharper system than "change the font."

### 3. Green-on-dark is the real arcade base

The current WELA implementation still reads too light and soft.

This concept makes a more radical but coherent move:

- dark cabinet body
- green as active electrical state
- gold as reward and prestige layer
- red as stakes and penalty layer
- cream as reading layer

### 4. Layout is doing most of the arcade work

The mockup is persuasive because the arcade feeling does not come only from color.

It comes from:

- a marquee header
- a ticker strip
- a side rail for game state
- panel tags
- a footer bar
- tighter corner radii
- visible score presence

That is the correct kind of structural thinking.

## Important Product Distinction

This mockup is not only a visual direction.

It also implies a different interaction model:

- clue unlocking
- point loss
- timer pressure
- lives
- text input
- leaderboard language

That is a meaningful product shift from the current WELA experience.

Current WELA is:

- an explainable artist-connection puzzle
- tap-based navigation
- discovery-first

The mockup points toward:

- clue-based deduction
- score pressure
- input-driven guessing
- stronger arcade stakes

## Recommendation

Lock in the **visual system** immediately.

Do **not** automatically adopt the full mechanic system unless we intentionally choose to pivot.

## What To Adopt Now

Use this as the active design grammar for WELA:

- dark cabinet background
- gold and green dominance
- panel labels
- stronger machine-like hierarchy
- right-rail state presentation
- ticker strip
- harder edges and smaller radii
- mono labels and scoreboard logic
- more theatrical header and footer framing

## What To Treat As Optional / Later

These should only be adopted if we intentionally change the core game:

- clue cost penalties
- countdown timer pressure
- life system
- score-first progression
- text input as the main interaction

## Best Use For Current WELA

The strongest path is:

`apply this cabinet design language to the existing explainable-connection gameplay`

That means:

- keep start artist to target artist structure
- keep explainable move reveals
- keep discovery-first reward loop
- restyle the screen with this harder cabinet framing

## Mapping This Art Direction To Current WELA

### Marquee Bar

Current WELA equivalent:

- WELA logo
- daily badge
- daily route number or date
- visible route score / hops / completion state

### Ticker Strip

Current WELA equivalent:

- daily route info
- average hops
- players completed
- local streak language
- rotating music culture facts later

### Main Challenge Panel

Current WELA equivalent:

- start artist
- target artist
- "today's chain" framing

### Clue / Reveal Panel

Current WELA equivalent:

- the move reveal card
- explanation evidence
- why the move is valid

### Sidebar State Rail

Current WELA equivalent:

- hops used
- current route depth
- progress toward target
- practice vs daily state
- streak later if desired

### Footer Bar

Current WELA equivalent:

- daily ID
- date
- streak
- playful machine language like `INSERT COIN`

## Design Rules To Lock In

### Corners

Keep radii tight:

- 2px to 4px for machine surfaces
- avoid soft rounded mobile-app cards

### Surfaces

- dark first
- glowing text over dark panels
- no large white/cream cards as primary surfaces

### Labels

- all system labels in uppercase mono
- strong letter spacing
- short phrases only

### Score Visibility

- game-state numbers should always be visible
- no hidden score logic
- if a metric matters, the machine should show it

### Motion

- cause and effect only
- no decorative particles
- no generic confetti
- no ambient movement without purpose beyond the ticker and gentle live-state pulsing

## Implementation Guidance

When applying this direction to the current app:

### Phase 1

- darken the full shell
- introduce marquee / ticker / footer framing
- move live game state into a more arcade-like visible structure

### Phase 2

- replace soft cards with cabinet panels
- tighten radii
- upgrade typography to the four-role system

### Phase 3

- refine interaction feedback
- make correct / wrong / solved states feel machine-driven and immediate

## Final Position

This concept is strong.

It fixes the exact thing the current UI still lacks:

`structural arcade identity`

It should be treated as a serious design reference for the next visual iteration.

But we should stay disciplined:

- adopt the cabinet grammar now
- adopt the clue/timer/lives mechanics only if we intentionally pivot the product
