import type { SongEntry } from '../types/game';

interface ResultCardProps {
  song: SongEntry;
  isSolved: boolean;
  attempts: number;
  onShare: () => Promise<boolean>;
}

export function ResultCard({ song, isSolved, attempts, onShare }: ResultCardProps) {
  const resultBadge = isSolved ? 'You caught the groove' : 'Tomorrow needs a reload';

  return (
    <section className="panel overflow-hidden border-gold/20 bg-zinc-950/80 px-5 py-6 sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-display text-4xl uppercase tracking-[0.14em] text-gold">After the Drop</p>
          <p className="mt-2 text-sm uppercase tracking-[0.22em] text-spice">{resultBadge}</p>
        </div>
        <button
          type="button"
          onClick={() => {
            void onShare();
          }}
          className="rounded-full border border-gold/30 bg-gold/10 px-4 py-2 text-xs uppercase tracking-[0.26em] text-gold transition hover:bg-gold/15"
        >
          Share card
        </button>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <InfoTile label="Correct song" value={song.song_title} highlight />
        <InfoTile label="Primary artist" value={song.primary_artist} />
        <InfoTile
          label="Featured artists"
          value={song.featured_artists.length ? song.featured_artists.join(', ') : 'No featured artists listed'}
        />
        <InfoTile label="Year" value={song.year} />
        <InfoTile label="Mood" value={song.mood} />
        <InfoTile label="Substyle" value={song.substyle} />
      </div>

      <div className="mt-5 rounded-[28px] border border-white/8 bg-white/[0.03] p-5">
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.22em] text-haze/60">
            Attempts {attempts}/6
          </span>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.22em] text-haze/60">
            Tempo {song.tempo_band}
          </span>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.22em] text-haze/60">
            Difficulty {song.difficulty}
          </span>
        </div>
        <p className="text-sm leading-7 text-haze/80">{song.insight_story}</p>
      </div>
    </section>
  );
}

function InfoTile({
  label,
  value,
  highlight = false
}: {
  label: string;
  value: string | number;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-[24px] border p-4 ${
        highlight ? 'border-gold/30 bg-gradient-to-br from-gold/15 to-ember/10' : 'border-white/8 bg-white/[0.03]'
      }`}
    >
      <p className="text-xs uppercase tracking-[0.28em] text-haze/45">{label}</p>
      <p className="mt-2 text-base font-semibold text-haze">{value}</p>
    </div>
  );
}
