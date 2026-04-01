import { findPairsInRange, findShortestPath, getSongsBetween } from './graph'
import type { Graph, Challenge } from '../types/wela'

interface ScoredCandidate {
  startId: string
  endId: string
  distance: number
  path: string[]
  score: number
}

const challengeCatalogCache = new WeakMap<Graph, ScoredCandidate[]>()

// Deterministic integer hash from a string
function hashString(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = Math.imul(31, h) + s.charCodeAt(i) | 0
  }
  return Math.abs(h)
}

// Linear congruential seeded random; returns [0, 1)
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
  const candidates = getChallengeCatalog(graph)
  if (candidates.length === 0) throw new Error('Graph has no valid challenge pairs')

  const rng = seededRng(hashString(date))
  const topSliceSize = Math.min(24, Math.max(8, Math.ceil(candidates.length * 0.18)))
  const pool = candidates.slice(0, topSliceSize)
  const pick = pool[Math.floor(rng() * pool.length)]
  const shouldFlip = rng() >= 0.5

  return {
    date,
    startId: shouldFlip ? pick.endId : pick.startId,
    destinationId: shouldFlip ? pick.startId : pick.endId,
    optimalLength: pick.distance,
  }
}

function getChallengeCatalog(graph: Graph): ScoredCandidate[] {
  const cached = challengeCatalogCache.get(graph)
  if (cached) return cached

  // Distance 2-3 feels deliberate without becoming a Wordle-style giveaway.
  let pairs = findPairsInRange(graph, 2, 3)
  if (pairs.length === 0) pairs = findPairsInRange(graph, 1, 5)

  const degreeByArtist = new Map(
    Array.from(graph.adjacency.entries()).map(([artistId, neighbors]) => [artistId, neighbors.size])
  )

  const catalog = pairs
    .map((pair) => {
      const path = findShortestPath(graph, pair.startId, pair.endId)
      if (!path) return null

      const internalNodes = path.slice(1, -1)
      const edgeSupport = sumEdgeSupport(graph, path)
      const internalHubPenalty = internalNodes.reduce(
        (sum, artistId) => sum + Math.max(0, (degreeByArtist.get(artistId) ?? 0) - 6),
        0
      )
      const endpointHubPenalty =
        Math.max(0, (degreeByArtist.get(pair.startId) ?? 0) - 8) +
        Math.max(0, (degreeByArtist.get(pair.endId) ?? 0) - 8)
      const degreeBalance = Math.abs(
        (degreeByArtist.get(pair.startId) ?? 0) - (degreeByArtist.get(pair.endId) ?? 0)
      )
      const distanceBonus = pair.distance === 3 ? 18 : pair.distance === 2 ? 10 : -6
      const score =
        distanceBonus +
        edgeSupport * 4 -
        internalHubPenalty * 5 -
        endpointHubPenalty * 2 -
        degreeBalance

      return {
        ...pair,
        path,
        score,
      }
    })
    .filter((candidate): candidate is ScoredCandidate => candidate !== null)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      if (b.distance !== a.distance) return b.distance - a.distance
      return `${a.startId}:${a.endId}`.localeCompare(`${b.startId}:${b.endId}`)
    })

  challengeCatalogCache.set(graph, catalog)
  return catalog
}

function sumEdgeSupport(graph: Graph, path: string[]): number {
  let total = 0

  for (let index = 0; index < path.length - 1; index++) {
    total += getSongsBetween(graph, path[index], path[index + 1]).length
  }

  return total
}
