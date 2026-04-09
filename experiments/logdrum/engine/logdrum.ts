import { getSADateKey } from '../../../src/engine/challenge'
import type {
  LogDrumGuessResult,
  LogDrumGuessSignal,
  LogDrumRound,
  LogDrumSongProfile,
} from '../types/logdrum'

const ORIGIN_DATE = '2026-01-01'
const scheduleCache = new Map<string, string[]>()

function hashString(value: string): number {
  let hash = 0

  for (let index = 0; index < value.length; index++) {
    hash = (Math.imul(31, hash) + value.charCodeAt(index)) | 0
  }

  return Math.abs(hash)
}

function seededRng(seed: number) {
  let state = seed

  return () => {
    state = (Math.imul(1664525, state) + 1013904223) | 0
    return (state >>> 0) / 0x100000000
  }
}

export function normalizeGuess(input: string): string {
  return input.trim().toLowerCase().replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ').trim()
}

export function findSongByGuess(
  profiles: readonly LogDrumSongProfile[],
  guess: string
): LogDrumSongProfile | null {
  const normalized = normalizeGuess(guess)

  if (!normalized) return null

  return (
    profiles.find((profile) =>
      [profile.title, ...profile.aliases].some((term) => normalizeGuess(term) === normalized)
    ) ?? null
  )
}

export function getDailyLogDrumRound(
  profiles: readonly LogDrumSongProfile[],
  dateKey = getSADateKey()
): LogDrumRound {
  if (profiles.length === 0) {
    throw new Error('LogDrum catalog is empty')
  }

  const scheduledIds = buildSchedule(profiles, dateKey)
  const answerId = scheduledIds[scheduledIds.length - 1]
  const answer = profiles.find((profile) => profile.id === answerId)

  if (!answer) {
    throw new Error(`Missing scheduled LogDrum answer: ${answerId}`)
  }

  return {
    date: dateKey,
    answerId: answer.id,
    answer,
    maxClues: answer.clueLadder.length,
    clueLadder: answer.clueLadder,
  }
}

export function getUnlockedClues(round: LogDrumRound, clueCount: number) {
  return round.clueLadder.slice(0, Math.max(0, Math.min(clueCount, round.maxClues)))
}

export function evaluateLogDrumGuess(
  profiles: readonly LogDrumSongProfile[],
  answer: LogDrumSongProfile,
  guess: string
): LogDrumGuessResult {
  const normalizedInput = normalizeGuess(guess)

  if (!normalizedInput) {
    return {
      input: guess,
      normalizedInput,
      status: 'empty',
      signals: [],
    }
  }

  const guessedSong = findSongByGuess(profiles, guess)

  if (!guessedSong) {
    return {
      input: guess,
      normalizedInput,
      status: 'unknown',
      signals: [],
    }
  }

  if (guessedSong.id === answer.id) {
    return {
      input: guess,
      normalizedInput,
      status: 'correct',
      guessedSong,
      signals: [],
    }
  }

  const signals = buildGuessSignals(answer, guessedSong)

  return {
    input: guess,
    normalizedInput,
    status: signals.some((signal) => signal.type !== 'different-lane') ? 'close' : 'miss',
    guessedSong,
    signals,
  }
}

function buildGuessSignals(
  answer: LogDrumSongProfile,
  guessedSong: LogDrumSongProfile
): LogDrumGuessSignal[] {
  const signals: LogDrumGuessSignal[] = []

  const sharedArtists = intersect(answer.artists, guessedSong.artists)
  if (sharedArtists.length > 0) {
    signals.push({ type: 'shared-artist', artistIds: sharedArtists })
  }

  const sharedCamps = intersect(answer.camps, guessedSong.camps)
  if (sharedCamps.length > 0) {
    signals.push({ type: 'shared-camp', camps: sharedCamps })
  }

  if (Math.abs(answer.year - guessedSong.year) <= 1) {
    signals.push({
      type: 'same-era',
      answerYear: answer.year,
      guessYear: guessedSong.year,
    })
  }

  const sharedTags = intersect(answer.tags, guessedSong.tags)
  if (sharedTags.length > 0) {
    signals.push({ type: 'shared-tag', tags: sharedTags.slice(0, 2) })
  }

  if (signals.length === 0) {
    signals.push({ type: 'different-lane' })
  }

  return signals
}

function buildSchedule(
  profiles: readonly LogDrumSongProfile[],
  dateKey: string
): string[] {
  const cacheKey = `${profiles.map((profile) => profile.id).join('|')}:${dateKey}`
  const cached = scheduleCache.get(cacheKey)
  if (cached) return cached

  const targetOffset = Math.max(0, daysBetween(ORIGIN_DATE, dateKey))
  const schedule: string[] = []
  const cooldown = Math.min(10, Math.max(3, Math.floor(profiles.length / 2)))

  for (let dayOffset = 0; dayOffset <= targetOffset; dayOffset++) {
    const currentDate = addDaysToDateKey(ORIGIN_DATE, dayOffset)
    const rng = seededRng(hashString(currentDate))
    const recentIds = schedule.slice(-cooldown)
    const recentProfiles = profiles.filter((profile) => recentIds.includes(profile.id))
    let winner: LogDrumSongProfile | null = null
    let winnerScore = Number.NEGATIVE_INFINITY

    for (const profile of profiles) {
      const score = scoreCandidate(profile, recentProfiles, rng)
      if (score > winnerScore) {
        winner = profile
        winnerScore = score
      }
    }

    if (!winner) {
      throw new Error(`Failed to schedule LogDrum round for ${currentDate}`)
    }

    schedule.push(winner.id)
  }

  scheduleCache.set(cacheKey, schedule)
  return schedule
}

function scoreCandidate(
  candidate: LogDrumSongProfile,
  recentProfiles: readonly LogDrumSongProfile[],
  rng: () => number
): number {
  if (recentProfiles.some((profile) => profile.id === candidate.id)) {
    return Number.NEGATIVE_INFINITY
  }

  const lastTwo = recentProfiles.slice(-2)
  const samePrimaryArtistPenalty = lastTwo.some(
    (profile) => profile.primaryArtistId === candidate.primaryArtistId
  )
    ? 24
    : 0
  const sharedCampPenalty = lastTwo.some((profile) =>
    intersect(profile.camps, candidate.camps).length > 0
  )
    ? 14
    : 0
  const repeatedTagPenalty = lastTwo.some((profile) =>
    intersect(profile.tags, candidate.tags).length > 0
  )
    ? 6
    : 0
  const repeatedDifficultyPenalty = lastTwo.filter(
    (profile) => profile.difficulty === candidate.difficulty
  ).length * 4
  const randomness = rng() * 4

  // Strong editorial picks still win, but recent variety can overrule them.
  return (
    candidate.editorialWeight * 10 +
    randomness -
    samePrimaryArtistPenalty -
    sharedCampPenalty -
    repeatedTagPenalty -
    repeatedDifficultyPenalty
  )
}

function daysBetween(fromDateKey: string, toDateKey: string): number {
  const start = new Date(`${fromDateKey}T00:00:00Z`)
  const end = new Date(`${toDateKey}T00:00:00Z`)
  return Math.floor((end.getTime() - start.getTime()) / 86_400_000)
}

function addDaysToDateKey(dateKey: string, dayCount: number): string {
  const date = new Date(`${dateKey}T00:00:00Z`)
  date.setUTCDate(date.getUTCDate() + dayCount)
  return date.toISOString().slice(0, 10)
}

function intersect(a: readonly string[], b: readonly string[]): string[] {
  const set = new Set(b)
  return a.filter((value) => set.has(value))
}
