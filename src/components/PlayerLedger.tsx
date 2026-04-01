import type { Artist } from '../types/wela'
import type { HistoryEntry } from '../types/wela'
import type { AppCopy } from '../content/copy'

interface PlayerLedgerProps {
  artists: Artist[]
  entries: HistoryEntry[]
  copy: AppCopy
}

function artistName(artists: Artist[], id: string): string {
  return artists.find((artist) => artist.id === id)?.name ?? id
}

export function PlayerLedger({ artists, entries, copy }: PlayerLedgerProps) {
  const dailyEntries = entries.filter((entry) => entry.date !== 'practice')
  const optimalClears = dailyEntries.filter((entry) => entry.hops === entry.optimal).length
  const averageOverOptimal =
    dailyEntries.length > 0
      ? (dailyEntries.reduce((sum, entry) => sum + (entry.hops - entry.optimal), 0) / dailyEntries.length).toFixed(1)
      : '0.0'

  return (
    <section className="rounded-[28px] border border-ink/10 bg-white/70 px-4 py-4 shadow-glow backdrop-blur-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-display text-3xl tracking-[0.16em] text-gold">{copy.ledger.title}</p>
          <p className="mt-1 text-sm leading-6 text-ink/75">{copy.ledger.intro}</p>
        </div>
        <span className="rounded-full border border-gold/20 bg-gold/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-gold">
          {copy.ledger.routeCount(dailyEntries.length)}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        <LedgerStat label={copy.ledger.dailyRoutes} value={dailyEntries.length} />
        <LedgerStat label={copy.ledger.bestLines} value={optimalClears} />
        <LedgerStat label={copy.ledger.averageOverBest} value={averageOverOptimal} />
      </div>

      <div className="mt-4 rounded-[24px] border border-ink/10 bg-paper/80 p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-haze/70">{copy.ledger.recentRoutes}</p>
            <p className="text-sm text-haze/80">{copy.ledger.recentSubtitle}</p>
          </div>
        </div>

        {dailyEntries.length === 0 ? (
          <p className="text-sm leading-6 text-haze/80">{copy.ledger.empty}</p>
        ) : (
          <div className="space-y-3">
            {dailyEntries.slice(0, 6).map((entry) => (
              <div
                key={`${entry.date}-${entry.startId}-${entry.destinationId}`}
                className="rounded-3xl border border-ink/10 bg-white/70 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-haze/70">{entry.date}</p>
                    <p className="mt-1 text-base font-semibold text-ink">
                      {copy.ledger.routeBetween(
                        artistName(artists, entry.startId),
                        artistName(artists, entry.destinationId)
                      )}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gold tabular-nums">
                      {copy.ledger.hops(entry.hops)}
                    </p>
                    <p className="text-xs uppercase tracking-[0.18em] text-haze/70">
                      {copy.ledger.optimal(entry.optimal)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function LedgerStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-[22px] border border-ink/10 bg-paper/75 px-3 py-3">
      <p className="text-[10px] uppercase tracking-[0.22em] text-haze/70">{label}</p>
      <p className="mt-2 font-display text-2xl tracking-[0.08em] text-ink">{value}</p>
    </div>
  )
}
