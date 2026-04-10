export interface Artist {
  id: string
  name: string
  era: [number, number]
}

export interface Song {
  id: string
  title: string
  year: number
  artists: string[] // Array of Artist IDs; every credited artist on the track.
}

export interface Graph {
  adjacency: Map<string, Set<string>>
  edges: Map<string, Song[]> // Key "idA:idB"; sorted pair, value is connecting songs.
}

export type DifficultyTier = 'groove' | 'amapiano' | 'deep-cuts'

export interface ChallengeClue {
  id: 1 | 2 | 3 | 4 | 5
  title: string
  body: string
  cost: number
}

export interface Challenge {
  id: string
  date: string
  startId: string
  destinationId: string
  optimalLength: number // shortest possible path in hops
  par: number
  canonicalPath: string[]
  timerSeconds: number
  difficulty: DifficultyTier
  clues: ChallengeClue[]
}

export interface PathStep {
  fromId: string
  toId: string
  song: Song
}

export type GameStatus = 'playing' | 'solved' | 'failed'

export type ResultReason = 'target' | 'lives' | 'timer'

export interface SessionFeedback {
  tone: 'idle' | 'success' | 'error' | 'info'
  title: string
  body: string
}

export interface ScoreBreakdown {
  liveScore: number
  finalScore: number
  timeMultiplier: number
  cluePenalty: number
  lifePenalty: number
  pureRunBonus: number
  parBonus: number
}

export interface GameState {
  status: GameStatus
  challenge: Challenge
  currentId: string
  path: PathStep[]
  score: number
  finalScore: number | null
  livesRemaining: number
  timerRemaining: number
  revealedClueIds: number[]
  paidClueIds: number[]
  feedback: SessionFeedback | null
  lastMove: PathStep | null
  resultReason: ResultReason | null
}

export type GameAction =
  | { type: 'MOVE'; toId: string; song: Song }
  | { type: 'INVALID_MOVE'; title: string; body: string }
  | { type: 'UNLOCK_CLUE'; clueId: number; cost: number; title: string; body: string }
  | { type: 'TICK' }
  | { type: 'RESET' }
  | { type: 'LOAD_CHALLENGE'; challenge: Challenge; savedEntry?: HistoryEntry | null }
  | {
      type: 'FINALIZE'
      status: Extract<GameStatus, 'solved' | 'failed'>
      reason: ResultReason
      finalScore: number
    }

export interface HistoryEntry {
  challengeId?: string
  date: string
  startId: string
  destinationId: string
  path: PathStep[]
  hops: number
  optimal: number
  timestamp: number
  status?: Extract<GameStatus, 'solved' | 'failed'>
  score?: number
  livesRemaining?: number
  timerRemaining?: number
  cluePenalty?: number
  paidClueIds?: number[]
  resultReason?: ResultReason
}
