# Product Requirements Document

## 1. Product Concept

WELA is a daily Amapiano artist-connection game. The player starts at one artist and must reach another by moving only through valid shared-song connections.

The product should feel fast, culturally grounded, and easy to understand in seconds, while still rewarding knowledge of the scene and its collaborations.

## 2. Core Gameplay

Users solve a route between two artists.

Rules:

- One daily challenge is generated per South Africa date
- The player begins at a start artist and aims for a destination artist
- A move is valid only when the selected artist shares at least one song with the current artist
- The path is measured in hops
- The challenge is solved when the destination artist is reached
- The result should compare the player's route with the optimal route

## 3. Daily Challenge System

The challenge selection must:

1. Use the `Africa/Johannesburg` time zone
2. Be deterministic for a given date
3. Prefer routes that are interesting but still solvable quickly
4. Produce the same challenge for all players on the same day

The daily challenge is the main mode. Practice mode may generate additional short-form routes without affecting daily history.

## 4. User Flow

Landing
-> daily challenge loads
-> player sees start and destination artists
-> player taps a valid connected artist
-> the path trail updates with the linking song
-> player continues until the destination is reached
-> results screen shows hop count and optimal path comparison
-> player may optionally enter practice mode

## 5. Result Experience

The result screen must display:

- Player hop count
- Whether the solution matched the optimal path
- The player's route
- The optimal route when the player was not optimal
- A shareable result summary
- Clear messaging that the next daily challenge resets at midnight South Africa time

## 6. Persistence

- Daily solve history should be stored locally
- Practice sessions should not overwrite the daily challenge history
- Reloading should not require an account or backend

## 7. Experience Requirements

- Mobile-first responsive design
- Strong visual identity tied to Amapiano energy and nightlife culture
- Fast tap-based interaction
- Clear distinction between current position, valid moves, visited nodes, and destination
- Lightweight onboarding through interface clarity rather than long instructions