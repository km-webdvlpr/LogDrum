# LogDrum Hybrid Game Spec

Archived note:
This document captures an exploratory LogDrum direction that is not part of the active WELA V1 release. It is kept here for product history and future reference.

## Product North Star

LogDrum should feel like a daily Amapiano decoding ritual.

It is not trying to be:

- a generic Heardle clone
- a loud leaderboard product
- an XP farm

It is trying to reward a deeper kind of knowledge:

- rhythm recognition
- scene literacy
- producer and collaborator awareness
- era feel
- taste

## Core Round

Each daily round asks the player to identify one song.

The player does not start from full audio or full metadata.
They unlock the answer through a clue ladder that mixes sonic identity and contextual deduction.

## Hybrid Clue Ladder

Every daily song should ship with four clues in this order:

1. Pulse clue
   - the first reveal should feel sonic
   - this may be a short audio snippet later
   - while audio is not ready, it can be a tightly written rhythm description
2. Scene clue
   - where the track lives culturally
   - radio anthem, late-night sgija, crossover moment, vocal-piano, etc
3. Credits clue
   - producer, vocalist, collaborator orbit, or label/camp energy
4. Reveal clue
   - strongest fair nudge before the player gives up

This order matters.
The first clue should preserve mystery.
The last clue should still feel earned, not giveaway trivia.

## Guessing Rules

- The player can guess a song title after any clue.
- Wrong guesses should not only say no.
- Wrong guesses should return near-miss signals when possible.

Near-miss signals:

- shared artist
- shared camp or orbit
- same era
- shared style tags

This makes the game feel knowledgeable instead of binary.

## Song Of The Day Logic

Daily selection should optimize for:

- recognisable identity
- clue richness
- fair difficulty
- weekly variety
- cultural spread

Daily selection should avoid:

- repeating the same artist orbit too often
- choosing songs only because they are the biggest hits
- leaning too hard into celebrity crossover at the expense of Amapiano identity

The system should be deterministic by South Africa date, but it should still feel curated.

## Tone Rules

The product voice should feel calm, sharp, and musically literate.

Good:

- "same producer lane"
- "close era"
- "different corner of piano"

Bad:

- "epic fail"
- "XP earned"
- "top player"
- forced hype language

## Retention Rules

Allowed later:

- understated streaks
- archive
- tasteful share result

Not now:

- noisy global leaderboards
- grind economies
- social pressure loops

## Build Order

1. Lock the daily round data model.
2. Build deterministic selection logic.
3. Build near-miss guess feedback.
4. Prototype a round with text-first pulse clues.
5. Add audio later when the round design is already strong.

## UI Principle

Do not let unfinished UI drive gameplay decisions.

For now:

- keep regressions low
- keep the current interface stable enough
- let the game rules harden first

Later:

- redesign the UI around the hybrid ritual
- make clue unlocks tactile and percussive
- let the interface feel intentional rather than decorative
