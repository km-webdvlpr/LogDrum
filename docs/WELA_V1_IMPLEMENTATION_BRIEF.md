# WELA V1 Implementation Brief

## 1. Purpose

This document translates the V1 product spec into a build-ready UX and implementation brief.

It is meant to answer:

- what the actual V1 screens should be
- what each screen is trying to make the player feel
- what should change from the current build
- which current files are likely to be affected

This is still pre-code product work.
The goal is alignment before execution.

## 2. Current Build Snapshot

The current product already has a usable app shell:

- daily challenge loading
- practice mode
- local solve history
- shared-song graph rules
- a premium green/gold interface

Current primary files:

- [src/App.tsx](c:\Users\Lenovo\OneDrive\Documents\PROJECTS 2026\LogDrum\src\App.tsx)
- [src/components/ArtistGrid.tsx](c:\Users\Lenovo\OneDrive\Documents\PROJECTS 2026\LogDrum\src\components\ArtistGrid.tsx)
- [src/components/ArtistNode.tsx](c:\Users\Lenovo\OneDrive\Documents\PROJECTS 2026\LogDrum\src\components\ArtistNode.tsx)
- [src/components/ResultScreen.tsx](c:\Users\Lenovo\OneDrive\Documents\PROJECTS 2026\LogDrum\src\components\ResultScreen.tsx)
- [src/store/useGame.ts](c:\Users\Lenovo\OneDrive\Documents\PROJECTS 2026\LogDrum\src\store\useGame.ts)
- [src/content/copy.ts](c:\Users\Lenovo\OneDrive\Documents\PROJECTS 2026\LogDrum\src\content\copy.ts)
- [src/index.css](c:\Users\Lenovo\OneDrive\Documents\PROJECTS 2026\LogDrum\src\index.css)
- [tailwind.config.ts](c:\Users\Lenovo\OneDrive\Documents\PROJECTS 2026\LogDrum\tailwind.config.ts)

## 3. Core UX Shift

### Current center of gravity

The current build centers:

- route movement
- grid scanning
- hop efficiency

### New center of gravity

V1 should center:

- explanation reveal
- route understanding
- arcade tension
- daily ritual identity

### Plain-English rule

The player should never wonder:

> "Why did that work?"

They should instead think:

> "Nice. That is the link."

## 4. V1 Experience Model

WELA should feel like a music-knowledge arcade machine.

The app flow should have three emotional phases:

### 1. Challenge framing

This is where the product feels dramatic and inviting.

### 2. Discovery loop

This is where each move creates a small reveal moment.

### 3. Route recap

This is where the product closes with learning, style, and comparison.

## 5. V1 Screen Map

### Screen A: Daily Challenge Frame

Purpose:
Introduce today's route with strong identity and immediate clarity.

Must show:

- WELA wordmark
- daily badge
- date
- locale switch
- start artist
- target artist
- short rule line
- primary interaction prompt

Desired feeling:

- "This feels like an event."
- "I know what I'm trying to do."

Current file ownership:

- [src/App.tsx](c:\Users\Lenovo\OneDrive\Documents\PROJECTS 2026\LogDrum\src\App.tsx)
- [src/content/copy.ts](c:\Users\Lenovo\OneDrive\Documents\PROJECTS 2026\LogDrum\src\content\copy.ts)

### Screen B: Active Route / Discovery Loop

Purpose:
Support each move with minimal confusion and maximum clarity.

Must show:

- current artist
- reachable moves
- visible path so far
- move explanation area
- progress framing

Desired feeling:

- "I can see what matters."
- "When I tap, I get meaning back."

Current file ownership:

- [src/App.tsx](c:\Users\Lenovo\OneDrive\Documents\PROJECTS 2026\LogDrum\src\App.tsx)
- [src/components/ArtistGrid.tsx](c:\Users\Lenovo\OneDrive\Documents\PROJECTS 2026\LogDrum\src\components\ArtistGrid.tsx)
- [src/components/ArtistNode.tsx](c:\Users\Lenovo\OneDrive\Documents\PROJECTS 2026\LogDrum\src\components\ArtistNode.tsx)

### Screen C: Move Reveal State

Purpose:
Turn a correct move into a reward moment.

Must show:

- selected move
- evidence song or collaboration
- one-line explanation
- visual confirmation that the route advanced

Desired feeling:

- "That was worth the tap."

Likely file ownership:

- [src/App.tsx](c:\Users\Lenovo\OneDrive\Documents\PROJECTS 2026\LogDrum\src\App.tsx)
- [src/store/useGame.ts](c:\Users\Lenovo\OneDrive\Documents\PROJECTS 2026\LogDrum\src\store\useGame.ts)
- new component likely needed later

### Screen D: Solved / Route Recap

Purpose:
Celebrate completion and reinforce learning.

Must show:

- final hop count
- player path
- best path comparison
- share action
- next daily reset

Should also show:

- why each move was valid, not just the sequence

Desired feeling:

- "I finished, and I understand the route."

Current file ownership:

