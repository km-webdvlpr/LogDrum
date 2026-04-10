import { useEffect, useMemo, useReducer, useRef } from 'react'
import { getSongsBetween } from '../engine/graph'
import {
  BASE_SCORE,
  LIFE_PENALTY,
  calculateFinalScore,
  getCluePenalty,
} from '../engine/scoring'
import { saveResult } from './history'
import type {
  Artist,
  Challenge,
  GameAction,
  GameState,
  Graph,
  HistoryEntry,
  Song,
} from '../types/wela'

function buildState(challenge: Challenge, savedEntry?: HistoryEntry | null): GameState {
  const isSavedFinalState =
    savedEntry &&
    savedEntry.date === challenge.date &&
    savedEntry.startId === challenge.startId &&
    savedEntry.destinationId === challenge.destinationId &&
    (savedEntry.status === 'solved' || savedEntry.status === 'failed')

  if (isSavedFinalState) {
    const lastStep = savedEntry.path[savedEntry.path.length - 1]
    return {
      status: savedEntry.status ?? 'solved',
      challenge,
      currentId: lastStep?.toId ?? challenge.startId,
      path: savedEntry.path,
      score: savedEntry.score ?? BASE_SCORE,
      finalScore: savedEntry.score ?? BASE_SCORE,
      livesRemaining: savedEntry.livesRemaining ?? 3,
      timerRemaining: savedEntry.timerRemaining ?? challenge.timerSeconds,
      revealedClueIds: savedEntry.paidClueIds ?? [],
      paidClueIds: savedEntry.paidClueIds ?? [],
      feedback: null,
      lastMove: lastStep ?? null,
      resultReason: savedEntry.resultReason ?? (savedEntry.status === 'failed' ? 'lives' : 'target'),
    }
  }

  return {
    status: 'playing',
    challenge,
    currentId: challenge.startId,
    path: [],
    score: BASE_SCORE,
    finalScore: null,
    livesRemaining: 3,
    timerRemaining: challenge.timerSeconds,
    revealedClueIds: [],
    paidClueIds: [],
    feedback: {
      tone: 'idle',
      title: 'Machine ready',
      body: 'Type a bridge artist to start your route.',
    },
    lastMove: null,
    resultReason: null,
  }
}

function reducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'MOVE': {
      const step = {
        fromId: state.currentId,
        toId: action.toId,
        song: action.song,
      }

      return {
        ...state,
        currentId: action.toId,
        path: [...state.path, step],
        lastMove: step,
        feedback: {
          tone: 'success',
          title: 'Link locked',
          body: `"${action.song.title}" validates this move.`,
        },
      }
    }

    case 'INVALID_MOVE': {
      return {
        ...state,
        livesRemaining: Math.max(0, state.livesRemaining - 1),
        score: Math.max(0, state.score - LIFE_PENALTY),
        feedback: {
          tone: 'error',
          title: action.title,
          body: action.body,
        },
      }
    }

    case 'UNLOCK_CLUE': {
      const alreadyRevealed = state.revealedClueIds.includes(action.clueId)
      if (alreadyRevealed) return state

      return {
        ...state,
        revealedClueIds: [...state.revealedClueIds, action.clueId].sort((a, b) => a - b),
        paidClueIds:
          action.cost > 0
            ? [...state.paidClueIds, action.clueId].sort((a, b) => a - b)
            : state.paidClueIds,
        score: Math.max(0, state.score - action.cost),
        feedback: {
          tone: action.cost > 0 ? 'info' : 'idle',
          title: action.title,
          body: action.body,
        },
      }
    }

    case 'TICK': {
      if (state.status !== 'playing' || state.timerRemaining <= 0) return state

      return {
        ...state,
        timerRemaining: Math.max(0, state.timerRemaining - 1),
      }
    }

    case 'RESET':
      return buildState(state.challenge)

    case 'LOAD_CHALLENGE':
      return buildState(action.challenge, action.savedEntry)

    case 'FINALIZE':
      return {
        ...state,
        status: action.status,
        finalScore: action.finalScore,
        resultReason: action.reason,
        feedback:
          action.status === 'solved'
            ? {
                tone: 'success',
                title: 'Route complete',
                body: 'The machine locked your final connection.',
              }
            : {
                tone: 'error',
                title: action.reason === 'timer' ? 'Time expired' : 'No lives left',
                body:
                  action.reason === 'timer'
                    ? 'The cabinet timed out before the route closed.'
                    : 'Three bad guesses ended this session.',
              },
      }

    default:
      return state
  }
}

