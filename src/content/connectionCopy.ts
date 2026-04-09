import type { Artist, PathStep } from '../types/wela'
import type { AppCopy } from './copy'

export function getArtistName(artists: Artist[], id: string): string {
  return artists.find((artist) => artist.id === id)?.name ?? id
}

export function getMoveNarrative(step: PathStep, artists: Artist[], copy: AppCopy) {
  const fromName = getArtistName(artists, step.fromId)
  const toName = getArtistName(artists, step.toId)

  return {
    fromName,
    toName,
    evidence: copy.moveReveal.evidence(step.song.title, step.song.year),
    explanation: copy.moveReveal.explanation(fromName, toName, step.song.title, step.song.year),
  }
}
