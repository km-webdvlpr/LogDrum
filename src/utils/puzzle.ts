import songs from '../data/amapianoSongs.json';
import type { SongEntry } from '../types/game';
import { daysSinceEpoch } from './date';

const clueOrder = [
  'primary_artist',
  'year',
  'mood',
  'featured_artists',
  'title_length',
  'first_letter'
] as const;

export type ClueKey = (typeof clueOrder)[number];

export function getSongs(): SongEntry[] {
  return songs as SongEntry[];
}

export function getDailySong(dateKey: string): SongEntry {
  const library = getSongs();
  const index = Math.abs(daysSinceEpoch(dateKey)) % library.length;
  return library[index];
}

export function normalizeTitle(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
    .toLowerCase();
}

export function isCorrectGuess(guess: string, song: SongEntry): boolean {
  return normalizeTitle(guess) === normalizeTitle(song.song_title);
}

export function getAvailableTitles(): string[] {
  return getSongs()
    .map((song) => song.song_title)
    .sort((a, b) => a.localeCompare(b));
}

export function getClueValue(song: SongEntry, clueKey: ClueKey): string {
  switch (clueKey) {
    case 'primary_artist':
      return song.primary_artist;
    case 'year':
      return String(song.year);
    case 'mood':
      return song.mood;
    case 'featured_artists':
      return song.featured_artists.length > 0 ? song.featured_artists.join(', ') : 'No featured artists listed';
    case 'title_length':
      return `${song.title_length} characters`;
    case 'first_letter':
      return song.song_title.charAt(0).toUpperCase();
  }
}

export function getUnlockedClues(wrongGuessCount: number): ClueKey[] {
  return clueOrder.slice(0, wrongGuessCount);
}

export function getShareText(dateKey: string, guesses: string[], solved: boolean): string {
  const pattern = guesses
    .map((_, index) => {
      const isLastGuess = index === guesses.length - 1;
      return solved && isLastGuess ? '♫' : '♩';
    })
    .join(' ');

  const score = solved ? `${guesses.length}/6` : 'X/6';

  return [`LogDrum ${dateKey}`, `After the Drop ${score}`, pattern || '○', '#LogDrum'].join('\n');
}