export function useGame(
  graph: Graph,
  artists: Artist[],
  challenge: Challenge,
  savedEntry?: HistoryEntry | null
) {
  const [state, dispatch] = useReducer(
    reducer,
    { challenge, savedEntry },
    ({ challenge: initialChallenge, savedEntry: initialEntry }) =>
      buildState(initialChallenge, initialEntry)
  )

  const artistLookup = useMemo(() => buildArtistLookup(artists), [artists])

  const challengeKey = `${challenge.id}:${challenge.date}:${savedEntry?.timestamp ?? 'none'}`
  const previousChallengeKey = useRef(challengeKey)

  useEffect(() => {
    if (previousChallengeKey.current !== challengeKey) {
      previousChallengeKey.current = challengeKey
      dispatch({ type: 'LOAD_CHALLENGE', challenge, savedEntry })
    }
  }, [challengeKey, challenge, savedEntry])

  useEffect(() => {
    if (state.status !== 'playing') return

    const intervalId = window.setInterval(() => {
      dispatch({ type: 'TICK' })
    }, 1_000)

    return () => window.clearInterval(intervalId)
  }, [state.status])

  useEffect(() => {
    if (state.status !== 'playing' || state.timerRemaining > 0) return

    const breakdown = calculateFinalScore({
      challenge: state.challenge,
      liveScore: state.score,
      timerRemaining: 0,
      stepsTaken: state.path.length,
      paidClueIds: state.paidClueIds,
      livesRemaining: state.livesRemaining,
      solved: false,
    })

    dispatch({
      type: 'FINALIZE',
      status: 'failed',
      reason: 'timer',
      finalScore: breakdown.finalScore,
    })
  }, [state])

  useEffect(() => {
    if ((state.status !== 'solved' && state.status !== 'failed') || state.challenge.date === 'practice') {
      return
    }

    saveResult({
      challengeId: state.challenge.id,
      date: state.challenge.date,
      startId: state.challenge.startId,
      destinationId: state.challenge.destinationId,
      path: state.path,
      hops: state.path.length,
      optimal: state.challenge.optimalLength,
      timestamp: Date.now(),
      status: state.status,
      score: state.finalScore ?? state.score,
      livesRemaining: state.livesRemaining,
      timerRemaining: state.timerRemaining,
      cluePenalty: getCluePenalty(state.challenge, state.paidClueIds),
      paidClueIds: state.paidClueIds,
      resultReason: state.resultReason ?? (state.status === 'solved' ? 'target' : 'lives'),
    })
  }, [state])

  function submitArtist(rawValue: string) {
    if (state.status !== 'playing') return

    const normalized = normalizeArtistName(rawValue)
    if (!normalized) return

    const matchedArtist = artistLookup.get(normalized)

    if (!matchedArtist) {
      finalizeInvalidMove('Unknown artist', 'That artist is not available in the current cabinet.')
      return
    }

    if (matchedArtist.id === state.currentId) {
      finalizeInvalidMove('No movement', 'You are already standing on that artist.')
      return
    }

    const songs = getSongsBetween(graph, state.currentId, matchedArtist.id)

    if (songs.length === 0) {
      finalizeInvalidMove('Connection rejected', 'No documented credited link was found for that move.')
      return
    }

    const song: Song = [...songs].sort((a, b) => a.year - b.year)[0]
    const nextPathLength = state.path.length + 1
    const solved = matchedArtist.id === state.challenge.destinationId

    dispatch({ type: 'MOVE', toId: matchedArtist.id, song })

    if (solved) {
      const breakdown = calculateFinalScore({
        challenge: state.challenge,
        liveScore: state.score,
        timerRemaining: state.timerRemaining,
        stepsTaken: nextPathLength,
        paidClueIds: state.paidClueIds,
        livesRemaining: state.livesRemaining,
        solved: true,
      })

      dispatch({
        type: 'FINALIZE',
        status: 'solved',
        reason: 'target',
        finalScore: breakdown.finalScore,
      })
    }
  }

  function revealClue(clueId: number) {
    if (state.status !== 'playing') return
    if (state.revealedClueIds.includes(clueId)) return

    const expectedNextClue = state.revealedClueIds.length + 1
    if (clueId !== expectedNextClue) return

    const clue = state.challenge.clues.find((entry) => entry.id === clueId)
    if (!clue) return

    dispatch({
      type: 'UNLOCK_CLUE',
      clueId,
      cost: clue.cost,
      title: clue.cost > 0 ? 'Clue purchased' : 'Clue unlocked',
      body: clue.cost > 0 ? `${clue.title} cost ${clue.cost} points.` : `${clue.title} is now open.`,
    })
  }

  function reset() {
    dispatch({ type: 'RESET' })
  }

  function finalizeInvalidMove(title: string, body: string) {
    const nextLivesRemaining = Math.max(0, state.livesRemaining - 1)
    const nextScore = Math.max(0, state.score - LIFE_PENALTY)

    dispatch({ type: 'INVALID_MOVE', title, body })

    if (nextLivesRemaining === 0) {
      const breakdown = calculateFinalScore({
        challenge: state.challenge,
        liveScore: nextScore,
        timerRemaining: state.timerRemaining,
        stepsTaken: state.path.length,
        paidClueIds: state.paidClueIds,
        livesRemaining: nextLivesRemaining,
        solved: false,
      })

      dispatch({
        type: 'FINALIZE',
        status: 'failed',
        reason: 'lives',
        finalScore: breakdown.finalScore,
      })
    }
  }

  return {
    state,
    submitArtist,
    revealClue,
    reset,
  }
}

function buildArtistLookup(artists: Artist[]) {
  const lookup = new Map<string, Artist>()

  for (const artist of artists) {
    lookup.set(normalizeArtistName(artist.name), artist)
    lookup.set(normalizeArtistName(artist.id), artist)
  }

  return lookup
}

function normalizeArtistName(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[&/]/g, ' ')
    .replace(/[^\p{L}\p{N}\s]/gu, '')
    .replace(/\s+/g, ' ')
    .trim()
}
