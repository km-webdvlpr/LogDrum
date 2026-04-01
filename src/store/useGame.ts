import { useReducer, useEffect, useRef } from 'react'
import type { GameState, GameAction, Challenge, Song, HistoryEntry } from '../types/wela'
import type { Graph } from '../types/wela'
import { canConnect, getSongsBetween } from '../engine/graph'
import { saveResult } from './history'

function buildState(challenge: Challenge, savedEntry?: HistoryEntry | null): GameState {
  if (
    savedEntry &&
    savedEntry.date === challenge.date &&
    savedEntry.startId === challenge.startId &&
    savedEntry.destinationId === challenge.destinationId
  ) {
    const lastStep = savedEntry.path[savedEntry.path.length - 1]
    return {
      status: 'solved',
      challenge,
      currentId: lastStep?.toId ?? challenge.startId,
      path: savedEntry.path,
    }
  }

  return {
    status: 'playing',
    challenge,
    currentId: challenge.startId,
    path: [],
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
      const newPath = [...state.path, step]
      const solved = action.toId === state.challenge.destinationId
      return {
        ...state,
        status: solved ? 'solved' : 'playing',
        currentId: action.toId,
        path: newPath,
      }
    }

    case 'UNDO': {
      if (state.path.length === 0) return state
      const newPath = state.path.slice(0, -1)
      const newCurrentId =
        newPath.length > 0
          ? newPath[newPath.length - 1].toId
          : state.challenge.startId
      return {
        ...state,
        status: 'playing',
        currentId: newCurrentId,
        path: newPath,
      }
    }

    case 'RESET':
      return buildState(state.challenge)

    case 'LOAD_CHALLENGE':
      return buildState(action.challenge, action.savedEntry)

    default:
      return state
  }
}

export function useGame(
  graph: Graph,
  challenge: Challenge,
  savedEntry?: HistoryEntry | null
) {
  const [state, dispatch] = useReducer(
    reducer,
    { challenge, savedEntry },
    ({ challenge: initialChallenge, savedEntry: initialEntry }) =>
      buildState(initialChallenge, initialEntry)
  )

  // Reset state when challenge changes (daily date flip or practice toggle)
  const challengeKey = `${challenge.startId}:${challenge.destinationId}:${challenge.date}`
  const prevKeyRef = useRef(`${challengeKey}:${savedEntry?.timestamp ?? 'none'}`)
  useEffect(() => {
    const nextKey = `${challengeKey}:${savedEntry?.timestamp ?? 'none'}`
    if (prevKeyRef.current !== nextKey) {
      prevKeyRef.current = nextKey
      dispatch({ type: 'LOAD_CHALLENGE', challenge, savedEntry })
    }
  }, [challengeKey, challenge, savedEntry])

  // Persist when solved
  useEffect(() => {
    if (state.status === 'solved' && state.challenge.date !== 'practice') {
      saveResult({
        date: state.challenge.date,
        startId: state.challenge.startId,
        destinationId: state.challenge.destinationId,
        path: state.path,
        hops: state.path.length,
        optimal: state.challenge.optimalLength,
        timestamp: Date.now(),
      })
    }
  }, [state.status, state.challenge, state.path])

  function makeMove(toId: string) {
    if (state.status === 'solved') return
    if (!canConnect(graph, state.currentId, toId)) return
    const songs = getSongsBetween(graph, state.currentId, toId)
    if (songs.length === 0) return
    const song: Song = [...songs].sort((a, b) => a.year - b.year)[0]
    dispatch({ type: 'MOVE', toId, song })
  }

  function undo() {
    dispatch({ type: 'UNDO' })
  }

  function reset() {
    dispatch({ type: 'RESET' })
  }

  return { state, makeMove, undo, reset }
}