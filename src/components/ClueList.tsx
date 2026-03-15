import type { SongEntry } from '../types/game';
import { getClueValue, type ClueKey } from '../utils/puzzle';

const labels: Record<ClueKey, string> = {
  primary_artist: 'Primary artist',
  year: 'Year',
  mood: 'Mood',
  featured_artists: 'Featured artists',
  title_length: 'Title length',
  first_letter: 'First letter'
};

interface ClueListProps {
  song: SongEntry;
  clueKeys: ClueKey[];
}

export function ClueList({ song, clueKeys }: ClueListProps) {
  return (
    <div className="rounded-[28px] border border-white/8 bg-white/[0.03] p-4 sm:p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="font-display text-3xl uppercase tracking-[0.16em] text-gold">Clue Stack</p>
          <p className="text-xs uppercase tracking-[0.28em] text-haze/45">Every miss opens the crate</p>
        </div>
        <div className="rounded-full border border-gold/20 bg-gold/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-gold">
          {clueKeys.length}/6 open
        </div>
      </div>

      {clueKeys.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/10 bg-black/20 p-5 text-sm text-haze/55">
          No clues yet. Take the first swing and the first reveal drops.
        </div>
      ) : (
        <div className="grid gap-3">
          {clueKeys.map((clueKey, index) => (
            <div
              key={clueKey}
              className="animate-rise rounded-3xl border border-white/8 bg-black/30 p-4"
              style={{ animationDelay: `${index * 90}ms` }}
            >
              <p className="text-xs uppercase tracking-[0.28em] text-spice">{labels[clueKey]}</p>
              <p className="mt-2 text-base font-medium text-haze">{getClueValue(song, clueKey)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
