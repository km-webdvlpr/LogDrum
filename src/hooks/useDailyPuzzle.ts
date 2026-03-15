import { useEffect, useMemo, useState } from 'react';
import type { SongEntry, StoredProgress } from '../types/game';
import { getSouthAfricaDateKey } from '../utils/date';
import {
  getAvailableTitles,
  getDailySong,
  normalizeTitle,
  getShareText,
  getUnlockedClues,
  isCorrectGuess
} from '../utils/puzzle';
import { getStoredProgress, saveStoredProgress } from '../utils/storage';

const MAX_GUESSES = 6;

interface UseDailyPuzzleResult {
  dateKey: string;
  song: SongEntry;
  guesses: string[];
  availableTitles: string[];
  clueCount: number;
  isSolved: boolean;
  isComplete: boolean;
  canGuess: boolean;
  progress: StoredProgress;
  shareText: string;
  submitGuess: (guess: string) => { accepted: boolean; message?: string };
  copyShare: () => Promise<boolean>;
}

export function useDailyPuzzle(): UseDailyPuzzleResult {
  const dateKey = useMemo(() => getSouthAfricaDateKey(), []);
  const song = useMemo(() => getDailySong(dateKey), [dateKey]);
  const availableTitles = useMemo(() => getAvailableTitles(), []);

  const [progress, setProgress] = useState<StoredProgress>(() => getStoredProgress());
  const initialGuesses = progress.activeSession?.date === dateKey ? progress.activeSession.guesses : [];
  const completion = progress.completionByDate[dateKey];
  const [guesses, setGuesses] = useState<string[]>(initialGuesses);

  useEffect(() => {
    const latest = getStoredProgress();
    setProgress(latest);
    setGuesses(latest.activeSession?.date === dateKey ? latest.activeSession.guesses : []);
  }, [dateKey]);

  const isSolved = completion?.won ?? guesses.some((guess) => isCorrectGuess(guess, song));
  const isComplete = Boolean(completion) || isSolved || guesses.length >= MAX_GUESSES;
  const wrongGuessCount = isSolved ? guesses.length - 1 : guesses.length;
  const clueCount = Math.min(Math.max(wrongGuessCount, 0), MAX_GUESSES);
  const shareText = getShareText(dateKey, guesses, isSolved);

  useEffect(() => {
    const latest = getStoredProgress();
    const next: StoredProgress = {
      ...latest,
      lastPlayedDate: guesses.length > 0 ? dateKey : latest.lastPlayedDate,
      activeSession: {
        date: dateKey,
        guesses,
        isComplete
      }
    };

    if (isComplete) {
      const previousDate = latest.lastCompletedDate;
      const solvedHistory = isSolved
        ? Array.from(new Set([...latest.solvedHistory, song.song_id]))
        : latest.solvedHistory;

      const streak =
        isSolved && previousDate !== dateKey
          ? previousDate && daysBetween(previousDate, dateKey) === 1
            ? latest.streak + 1
            : 1
          : isSolved
            ? latest.streak
            : 0;

      next.streak = streak;
      next.bestStreak = Math.max(latest.bestStreak, streak);
      next.solvedHistory = solvedHistory;
      next.lastCompletedDate = dateKey;
      next.completionByDate = {
        ...latest.completionByDate,
        [dateKey]: {
          won: isSolved,
          attempts: guesses.length,
          songId: song.song_id
        }
      };
    }

    saveStoredProgress(next);
    setProgress(next);
  }, [dateKey, guesses, isComplete, isSolved, song.song_id]);

  function submitGuess(rawGuess: string) {
    const guess = rawGuess.trim();

    if (isComplete) {
      return { accepted: false, message: 'Today is wrapped. Come back tomorrow for a fresh drop.' };
    }

    if (!guess) {
      return { accepted: false, message: 'Pick a song title from the crate first.' };
    }

    const titleExists = availableTitles.some((title) => normalizeTitle(title) === normalizeTitle(guess));

    if (!titleExists) {
      return { accepted: false, message: 'Use a title from the local song list.' };
    }

    if (guesses.some((entry) => normalizeTitle(entry) === normalizeTitle(guess))) {
      return { accepted: false, message: 'You already spun that record today.' };
    }

    setGuesses((current) => [...current, guess]);
    return { accepted: true };
  }

  async function copyShare() {
    try {
      await navigator.clipboard.writeText(shareText);
      return true;
    } catch {
      return false;
    }
  }

  return {
    dateKey,
    song,
    guesses,
    availableTitles,
    clueCount: getUnlockedClues(clueCount).length,
    isSolved,
    isComplete,
    canGuess: !isComplete && guesses.length < MAX_GUESSES,
    progress,
    shareText,
    submitGuess,
    copyShare
  };
}

function daysBetween(dateA: string, dateB: string) {
  const a = Date.parse(`${dateA}T00:00:00Z`);
  const b = Date.parse(`${dateB}T00:00:00Z`);
  return Math.round((b - a) / 86400000);
}
