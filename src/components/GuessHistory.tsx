import type { SongEntry } from '../types/game';
import { isCorrectGuess } from '../utils/puzzle';

interface GuessHistoryProps {
  guesses: string[];
  song: SongEntry;
}

export function GuessHistory({ guesses, song }: GuessHistoryProps) {
  return (
    <div className="rounded-[28px] border border-white/8 bg-black/25 p-4 sm:p-5">
      <div className="mb-3">
        <p className="font-display text-3xl uppercase tracking-[0.16em] text-gold">Setlist</p>
        <p className="text-xs uppercase tracking-[0.28em] text-haze/45">Today&apos;s attempts</p>
      </div>

      {guesses.length === 0 ? (
        <p className="rounded-3xl border border-dashed border-white/10 bg-black/20 p-5 text-sm text-haze/55">
          Nothing on deck yet. Your first guess starts the rhythm.
        </p>
      ) : (
        <div className="space-y-3">
          {guesses.map((guess, index) => {
            const correct = isCorrectGuess(guess, song);

            return (
              <div
                key={`${guess}-${index}`}
                className={`rounded-3xl border p-4 transition ${
                  correct
                    ? 'border-gold/35 bg-gold/10 text-haze'
                    : 'border-white/8 bg-white/[0.03] text-haze/80'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-haze/45">Guess {index + 1}</p>
                    <p className="mt-1 text-base font-medium">{guess}</p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs uppercase tracking-[0.2em] ${
                      correct ? 'bg-gold/20 text-gold' : 'bg-white/10 text-haze/60'
                    }`}
                  >
                    {correct ? 'Locked in' : 'Miss'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
