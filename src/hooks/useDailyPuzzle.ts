import { useEffect, useMemo, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import type { StoredProgress, SongEntry } from '../types/game';
import type { ProfileRow, GameResultRow } from '../types/backend';
import { getAvailableTitles, getDailySong, getShareText, getUnlockedClues, isCorrectGuess, normalizeTitle } from '../utils/puzzle';
import { getStoredProgress, saveStoredProgress } from '../utils/storage';
import { fetchAttempts, fetchDailyChallenge, fetchProfile, fetchResult, fetchSongLibrary, finalizeResult, saveAttempt } from '../services/gameApi';

const MAX_GUESSES = 6;
const SOLVE_REWARD = 5;
const PARTICIPATION_REWARD = 1;

interface UseDailyPuzzleOptions {
  dateKey: string;
  user: User | null;
  backendEnabled: boolean;
}

interface UseDailyPuzzleResult {
  song: SongEntry | null;
  guesses: string[];
  availableTitles: string[];
  clueCount: number;
  isSolved: boolean;
  isComplete: boolean;
  canGuess: boolean;
  streak: number;
  bestStreak: number;
  credits: number;
  solvedCount: number;
  loading: boolean;
  usingBackend: boolean;
  challengeMissing: boolean;
  submitGuess: (guess: string) => Promise<{ accepted: boolean; message?: string }>;
  copyShare: () => Promise<boolean>;
}

export function useDailyPuzzle({
  dateKey,
  user,
  backendEnabled
}: UseDailyPuzzleOptions): UseDailyPuzzleResult {
  const [song, setSong] = useState<SongEntry | null>(null);
  const [availableTitles, setAvailableTitles] = useState<string[]>(() => getAvailableTitles());
  const [guesses, setGuesses] = useState<string[]>([]);
  const [localProgress, setLocalProgress] = useState<StoredProgress>(() => getStoredProgress());
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [remoteResult, setRemoteResult] = useState<GameResultRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [challengeMissing, setChallengeMissing] = useState(false);

  const usingBackend = backendEnabled;

  useEffect(() => {
    let cancelled = false;

    async function loadGameState() {
      setLoading(true);

      try {
        let nextSong: SongEntry | null = null;
        let nextTitles = getAvailableTitles();
        let nextChallengeMissing = false;

        if (backendEnabled) {
          try {
            const [library, challenge] = await Promise.all([
              fetchSongLibrary(),
              fetchDailyChallenge(dateKey)
            ]);

            if (library.length > 0) {
              nextTitles = library.map((entry) => entry.song_title).sort((a, b) => a.localeCompare(b));
            }

            if (challenge) {
              nextSong = challenge;
            } else {
              nextChallengeMissing = true;
            }
          } catch {
            nextSong = null;
          }
        }

        if (!nextSong) {
          nextSong = getDailySong(dateKey);
          nextChallengeMissing = false;
        }

        const latestLocal = getStoredProgress();

        if (!cancelled) {
          setSong(nextSong);
          setAvailableTitles(nextTitles);
          setLocalProgress(latestLocal);
          setChallengeMissing(nextChallengeMissing);
        }

        if (backendEnabled && user) {
          const [attempts, result, nextProfile] = await Promise.all([
            fetchAttempts(user.id, dateKey),
            fetchResult(user.id, dateKey),
            fetchProfile(user)
          ]);

          if (!cancelled) {
            setGuesses(attempts.map((attempt) => attempt.guess_text));
            setRemoteResult(result);
            setProfile(nextProfile);
          }
        } else if (!cancelled) {
          setGuesses(latestLocal.activeSession?.date === dateKey ? latestLocal.activeSession.guesses : []);
          setRemoteResult(null);
          setProfile(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadGameState();

    return () => {
      cancelled = true;
    };
  }, [backendEnabled, dateKey, user]);

  const isSolved = useMemo(() => {
    if (!song) {
      return false;
    }

    return remoteResult?.won ?? guesses.some((guess) => isCorrectGuess(guess, song));
  }, [guesses, remoteResult?.won, song]);

  const isComplete = Boolean(remoteResult) || isSolved || guesses.length >= MAX_GUESSES;
  const wrongGuessCount = isSolved ? guesses.length - 1 : guesses.length;
  const clueCount = Math.min(Math.max(wrongGuessCount, 0), MAX_GUESSES);

  useEffect(() => {
    if (!song || (backendEnabled && user)) {
      return;
    }

    const latest = getStoredProgress();
    const next = buildLocalProgress({
      latest,
      dateKey,
      guesses,
      isComplete,
      isSolved,
      songId: song.song_id
    });

    saveStoredProgress(next);
    setLocalProgress(next);
  }, [backendEnabled, dateKey, guesses, isComplete, isSolved, song, user]);

  async function submitGuess(rawGuess: string) {
    const guess = rawGuess.trim();

    if (!song) {
      return { accepted: false, message: 'The challenge is still loading.' };
    }

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

    const nextGuessIndex = guesses.length + 1;
    const nextIsCorrect = isCorrectGuess(guess, song);
    const nextGuesses = [...guesses, guess];
    setGuesses(nextGuesses);

    if (backendEnabled && user) {
      await saveAttempt({
        userId: user.id,
        dateKey,
        songId: song.song_id,
        guessText: guess,
        guessIndex: nextGuessIndex,
        isCorrect: nextIsCorrect
      });

      if (nextIsCorrect || nextGuesses.length >= MAX_GUESSES) {
        const creditsAwarded = nextIsCorrect ? SOLVE_REWARD : PARTICIPATION_REWARD;

        await finalizeResult({
          userId: user.id,
          dateKey,
          songId: song.song_id,
          won: nextIsCorrect,
          attemptsUsed: nextGuesses.length,
          creditsAwarded
        });

        const [nextProfile, nextResult] = await Promise.all([
          fetchProfile(user),
          fetchResult(user.id, dateKey)
        ]);

        setProfile(nextProfile);
        setRemoteResult(nextResult);
      }
    }

    return { accepted: true };
  }

  async function copyShare() {
    try {
      await navigator.clipboard.writeText(getShareText(dateKey, guesses, isSolved));
      return true;
    } catch {
      return false;
    }
  }

  return {
    song,
    guesses,
    availableTitles,
    clueCount: getUnlockedClues(clueCount).length,
    isSolved,
    isComplete,
    canGuess: !isComplete && guesses.length < MAX_GUESSES,
    streak: profile?.streak ?? localProgress.streak,
    bestStreak: profile?.best_streak ?? localProgress.bestStreak,
    credits: profile?.credits ?? localProgress.credits,
    solvedCount: profile?.total_solves ?? localProgress.solvedHistory.length,
    loading,
    usingBackend,
    challengeMissing,
    submitGuess,
    copyShare
  };
}

function buildLocalProgress({
  latest,
  dateKey,
  guesses,
  isComplete,
  isSolved,
  songId
}: {
  latest: StoredProgress;
  dateKey: string;
  guesses: string[];
  isComplete: boolean;
  isSolved: boolean;
  songId: string;
}) {
  const existingCompletion = latest.completionByDate[dateKey];
  const next: StoredProgress = {
    ...latest,
    lastPlayedDate: guesses.length > 0 ? dateKey : latest.lastPlayedDate,
    activeSession: {
      date: dateKey,
      guesses,
      isComplete
    }
  };

  if (!isComplete) {
    return next;
  }

  if (existingCompletion) {
    return {
      ...next,
      lastCompletedDate: dateKey
    };
  }

  const previousDate = latest.lastCompletedDate;
  const solvedHistory = isSolved ? Array.from(new Set([...latest.solvedHistory, songId])) : latest.solvedHistory;
  const streak =
    isSolved && previousDate !== dateKey
      ? previousDate && daysBetween(previousDate, dateKey) === 1
        ? latest.streak + 1
        : 1
      : isSolved
        ? latest.streak
        : 0;

  return {
    ...next,
    streak,
    bestStreak: Math.max(latest.bestStreak, streak),
    credits: latest.credits + (isSolved ? SOLVE_REWARD : PARTICIPATION_REWARD),
    solvedHistory,
    lastCompletedDate: dateKey,
    completionByDate: {
      ...latest.completionByDate,
      [dateKey]: {
        won: isSolved,
        attempts: guesses.length,
        songId
      }
    }
  };
}

function daysBetween(dateA: string, dateB: string) {
  const a = Date.parse(`${dateA}T00:00:00Z`);
  const b = Date.parse(`${dateB}T00:00:00Z`);
  return Math.round((b - a) / 86400000);
}
