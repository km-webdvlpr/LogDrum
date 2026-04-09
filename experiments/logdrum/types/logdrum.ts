export type LogDrumClueKind = 'pulse' | 'scene' | 'credits' | 'reveal'

export type LogDrumClueMode = 'text' | 'audio'

export type LogDrumDifficulty = 'standard' | 'expert'

export interface LogDrumClue {
  kind: LogDrumClueKind
  mode: LogDrumClueMode
  label: string
  body: string
  cueRef?: string
}

export interface LogDrumSongProfile {
  id: string
  title: string
  aliases: string[]
  year: number
  artists: string[]
  primaryArtistId: string
  producerIds: string[]
  vocalistIds: string[]
  camps: string[]
  tags: string[]
  difficulty: LogDrumDifficulty
  editorialWeight: number
  clueLadder: [LogDrumClue, LogDrumClue, LogDrumClue, LogDrumClue]
  revealNote: string
}

export interface LogDrumRound {
  date: string
  answerId: string
  answer: LogDrumSongProfile
  maxClues: number
  clueLadder: readonly LogDrumClue[]
}

export type LogDrumGuessStatus =
  | 'empty'
  | 'unknown'
  | 'correct'
  | 'close'
  | 'miss'

export type LogDrumGuessSignal =
  | { type: 'shared-artist'; artistIds: string[] }
  | { type: 'shared-camp'; camps: string[] }
  | { type: 'shared-tag'; tags: string[] }
  | { type: 'same-era'; answerYear: number; guessYear: number }
  | { type: 'different-lane' }

export interface LogDrumGuessResult {
  input: string
  normalizedInput: string
  status: LogDrumGuessStatus
  guessedSong?: LogDrumSongProfile
  signals: LogDrumGuessSignal[]
}