- [src/components/ResultScreen.tsx](c:\Users\Lenovo\OneDrive\Documents\PROJECTS 2026\LogDrum\src\components\ResultScreen.tsx)

### Screen E: How To Play

Purpose:
Explain the product without flattening its mystery or style.

Must show:

- one-sentence game idea
- the move rule
- what makes a move valid
- why the game is fun

Desired feeling:

- "This is simple and fair."

Current file ownership:

- [src/App.tsx](c:\Users\Lenovo\OneDrive\Documents\PROJECTS 2026\LogDrum\src\App.tsx)
- [src/content/copy.ts](c:\Users\Lenovo\OneDrive\Documents\PROJECTS 2026\LogDrum\src\content\copy.ts)

### Screen F: History / Archive Lite

Purpose:
Support retention without becoming the main event.

Must show:

- recent daily routes
- route quality summary
- collectible feel

Desired feeling:

- "I've been here before."

Current file ownership:

- [src/components/PlayerLedger.tsx](c:\Users\Lenovo\OneDrive\Documents\PROJECTS 2026\LogDrum\src\components\PlayerLedger.tsx)

## 6. State Map

The app should feel different in each state.

### State 1: Pre-move

The user is deciding.

UX priority:

- focus
- clarity
- visible possible moves

### State 2: Successful move

The user has learned something.

UX priority:

- confirmation
- explanation
- motion reward

### State 3: Solved

The user has completed the route.

UX priority:

- celebration
- recap
- shareability

### State 4: Practice mode

The user is experimenting.

UX priority:

- low pressure
- freshness
- no confusion with daily status

### State 5: Restored result

The route is already solved on this device.

UX priority:

- clear explanation
- review mode feel
- no false sense of fresh play

## 7. Screen-By-Screen UX Requirements

## 7.1 Daily Challenge Frame

### Layout intent

The current start/target card structure is solid.
Keep the head-to-head framing, but make it feel more like a versus marquee.

### Recommended hierarchy

1. WELA brand
2. daily status
3. start vs target
4. one-line objective
5. active route area

### Copy direction

Replace purely mechanical prompts like "move through shared songs" with language that frames discovery.

Better examples:

- "Trace today's connection"
- "Find the link"
- "Move through real collaborations"

### Visual notes

- stronger header contrast
- more cabinet / scoreboard feeling
- more decisive target emphasis

## 7.2 Discovery Loop

### Layout problem in current build

The full 3-column artist roster asks the player to scan all artists every turn.

This is manageable, but not ideal for delight.

### Recommendation

For V1, move toward a two-zone interaction model:

- top: route and explanation
- bottom: playable moves

### Move selection options

Best V1 recommendation:

- keep tap-based cards
- only foreground valid moves strongly
- reduce disabled-node visual weight even more

Possible later variant:

- search + suggestion mode

Not recommended first:

- fully open search before the explanation system is strong

### Interaction rule

At any moment, the user should instantly know:

- where they are
- what is selectable
- what the target is

## 7.3 Move Reveal

This is the single most important addition.

### Required behavior

After a valid move, show a reveal card or animated strip that answers:

- who connected to who
- through what song or collaboration
- why that mattered

### Example structure

Label:
`LINK FOUND`

Body:
`DBN Gogo -> Mellow & Sleazy`

Support:
`Connected via Track X`

Optional one-line interpretation:
`A direct credited collaboration`

### Motion guidance

- short flash
- soft upward reveal
- gold accent on success
- green pulse on route progression

Motion should feel celebratory, not loud.

## 7.4 Result Screen

### Current strength

The result structure is already solid.

### Needed change

It currently resolves mainly as:

- hop count
- shortest-route comparison

It should resolve as:

- completion
- path story
- best route comparison
- shareable learning artifact

### Recommendation

Keep:

- hop count
- best path comparison
- share action

Add emphasis to:

- explanation chain
- "what you uncovered"
- collectible route-summary feel

## 7.5 How To Play

The current modal is clean but still too operational.

The rules should feel simple, fair, and motivating.

### Rewrite direction

Good:

- "Move from today's start artist to the target through real music links."
- "Every valid move is backed by a song or collaboration."
- "Each move reveals why the connection is real."

Avoid:

- overexplaining hop optimization too early
- making the product sound like a graph problem

## 7.6 History

History should remain secondary in V1.

### Role

It is there to support ritual and pride, not become a spreadsheet.

### Recommendation

- keep stats small
- make recent routes feel like collectibles
- highlight dates and route pairings more than numeric summaries

## 8. Design System Changes

## 8.1 Color

Current palette is good and should be preserved.

Recommended role refinement:

- `paper`: reading surface
- `ink`: body contrast
- `gold`: reward / badge / marquee accent
- `ember`: target / success / active route completion
- deep green derivatives can be added later for stronger arcade depth

## 8.2 Typography

Current fonts:

- Bebas Neue for display
- Sora for body

Recommended V1 shift:

- replace display layer with Space Grotesk or IBM Plex Sans emphasis
- add Space Mono or IBM Plex Mono as system accent

Why:

- the current display face is bold but slightly poster-like
- the product now wants modern arcade intelligence, not just nightlife energy

