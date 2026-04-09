# WELA V1 Product Spec

## 1. Why This Spec Exists

The current WELA build proved that the product can look polished, feel branded, and run as a real daily challenge.

It also exposed the core problem clearly:

> the experience looks better than it feels to play

That does **not** mean the current version failed.
It means the prototype did its job.
It helped surface the real product issue before we over-invested in UI polish or feature sprawl.

This spec reframes WELA around a clearer player outcome, a stronger arcade identity, and a more satisfying moment-to-moment loop.

## 2. Product Diagnosis From The Current Build

### What the current build already gets right

- The product has a distinct name and aesthetic direction.
- The daily challenge structure is already understandable.
- The graph rule is grounded in real shared songs.
- Practice mode, local history, and deterministic daily generation are strong foundations.
- The current green/gold palette already hints at a premium identity.
- The interface already feels more intentional than a generic puzzle clone.

### What is not landing yet

- The player is asked to make moves before they feel meaning.
- The explanation for a move is too quiet relative to the act of moving.
- The game currently rewards route efficiency more strongly than discovery.
- The artist grid creates visual noise, which weakens excitement and focus.
- The UI reads as polished and tasteful, but not yet as a memorable arcade ritual.

### Core insight

The issue is not that the game is too simple.

The issue is that the game is not yet delivering enough **understanding per tap**.

WELA becomes satisfying when each move creates a small "wela" moment:

- "oh, that is the connection"
- "I did not know that"
- "that makes sense"

## 3. Product Vision

WELA is a daily music discovery arcade experience where players move from one artist to another through real, explainable connections.

The player should feel smart because they understood something new about music, not because they guessed correctly inside a hidden system.

## 4. Product Promise

Every valid move must teach something.
Every move must be explainable in one sentence.
Every challenge must feel fair.
Every session must feel stylish enough to remember.

## 5. Positioning

WELA is not just a trivia game and not just a graph puzzle.

It is:

- a daily music discovery ritual
- presented with modern retro-arcade energy
- grounded in local music culture
- lightweight enough to play quickly

It is not:

- a black-box recommendation engine
- a generic daily clone
- a pure speed or score-chasing arcade game
- a hard-core strategy game

## 6. North Star Outcome

When a player finishes a session, the ideal reaction is:

> "That was clean. I learned something."

Not:

> "I tapped around until it worked."

## 7. V1 Product Pillars

### Clarity

Players should always understand why a move worked.

### Trust

The system should never feel arbitrary.

### Discovery

The reward is insight, not just completion.

### Arcade Energy

The product should feel immediate, dramatic, and alive.

### Cultural Specificity

The music context should feel local, intentional, and rooted.

## 8. The Core V1 Loop

1. Open the daily challenge.
2. See the start artist and target artist presented as a dramatic head-to-head.
3. Choose a connected artist.
4. Receive immediate validation.
5. See the connection explanation revealed in a satisfying way.
6. Watch the path update visually.
7. Continue until the target is reached.
8. End on a recap that celebrates both completion and what was learned.

## 9. Core Game Rule

Every valid move must be explainable in one short sentence.

Examples:

- "Kabza De Small and DJ Maphorisa collaborated as Scorpion Kings."
- "Sha Sha featured on a track with Kabza De Small."
- "Artist A and Artist B share the track X."

If the system cannot explain the move simply, the move should not exist in V1.

## 10. Allowed Connection Rules For V1

Keep the rule set narrow and trustworthy.

### Allowed

- shared credited song
- direct collaboration
- feature relationship
- clearly credited producer-artist link
- clearly stated duo or group membership

### Avoid in V1

- recommendation-engine similarity
- same genre only
- same playlist only
- "fans also like"
- hidden graph logic with no player-facing explanation

## 11. What Makes The Current Version Less Fun

### The reward is too small

The connecting song appears, but as supporting detail rather than the main payoff.

### The grid asks for scanning before meaning

A wide artist board full of mostly unavailable nodes creates work before reward.

### The game currently centers optimization too early

Hop count and shortest-path comparison matter, but they should not overpower the learning experience.

### The emotional cadence is too flat

The current interface is elegant, but not theatrical enough to feel like a daily event.

## 12. What We Keep From The Current Build

The current build should be treated as a strong prototype, not as wasted work.

Preserve:

- deterministic daily challenge generation
- South Africa time zone logic
- practice mode
- local history
- graph-based shared-song evidence
- path display
- premium green/gold visual discipline

Refocus:

- how moves are explained
- how options are presented
- how the product rewards understanding
- how the arcade identity is expressed

## 13. Arcade Identity Direction

The arcade feeling should be a product differentiator, not a cosmetic layer.

### Desired feeling

WELA should feel like stepping up to a modern Afro-retro arcade machine:

- sharp
- glowing
- collectible
- dramatic
- tactile
- replayable

### Safe reference lane

Borrow from retro arcade **grammar**, not from protected IP.

Use:

- attract-mode confidence
- score-strip framing
- CRT glow
- scanline texture
- grid and radar motifs
- bold transition flashes
- short command-style labels
- "cabinet" framing around the challenge

Avoid:

