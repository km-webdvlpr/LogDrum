# WELA V1 Screen Blueprint

## 1. Purpose

This blueprint defines the intended structure of the main WELA screens before implementation.

It is not a visual mock.
It is a layout and UX contract.

Each screen section below is ordered from top to bottom on mobile.

## 2. Mobile-First Frame

Target frame:

- single-column layout
- max width around current mobile shell
- one primary interaction zone at a time
- strong vertical rhythm

The screen should feel like a handheld arcade panel:

- framed
- legible
- energetic
- uncluttered

## 3. Global Chrome

These elements persist across most screens:

1. WELA wordmark
2. daily or practice badge
3. locale switch
4. history access
5. help access

### Global chrome rules

- keep top bar compact
- use mono/system styling for chips and controls
- keep utility controls visually secondary to the challenge

## 4. Screen: Daily Challenge Start

### Goal

Set the mission immediately.

### Section order

1. Top chrome
2. Date strip
3. Main challenge marquee
4. One-line promise / rule line
5. Current route panel
6. Move reveal area or placeholder
7. Available move zone

### Block details

#### 1. Top chrome

Contents:

- `WELA`
- `DAILY` or `PRACTICE`
- locale chips
- history button
- help button

Tone:

- premium
- compact
- slightly machine-like

#### 2. Date strip

Contents:

- current South Africa date
- optional tiny puzzle ID later

Tone:

- subtle
- mono
- system-like

#### 3. Main challenge marquee

Contents:

- label: `TODAY'S ROUTE`
- start artist panel
- versus connector
- target artist panel

Optional support line:

- `Trace the real link`

Tone:

- headline
- theatrical
- arcade attract-screen energy

#### 4. One-line promise / rule line

Contents:

- one sentence only

Example:

- `Every move must reveal a real music connection.`

Purpose:

- teach the rule without looking like a tutorial

#### 5. Current route panel

Contents:

- label: `CURRENT ROUTE`
- current artist
- hop count
- route progress markers

Purpose:

- show the player exactly where they are

#### 6. Move reveal area

Contents when empty:

- placeholder label: `NEXT LINK`
- microcopy: `Choose a connected artist to reveal the link.`

Contents after success:

- label: `LINK FOUND`
- from artist
- to artist
- evidence line
- one-line explanation

Purpose:

- keep the explanation visible and central

#### 7. Available move zone

Contents:

- label: `AVAILABLE MOVES`
- playable artist cards only, or visually dominant valid cards
- destination card if directly reachable

Purpose:

- reduce scanning burden
- keep the user in action

## 5. Screen: Active Route After First Move

### Goal

Make progress feel real.

### Section order

1. Top chrome
2. Main challenge marquee
3. Current route panel
4. Link reveal card
5. Route chain
6. Available move zone
7. Undo link

### Notes

- the link reveal card should animate in after each move
- the route chain should expand below it
- the move area should remain visible without forcing excessive scroll

## 6. Screen: Solved State

### Goal

Close with meaning and pride.

### Section order

1. Top chrome
2. Solved banner
3. Result hero
4. Your route story
5. Best route comparison
6. Share action
7. Practice or return action
8. Next reset note

### Block details

#### 1. Solved banner

Example label:

- `ROUTE COMPLETE`

Purpose:

- immediate emotional closure

#### 2. Result hero

Contents:

- hop count
- short summary line

Better summary direction:

- `You found a clean line.`
- `You matched the shortest route.`
- `You got there in 3 moves.`

#### 3. Your route story

This section should not just list artists.
It should read like a connection trail.

Each step row should show:

- artist name
- connecting song or evidence
- optional explanation label

#### 4. Best route comparison

Only show when different from the player's route.

Purpose:

- comparison
- learning

Not purpose:

- shame

## 7. Screen: History Panel

### Goal

Support ritual, not distraction.

### Section order

1. Panel title
2. small summary stats
3. recent route cards

### Route card structure

- date
- start to target pairing
- hop result
- best result

### Visual rule

This panel should feel archival and collectible, not spreadsheet-like.

## 8. Screen: Help / How To Play

### Goal

Explain the loop in under 20 seconds.

### Section order

1. Title
2. one-sentence game definition
3. 3-step rule list
4. fairness note
5. close action

### Suggested content model

One-sentence definition:

- `Move from the start artist to the target through real music links.`

Three steps:

1. `Choose a connected artist.`
2. `WELA reveals why the move is real.`
3. `Reach the target in as few moves as you can.`

Fairness note:

- `If WELA cannot explain the link clearly, it should not count.`

## 9. Component Blueprint

## 9.1 `ChallengeHeader`

Responsibilities:

- wordmark
- mode badge
- date
- locale switch
- utility actions

## 9.2 `ChallengeMarquee`

Responsibilities:

- start artist
- target artist
- versus framing
- arcade marquee feeling

## 9.3 `RouteStatusPanel`

Responsibilities:

- current artist
- hops used
- route progress

## 9.4 `MoveRevealCard`

Responsibilities:

- last successful move
- evidence line
- explanation sentence
- reveal motion

## 9.5 `PlayableMoves`

Responsibilities:

- render clear move options
- downplay inactive states
- preserve tap friendliness

## 9.6 `RouteStory`

Responsibilities:

- list route path
- keep evidence visible
- support result recap

## 10. Copy Blueprint

### Primary label style

Use short all-caps system labels for:

- `DAILY`
- `TARGET`
- `CURRENT ROUTE`
- `LINK FOUND`
- `AVAILABLE MOVES`
- `ROUTE COMPLETE`

### Body copy style

Use warm, clear, minimal sentences.

Avoid:

- corporate voice
- overhype
- technical graph language

## 11. Motion Blueprint

### Successful move

Sequence:

1. selected card confirms
2. reveal card rises in
3. route chain extends
4. current artist updates

### Solved state

Sequence:

1. target artist locks in
2. solved banner appears
3. result hero fades up
4. route story becomes the main focus

## 12. Responsive Rules

### Mobile

- primary target
- stacked layout
- most intense visual density allowed

### Tablet and desktop

- keep central column
- allow more surrounding atmosphere
- do not let the app become too wide and empty

### Rule

The desktop experience should feel like a centered arcade station, not a stretched dashboard.

## 13. Accessibility Notes

- maintain readable contrast over glow effects
- do not rely on color alone to show state
- keep touch targets large
- explanations must remain readable at smaller widths
- motion should be brief and non-disorienting

## 14. Blueprint Outcome

If this blueprint is implemented well, the player journey becomes:

1. I understand the challenge
2. I see what I can do
3. My move gets explained
4. My path feels meaningful
5. The result feels worth sharing

That is the V1 target.
