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

export interface Challenge {
  date: string
  startId: string
  destinationId: string
  optimalLength: number // shortest possible path in hops
}

export interface PathStep {
  fromId: string
  toId: string
  song: Song
}

export type GameStatus = 'playing' | 'solved'

export interface GameState {
  status: GameStatus
  challenge: Challenge
  currentId: string
  path: PathStep[]
}

export type GameAction =
  | { type: 'MOVE'; toId: string; song: Song }
  | { type: 'UNDO' }
  | { type: 'RESET' }
  | { type: 'LOAD_CHALLENGE'; challenge: Challenge; savedEntry?: HistoryEntry | null }

export interface HistoryEntry {
  date: string
  startId: string
  destinationId: string
  path: PathStep[]
  hops: number
  optimal: number
  timestamp: number
}