- copying Nintendo or Atari logos
- copying cabinet shapes or exact HUD compositions
- copying iconic character silhouettes
- cloning sound cues, screens, or gameplay loops from any one classic title

### Best inspiration blend

The strongest inspiration lane for WELA is a blend of:

- readable path pressure from maze games
- stylish motion and confidence from 1980s racing/select screens
- attract-screen theatricality from coin-op arcade machines

The goal is not nostalgia for its own sake.
The goal is to create a strong ritualized frame for music discovery.

## 14. Visual Design Direction

### Palette

Primary palette:

- deep green for grounding
- luminous green for active state and success accents
- warm gold for reward, rarity, and target states
- dark charcoal for contrast
- soft cream or off-white for legible surfaces

### Palette role rules

- Green carries the brand.
- Gold marks moments that matter.
- Gold must stay selective so it still feels valuable.
- Surfaces must preserve readability above all else.

## 15. Typography Direction

WELA should not be fully mono.

A pure mono interface risks feeling too cold, too developer-like, and too rigid for a music product.

### Recommended system

- Primary type: modern sans-serif
- Accent type: mono for counters, timestamps, labels, puzzle IDs, and system states

### Recommended font pairings

- Space Grotesk + Space Mono
- IBM Plex Sans + IBM Plex Mono

### Preferred recommendation

Use **Space Grotesk** as the primary face and **Space Mono** as the accent.

Why:

- Space Grotesk feels contemporary and expressive.
- Space Mono gives the product the subtle machine / arcade tension you like.
- Together they create a modern technical feel without reducing warmth or readability.

## 16. UX Direction

### Core UX principle

The explanation is the main event.
Movement is secondary.

### V1 screen behavior

- The start and target artists should feel like a versus screen.
- Valid moves should be visually obvious.
- Each successful move should trigger a clear explanation card.
- The path should grow like a live chain or signal route.
- The result state should recap both the route and the meaning behind it.

### Recommended UI emphasis

Make these big:

- start artist
- target artist
- current artist
- move explanation
- path progress

Make these secondary:

- history
- optimization stats
- auxiliary controls

## 17. Recommended UX Changes For V1

### After a valid move

Show:

- connected artist selected
- song or collaboration evidence
- one-line explanation

This should feel like a reveal, not a footnote.

### During play

- reduce scanning burden
- prioritize "what can I do now?"
- visually distinguish active choices from dead space more strongly

### On invalid interaction

If the player attempts an unavailable move in a future search-based or free-entry flow, the response should explain why it does not count.

Example:

- "No direct credited link found between these two artists."

### At the end

Celebrate:

- route completion
- what the player learned
- how their route compared

The shortest route should matter, but it should not erase the discovery value of a non-optimal route.

## 18. Data Reality Check

Current local dataset snapshot:

- 25 artists
- 23 songs
- shortest path distances across the current graph are mostly 2 to 3 hops

This is important.

It means V1 fun cannot rely on graph size alone.
The experience has to win through:

- explanation quality
- pacing
- aesthetic differentiation
- daily ritual feel
- stronger content curation

As the catalog grows, replay value and route richness should improve.
But the core loop must already be satisfying at the current scale.

## 19. Language Strategy For V1

Localization should support both access and identity.

### Recommended V1 languages

- English
- isiZulu
- isiXhosa

### Why this set

- English supports broad usability and sharing.
- isiZulu supports strong local relevance and already fits the current direction.
- isiXhosa expands local inclusion without overextending the first release.

### V1 localization scope

Localize fully:

- navigation labels
- daily/practice states
- move explanations when available
- success and failure feedback
- onboarding copy

Localize later:

- deeper archive/editorial copy
- long-form educational context

## 20. Content Tone

WELA should sound:

- smart
- minimal
- musically literate
- local
- modern
- confident

Avoid:

- forced hype
- gamer slang
- startup jargon
- overly academic music language

## 21. V1 Screen Set

### Daily challenge screen

Shows:

- WELA identity
- date and mode
- start artist
- target artist
- current progress
- available next moves

### Move reveal state

Shows:

- selected artist
- why the move is valid
- visual confirmation of progress

### Result screen

Shows:

- total hops
- path recap
- best path comparison
- shareable summary
- next daily reset

### History screen

Shows:

- recent completed daily routes
- best vs actual summary

This remains secondary in V1.

## 22. Success Criteria For V1

V1 succeeds if players can say:

- "I understood why my move worked."
- "This feels fair."
- "This looks different from other daily games."
- "I learned something."
- "I want tomorrow's challenge."

## 23. Out Of Scope For V1

Do not add yet:

- AI-generated connection logic
- social multiplayer
- accounts
- global leaderboards
- streak economies
- open-ended sandbox mode
- too many move rule types
- trivia overload
- flashy animation that reduces readability

## 24. Final Product Thesis

WELA should feel like a premium, retro-charged music ritual.

The player is not here to guess inside a hidden system.
The player is here to uncover real artist relationships in a way that feels stylish, local, fair, and memorable.

If we protect that thesis, the product can become more than a nice-looking experiment.
It can become a genuinely differentiated daily format.
