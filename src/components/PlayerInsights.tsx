import type { PlayerHistoryRow } from '../types/backend';

interface PlayerInsightsProps {
  email: string | null;
  credits: number;
  streak: number;
  bestStreak: number;
  solvedCount: number;
  totalPlays: number;
  history: PlayerHistoryRow[];
  loading: boolean;
}

export function PlayerInsights({
  email,
  credits,
  streak,
  bestStreak,
  solvedCount,
  totalPlays,
  history,
  loading
}: PlayerInsightsProps) {
  return (
    <section className="panel overflow-hidden border-white/10 bg-zinc-950/70 px-5 py-6 sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-display text-3xl uppercase tracking-[0.16em] text-gold">Player Ledger</p>
          <p className="mt-2 text-sm leading-6 text-haze/70">
            Synced progress for your account, ready for repeat daily play and lightweight analytics.
          </p>
        </div>
        {email ? (
          <span className="rounded-full border border-gold/20 bg-gold/10 px-4 py-2 text-xs uppercase tracking-[0.18em] text-gold">
            {email}
          </span>
        ) : null}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <InsightStat label="Credits" value={credits} />
        <InsightStat label="Current streak" value={streak} />
        <InsightStat label="Best streak" value={bestStreak} />
        <InsightStat label="Solved" value={solvedCount} />
        <InsightStat label="Total plays" value={totalPlays} />
      </div>

      <div className="mt-5 rounded-[28px] border border-white/8 bg-black/25 p-4">
        <div className="mb-3">
          <p className="font-display text-2xl uppercase tracking-[0.12em] text-spice">Recent Nights</p>
          <p className="text-xs uppercase tracking-[0.24em] text-haze/45">Last solved and failed sessions</p>
        </div>

        {loading ? (
          <p className="text-sm text-haze/60">Loading player history...</p>
        ) : history.length === 0 ? (
          <p className="text-sm text-haze/60">No completed sessions yet. Solve today&apos;s challenge to start your ledger.</p>
        ) : (
          <div className="space-y-3">
            {history.map((entry) => (
              <div
                key={`${entry.challenge_date}-${entry.song_id}`}
                className="rounded-3xl border border-white/8 bg-white/[0.03] p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-haze/45">{entry.challenge_date}</p>
                    <p className="mt-1 text-base font-semibold text-haze">{entry.songs.song_title}</p>
                    <p className="text-sm text-haze/65">{entry.songs.primary_artist}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.18em] text-haze/70">
                      {entry.attempts_used} tries
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs uppercase tracking-[0.18em] ${
                        entry.won ? 'border border-gold/25 bg-gold/10 text-gold' : 'border border-white/10 bg-white/5 text-haze/60'
                      }`}
                    >
                      {entry.won ? 'Solved' : 'Missed'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function InsightStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-[24px] border border-white/8 bg-white/[0.04] px-4 py-4">
      <p className="text-xs uppercase tracking-[0.24em] text-haze/45">{label}</p>
      <p className="mt-2 font-display text-3xl uppercase tracking-[0.08em] text-haze">{value}</p>
    </div>
  );
}
