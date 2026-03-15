import { useMemo, useState } from 'react';
import { ClueList } from '../components/ClueList';
import { GuessHistory } from '../components/GuessHistory';
import { GuessInput } from '../components/GuessInput';
import { ResultCard } from '../components/ResultCard';
import { SpotifyEmbed } from '../components/SpotifyEmbed';
import { StatPill } from '../components/StatPill';
import { useDailyPuzzle } from '../hooks/useDailyPuzzle';
import { formatSouthAfricaDateLabel } from '../utils/date';
import { getUnlockedClues } from '../utils/puzzle';

export function DailyPuzzlePage() {
  const {
    dateKey,
    song,
    guesses,
    availableTitles,
    clueCount,
    isSolved,
    isComplete,
    canGuess,
    progress,
    submitGuess,
    copyShare
  } = useDailyPuzzle();

  const [shareNotice, setShareNotice] = useState<string | null>(null);
  const clueKeys = useMemo(() => getUnlockedClues(clueCount), [clueCount]);

  async function handleShare() {
    const copied = await copyShare();
    setShareNotice(copied ? 'Share card copied to clipboard.' : 'Clipboard access failed on this device.');
    window.setTimeout(() => setShareNotice(null), 2400);
    return copied;
  }

  const statusTitle = isComplete
    ? 'Come back tomorrow'
    : isSolved
      ? 'You found the groove'
      : "Tonight's crate is open";

  const statusCopy = isComplete
    ? 'The daily challenge is finished. South Africa time will unlock the next record.'
    : 'Make your guesses, unlock clues, and chase the drop before six attempts run out.';

  return (
    <section className="space-y-6">
      <div className="panel px-5 py-6 sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-haze/45">
              Song of the Day / {formatSouthAfricaDateLabel(dateKey)}
            </p>
            <h2 className="mt-3 font-display text-4xl uppercase tracking-[0.12em] text-haze sm:text-5xl">
              {statusTitle}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-haze/75">{statusCopy}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatPill label="Streak" value={progress.streak} />
            <StatPill label="Best" value={progress.bestStreak} />
            <StatPill label="Solved" value={progress.solvedHistory.length} />
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
        </div>
      ) : null}
    </section>
  );
}
