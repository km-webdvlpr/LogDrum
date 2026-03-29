import { findPairsInRange, findShortestPath } from './graph'
import type { Graph, Challenge } from '../types/wela'

// Deterministic integer hash from a string
function hashString(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = Math.imul(31, h) + s.charCodeAt(i) | 0
  }
  return Math.abs(h)
}

// Linear congruential seeded random — returns [0, 1)
function seededRng(seed: number) {
  let s = seed
  return (): number => {
    s = (Math.imul(1664525, s) + 1013904223) | 0
    return (s >>> 0) / 0x100000000
  }
}

export function getSADateKey(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Africa/Johannesburg',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date()) // returns YYYY-MM-DD
}

export function getDailyChallenge(graph: Graph, dateKey?: string): Challenge {
  const date = dateKey ?? getSADateKey()

  // Prefer distance-2 or distance-3 pairs. Fall back to wider range if needed.
  let candidates = findPairsInRange(graph, 2, 3)
  if (candidates.length === 0) candidates = findPairsInRange(graph, 1, 5)
  if (candidates.length === 0) throw new Error('Graph has no valid challenge pairs')

  const rng = seededRng(hashString(date))
  const pick = candidates[Math.floor(rng() * candidates.length)]

  const path = findShortestPath(graph, pick.startId, pick.endId)!

  return {
    date,
    startId: pick.startId,
    destinationId: pick.endId,
    optimalLength: path.length - 1,
  }
}
