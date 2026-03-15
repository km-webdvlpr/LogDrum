import { useMemo, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { ClueList } from '../components/ClueList';
import { GuessHistory } from '../components/GuessHistory';
import { GuessInput } from '../components/GuessInput';
import { ResultCard } from '../components/ResultCard';
import { SpotifyEmbed } from '../components/SpotifyEmbed';
import { StatPill } from '../components/StatPill';
import { YouTubeEmbed } from '../components/YouTubeEmbed';
import { useDailyPuzzle } from '../hooks/useDailyPuzzle';
import { getUnlockedClues } from '../utils/puzzle';

interface DailyPuzzlePageProps {
  dateKey: string;
  dateLabel: string;
  user: User | null;
  backendEnabled: boolean;
}

export function DailyPuzzlePage({
  dateKey,
  dateLabel,
  user,
  backendEnabled
}: DailyPuzzlePageProps) {
  const {
    song,
    guesses,
    availableTitles,
    clueCount,
    isSolved,
    isComplete,
    canGuess,
    streak,
    bestStreak,
    credits,
    solvedCount,
    loading,
    challengeMissing,
    submitGuess,
    copyShare
  } = useDailyPuzzle({
    dateKey,
    user,
    backendEnabled
  });

  const [shareNotice, setShareNotice] = useState<string | null>(null);
  const clueKeys = useMemo(() => getUnlockedClues(clueCount), [clueCount]);

  async function handleShare() {
    const copied = await copyShare();
    setShareNotice(copied ? 'Share card copied to clipboard.' : 'Clipboard access failed on this device.');
    window.setTimeout(() => setShareNotice(null), 2400);
    return copied;
  }

  if (loading || !song) {
    return (
      <section className="panel px-5 py-8 sm:px-6">
        <p className="font-display text-4xl uppercase tracking-[0.14em] text-gold">Loading the drop</p>
        <p className="mt-3 text-sm leading-6 text-haze/70">
          Pulling today&apos;s challenge, player progress, and clue stack.
        </p>
      </section>
    );
  }

  const statusTitle = isComplete
    ? 'Come back tomorrow'
    : isSolved
      ? 'You found the groove'
      : "Tonight's crate is open";

  const statusCopy = challengeMissing
    ? 'The backend is live, but no admin challenge is scheduled for this RSA date yet. Local fallback is active.'
    : isComplete
      ? 'The daily challenge is finished. South Africa time will unlock the next record.'
      : 'Make your guesses, unlock clues, and chase the drop before six attempts run out.';

  return (
    <section className="space-y-6">
      <div className="panel px-5 py-6 sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-haze/45">Song of the Day / {dateLabel}</p>
            <h2 className="mt-3 font-display text-4xl uppercase tracking-[0.12em] text-haze sm:text-5xl">
              {statusTitle}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-haze/75">{statusCopy}</p>
            <p className="mt-2 text-xs uppercase tracking-[0.22em] text-haze/45">
              Mode / {user ? 'synced player' : 'guest'} / {backendEnabled ? 'backend-ready' : 'local-only'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            <StatPill label="Streak" value={streak} />
            <StatPill label="Best" value={bestStreak} />
            <StatPill label="Solved" value={solvedCount} />
            <StatPill label="Credits" value={credits} />
            <StatPill label="Guesses" value={guesses.length} />
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <div className="space-y-6">
          <GuessInput titles={availableTitles} disabled={!canGuess} onSubmit={submitGuess} />
          <GuessHistory guesses={guesses} song={song} />
        </div>
        <ClueList song={song} clueKeys={clueKeys} />
      </div>

      {isComplete ? (
        <div className="space-y-6">
          <ResultCard song={song} isSolved={isSolved} attempts={guesses.length} onShare={handleShare} />
          {shareNotice ? (
            <p className="rounded-2xl border border-gold/15 bg-gold/10 px-4 py-3 text-sm text-gold">{shareNotice}</p>
          ) : null}
          <SpotifyEmbed spotifyId={song.spotify_id} />
          <YouTubeEmbed youtubeUrl={song.youtube_url} />
        </div>
      ) : null}
    </section>
  );
}
