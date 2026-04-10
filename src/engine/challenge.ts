import { findPairsInRange, findShortestPath, getConnections, getSongsBetween } from './graph'
import type { Artist, Challenge, ChallengeClue, DifficultyTier, Graph } from '../types/wela'

interface ScoredCandidate {
  startId: string
  endId: string
  distance: number
  path: string[]
  score: number
}

const challengeCatalogCache = new WeakMap<Graph, ScoredCandidate[]>()

function hashString(value: string): number {
  let hash = 0
  for (let index = 0; index < value.length; index++) {
    hash = (Math.imul(31, hash) + value.charCodeAt(index)) | 0
  }
  return Math.abs(hash)
}

function seededRng(seed: number) {
  let state = seed
  return (): number => {
    state = (Math.imul(1664525, state) + 1013904223) | 0
    return (state >>> 0) / 0x100000000
  }
}

export function getSADateKey(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Africa/Johannesburg',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date())
}

export function getDailyChallenge(
  graph: Graph,
  artists: Artist[],
  dateKey?: string
): Challenge {
  const date = dateKey ?? getSADateKey()
  const candidates = getChallengeCatalog(graph)

  if (candidates.length === 0) {
    throw new Error('Graph has no valid challenge pairs')
  }

  const rng = seededRng(hashString(date))
  const topSliceSize = Math.min(24, Math.max(8, Math.ceil(candidates.length * 0.18)))
  const pool = candidates.slice(0, topSliceSize)
  const pick = pool[Math.floor(rng() * pool.length)]
  const shouldFlip = rng() >= 0.5
  const canonicalPath = shouldFlip ? [...pick.path].reverse() : pick.path

  return {
    id: `${date}:${pick.startId}:${pick.endId}`,
    date,
    startId: shouldFlip ? pick.endId : pick.startId,
    destinationId: shouldFlip ? pick.startId : pick.endId,
    optimalLength: pick.distance,
    par: pick.distance,
    canonicalPath,
    timerSeconds: getTimerSeconds(pick.distance),
    difficulty: getDifficulty(pick.distance),
    clues: buildCluesForPath(graph, artists, canonicalPath),
  }
}

function getChallengeCatalog(graph: Graph): ScoredCandidate[] {
  const cached = challengeCatalogCache.get(graph)
  if (cached) return cached

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
    .sort((left, right) => {
      if (right.score !== left.score) return right.score - left.score
      if (right.distance !== left.distance) return right.distance - left.distance
      return `${left.startId}:${left.endId}`.localeCompare(`${right.startId}:${right.endId}`)
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

function buildCluesForPath(
  graph: Graph,
  artists: Artist[],
  canonicalPath: string[]
): ChallengeClue[] {
  const startId = canonicalPath[0]
  const firstBridgeId = canonicalPath[1] ?? canonicalPath[canonicalPath.length - 1]
  const startArtist = artists.find((artist) => artist.id === startId)
  const bridgeArtist = artists.find((artist) => artist.id === firstBridgeId)
  const bridgeSong =
    getSongsBetween(graph, startId, firstBridgeId).sort((a, b) => a.year - b.year)[0] ?? null
  const shortlist = buildShortlist(graph, artists, startId, firstBridgeId)
  const initials = toInitials(bridgeArtist?.name ?? '')
  const eraCopy = bridgeArtist
    ? `${bridgeArtist.era[0]}-${bridgeArtist.era[1]}`
    : 'the current era'

  return [
    {
      id: 1,
      title: 'Zone',
      cost: 0,
      body: `The cleanest first bridge sits in the ${eraCopy} lane.`,
    },
    {
      id: 2,
      title: 'Mechanism',
      cost: 0,
      body: bridgeSong
        ? `Your next strong move shares "${bridgeSong.title}" with ${startArtist?.name ?? 'the current artist'}.`
        : 'The cleanest first bridge is a direct credited collaboration.',
    },
    {
      id: 3,
      title: 'Shortlist',
      cost: 200,
      body: shortlist.join(' | '),
    },
    {
      id: 4,
      title: 'Initials',
      cost: 350,
      body: initials || 'No initials available',
    },
    {
      id: 5,
      title: 'Bridge Reveal',
      cost: 500,
      body: bridgeArtist?.name ?? 'No bridge available',
    },
  ]
}

function buildShortlist(
  graph: Graph,
  artists: Artist[],
  startId: string,
  correctId: string
): string[] {
  const neighborIds = getConnections(graph, startId)
    .filter((artistId) => artistId !== correctId)
    .slice(0, 2)

  const artistNames = [correctId, ...neighborIds]
    .map((artistId) => artists.find((artist) => artist.id === artistId)?.name)
    .filter((name): name is string => Boolean(name))

  return artistNames.sort((left, right) => left.localeCompare(right))
}

function getTimerSeconds(distance: number): number {
  if (distance <= 2) return 360
  if (distance === 3) return 480
  return 600
}

function getDifficulty(distance: number): DifficultyTier {
  if (distance <= 2) return 'groove'
  if (distance === 3) return 'amapiano'
  return 'deep-cuts'
}

function toInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}