### Use of mono

Mono should appear in:

- date
- hop count
- system labels
- locale chips
- move status labels

Mono should not dominate:

- artist names
- explanations
- body copy

## 8.3 Motion

Use a small motion set repeatedly.

### Primary motions

- rise-in for cards
- pulse/glow for active states
- route-link reveal for successful move
- soft count-up or flash on solve

### Motion rule

If a motion does not improve meaning, remove it.

## 9. Copy System Changes

The copy layer currently leans functional.

It should become more product-defining.

### Copy priorities

- clearer rule framing
- stronger move reward language
- less emphasis on "best possible" as the only success metric
- more emphasis on discovery and route meaning

### Content system additions needed later

- connection explanation templates
- invalid-move feedback templates
- solve-state celebration copy
- isiXhosa translation layer

Current file ownership:

- [src/content/copy.ts](c:\Users\Lenovo\OneDrive\Documents\PROJECTS 2026\LogDrum\src\content\copy.ts)

## 10. Localization Plan

### V1 locales

- `en`
- `zu`
- `xh`

### Rollout recommendation

Phase 1:

- keep English and isiZulu stable
- add isiXhosa support structurally

Phase 2:

- translate all user-facing chrome
- translate result and guidance copy

Phase 3:

- localize dynamic explanation templates

### Technical implication

The current locale type in [src/content/copy.ts:1](c:\Users\Lenovo\OneDrive\Documents\PROJECTS 2026\LogDrum\src\content\copy.ts#L1) and locale persistence in [src/App.tsx:196](c:\Users\Lenovo\OneDrive\Documents\PROJECTS 2026\LogDrum\src\App.tsx#L196) will need extension.

## 11. Component Strategy For Implementation

Likely future component structure:

- `ChallengeHeader`
- `RouteFrame`
- `MoveRevealCard`
- `PlayableMoves`
- `RouteRecap`
- `LocaleSwitcher`

This does not require a major architecture rewrite.
The existing app can evolve incrementally.

### Recommended ownership by file

[src/App.tsx](c:\Users\Lenovo\OneDrive\Documents\PROJECTS 2026\LogDrum\src\App.tsx)

- screen orchestration
- mode switching
- top-level layout
- reveal state wiring

[src/store/useGame.ts](c:\Users\Lenovo\OneDrive\Documents\PROJECTS 2026\LogDrum\src\store\useGame.ts)

- capture move evidence more intentionally
- possibly store a richer explanation payload per move

[src/components/ArtistGrid.tsx](c:\Users\Lenovo\OneDrive\Documents\PROJECTS 2026\LogDrum\src\components\ArtistGrid.tsx)

- reduce clutter
- foreground valid options
- possibly evolve into a smaller move list / move cluster

[src/components/ResultScreen.tsx](c:\Users\Lenovo\OneDrive\Documents\PROJECTS 2026\LogDrum\src\components\ResultScreen.tsx)

- emphasize route narrative over score summary

[src/content/copy.ts](c:\Users\Lenovo\OneDrive\Documents\PROJECTS 2026\LogDrum\src\content\copy.ts)

- product voice rewrite
- locale expansion
- explanation template support

[src/index.css](c:\Users\Lenovo\OneDrive\Documents\PROJECTS 2026\LogDrum\src\index.css)

- stronger arcade atmosphere
- CRT / scanline restraint
- typography import changes

[tailwind.config.ts](c:\Users\Lenovo\OneDrive\Documents\PROJECTS 2026\LogDrum\tailwind.config.ts)

- font tokens
- new motion tokens if needed

## 12. Recommended Build Sequence

### Phase 1: Meaning before style

- define move explanation model
- define new copy system
- define screen hierarchy

### Phase 2: Core play screen restructure

- reduce grid noise
- add move reveal state
- rebalance visual hierarchy toward explanation

### Phase 3: Result and history refinement

- improve solved-state recap
- improve collectible feel
- reduce spreadsheet feel in history

### Phase 4: Brand finish

- font system shift
- arcade motion pass
- final visual polish

## 13. Acceptance Criteria

V1 implementation is aligned if:

- every valid move visibly explains itself
- the play screen feels clearer within 3 seconds
- a correct move feels rewarding without needing points
- the result screen tells a story, not just a score
- the product feels more arcade-distinctive than before
- English, isiZulu, and isiXhosa are structurally supported

## 14. What Not To Do Next

Do not immediately:

- add more datasets before the loop is stronger
- add AI to generate vague explanations
- add leaderboard features
- over-design the archive
- make the product more complex before it is more satisfying

## 15. Immediate Build Reference

The next document to use during implementation is:

`WELA V1 screen blueprint`

Available here:

- [docs/WELA_V1_SCREEN_BLUEPRINT.md](c:\Users\Lenovo\OneDrive\Documents\PROJECTS 2026\LogDrum\docs\WELA_V1_SCREEN_BLUEPRINT.md)

Use it as the layout contract for:

- section order
- labels
- example copy
- component list
- responsive behavior

With that in place, coding can begin without the product drifting back into "pretty but thin."
