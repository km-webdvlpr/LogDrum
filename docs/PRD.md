# Product Requirements Document

## 1. Product Concept

LogDrum is a daily guessing game focused on Amapiano songs. Each day, the player is presented with one song puzzle selected from a curated local dataset. The player must identify the correct song title using a limited number of guesses and a clue system that reveals more information after each incorrect attempt.

## 2. Core Gameplay

Users attempt to guess the song title.

Rules:

- Maximum of 6 guesses per daily puzzle
- One additional clue unlocks after each incorrect guess
- Puzzle selection resets daily using the South Africa date
- Only titles contained in the local dataset may be submitted
- Once the puzzle is solved or attempts are exhausted, the user enters the end-state experience and cannot replay the same day

## 3. Clue System

Clues appear progressively in the following order:

1. `primary_artist`
2. `year`
3. `mood`
4. `featured_artists`
5. `title_length`
6. First letter of song title

The clue order is fixed to create a predictable rhythm of escalation. Early clues should feel broad and musically useful, while later clues provide more explicit structural help.

## 4. User Flow

Landing
-> daily puzzle loads
-> user submits guess
-> incorrect guess reveals next clue
-> repeat until solved or attempts exhausted
-> "After the Drop" result screen
-> locked "come back tomorrow" state for the rest of the day

## 5. End Screen

The post-game screen is named "After the Drop" and must display:

- Correct song title
- Primary artist
- Featured artists
- Year
- Mood
- Substyle
- Insight story

If `spotify_id` exists, the screen should render an official Spotify embed for discovery purposes only. The embed must not appear before puzzle completion.

## 6. Engagement Mechanics

- Daily challenge cadence
- Streak tracking
- Solved history persistence
- Shareable text-based result card using music-themed symbols instead of puzzle-clone iconography

## 7. Experience Requirements

- Strong original visual identity inspired by Johannesburg street energy
- Mobile-first responsive design
- Fast input flow with local autocomplete
- Clear feedback for incorrect, repeated, or invalid guesses
- Distinct end-state messaging for success, failure, and "come back tomorrow"
