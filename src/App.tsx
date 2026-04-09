import { useEffect, useMemo, useRef, useState } from 'react'
import artistsData from './data/artists.json'
import songsData from './data/songs.json'
import { ArtistGrid } from './components/ArtistGrid'
import { MoveRevealCard } from './components/MoveRevealCard'
import { PlayerLedger } from './components/PlayerLedger'
import { ResultScreen } from './components/ResultScreen'
import { ToastBanner } from './components/ToastBanner'
import { getCopy, type Locale } from './content/copy'
import { getDailyChallenge, getSADateKey } from './engine/challenge'
import { buildGraph } from './engine/graph'
import { getTodayEntry, loadHistory } from './store/history'
import { useGame } from './store/useGame'
import type { Artist, Challenge, PathStep, Song } from './types/wela'

const artists = artistsData as Artist[]
const songs = songsData as Song[]

type PanelView = 'ledger' | null
const LOCALE_STORAGE_KEY = 'wela-locale'

function useSADate() {
  const [dateKey, setDateKey] = useState(getSADateKey)

  useEffect(() => {
    const id = setInterval(() => {
      const next = getSADateKey()
      setDateKey((prev) => (prev !== next ? next : prev))
    }, 60_000)

    return () => clearInterval(id)
  }, [])

  return dateKey
}

function artistName(list: Artist[], id: string) {
  return list.find((artist) => artist.id === id)?.name ?? id
}

function HowToPlayModal({
  copy,
  onClose,
}: {
  copy: ReturnType<typeof getCopy>
  onClose: () => void
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center px-3 pb-0 pt-10"
      style={{ background: 'rgba(22, 36, 28, 0.55)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-[480px] rounded-t-[32px] border border-ink/10 bg-paper px-6 pb-10 pt-6 shadow-glow animate-rise"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <p className="font-display text-3xl tracking-[0.18em] text-gold">{copy.rules.title}</p>
              <span className="rounded-full border border-gold/25 bg-gold/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-gold/75">
                {copy.rules.badge}
              </span>
            </div>
            <p className="text-sm leading-6 text-ink/78">{copy.rules.subtitle}</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-ink/10 bg-white/70 text-base text-haze/65 transition-colors hover:text-ink"
            aria-label={copy.header.rules}
          >
            x
          </button>
        </div>

        <div className="mb-5 rounded-[24px] border border-ink/10 bg-white/60 px-4 py-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-haze/70">
            {copy.header.routeLabel}
          </p>
          <p className="mt-2 text-sm leading-6 text-ink/80">{copy.header.routePromise}</p>
        </div>

        <div className="space-y-3">
          {copy.rules.steps.map((step, index) => (
            <div
              key={step}
              className="rounded-[24px] border border-ink/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.72),rgba(248,242,227,0.9))] px-4 py-4"
            >
              <div className="flex gap-3">
                <span className="mt-0.5 w-7 shrink-0 font-mono text-sm leading-none tracking-[0.18em] text-gold/65">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <p className="text-sm leading-6 text-ink/80">{step}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-[24px] border border-gold/15 bg-[linear-gradient(135deg,rgba(183,142,30,0.14),rgba(255,255,255,0.7),rgba(15,106,72,0.1))] px-4 py-4">
          <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-ink/60">
            {copy.rules.noteTitle}
          </p>
          <p className="text-sm leading-6 text-ink/78">{copy.rules.noteBody}</p>
        </div>
      </div>
    </div>
  )
}

function PathStack({
  startId,
  destId,
  path,
  artists: artistList,
  copy,
}: {
  startId: string
  destId: string
  path: PathStep[]
  artists: Artist[]
  copy: ReturnType<typeof getCopy>
}) {
  const steps = [startId, ...path.map((step) => step.toId)]
  const previousLength = useRef(0)
  const latestIndex = steps.length - 1

  useEffect(() => {
    previousLength.current = steps.length
  })

  return (
    <div className="px-5 pb-3 pt-1">
      {steps.map((id, index) => {
        const isStart = index === 0
        const isLast = index === latestIndex
        const isDestination = id === destId
        const song = index > 0 ? path[index - 1]?.song ?? null : null
        const isNew = index === latestIndex && latestIndex > previousLength.current - 1 && latestIndex > 0

        return (
          <div key={`${id}-${index}`} className={isNew ? 'animate-rise' : ''}>
            {song && (
              <div className="flex items-center gap-2.5 py-1 pl-5">
                <div
                  className="shrink-0"
                  style={{ width: 1, height: 16, background: 'rgba(183, 142, 30, 0.2)' }}
                />
                <span className="max-w-[220px] truncate text-[10px] italic leading-none text-haze/55">
                  {song.title}
                </span>
              </div>
            )}

            <div
              className={[
                'flex items-center gap-3 rounded-2xl border px-4 py-3',
                isDestination ? 'border-ember/40 bg-ember/8' : '',
                isStart && !isDestination ? 'border-gold/30 bg-gold/8' : '',
                !isStart && !isDestination ? 'border-ink/8 bg-white/55' : '',
              ].join(' ')}
            >
              <div
                className={[
                  'h-2 w-2 shrink-0 rounded-full',
                  isDestination ? 'bg-ember' : isStart ? 'bg-gold' : 'bg-gold/35',
                ].join(' ')}
              />
              <span
                className={[
                  'flex-1 text-sm font-semibold leading-tight',
                  isDestination ? 'text-ember' : isStart ? 'text-gold' : 'text-ink/85',
                ].join(' ')}
              >
                {artistName(artistList, id)}
              </span>
              {isStart && !isLast && (
                <span className="shrink-0 text-[9px] uppercase tracking-[0.16em] text-gold/45">
                  {copy.header.start}
                </span>
              )}
              {isDestination && isLast && (
                <span className="shrink-0 text-[9px] uppercase tracking-[0.16em] text-ember/55">
                  solved
                </span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function HopBadge({ count, copy }: { count: number; copy: ReturnType<typeof getCopy> }) {
  return (
    <div className="rounded-[28px] border border-ink/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.84),rgba(244,237,221,0.9))] px-4 py-4 shadow-glow backdrop-blur-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.22em] text-haze/70">
            {copy.grid.currentRoute}
          </p>
          <p className="text-base font-semibold text-gold">
            {count === 0 ? copy.grid.routeReady : copy.grid.routeLocked(count)}
          </p>
        </div>
        <div className="text-right">
          <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.22em] text-haze/70">
            {copy.grid.hopsLabel}
          </p>
          <p className="font-mono text-lg font-semibold text-ink/80 tabular-nums">{count}</p>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const graph = useMemo(() => buildGraph(artists, songs), [])
  const dateKey = useSADate()
  const [practiceMode, setPracticeMode] = useState(false)
  const [panelView, setPanelView] = useState<PanelView>(null)
  const [showRules, setShowRules] = useState(false)
  const [locale, setLocale] = useState<Locale>(getStoredLocale)
  const copy = useMemo(() => getCopy(locale), [locale])

  useEffect(() => {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale)
    document.documentElement.lang = locale
  }, [locale])

  const challenge = useMemo<Challenge>(() => {
    if (practiceMode) {
      const seed = String(Math.floor(Date.now() / 120_000))
      return { ...getDailyChallenge(graph, seed), date: 'practice' }
    }

    return getDailyChallenge(graph, dateKey)
  }, [graph, dateKey, practiceMode])

  const historyEntries = useMemo(
    () => loadHistory(),
    [stateKeyForHistory(challenge.date, practiceMode)]
  )

  const savedDailyEntry = useMemo(() => {
    if (practiceMode) return null

    const entry = historyEntries.find((item) => item.date === dateKey) ?? getTodayEntry(dateKey)
    if (!entry) return null

    const isSameChallenge =
      entry.startId === challenge.startId &&
      entry.destinationId === challenge.destinationId &&
      entry.date === challenge.date

    return isSameChallenge ? entry : null
  }, [practiceMode, historyEntries, dateKey, challenge])

  const { state, makeMove, undo } = useGame(graph, challenge, savedDailyEntry)

  const startArtist = artists.find((artist) => artist.id === challenge.startId)!
  const destinationArtist = artists.find((artist) => artist.id === challenge.destinationId)!
  const pathIds = new Set(state.path.map((step) => step.toId))
  const latestMove = state.path[state.path.length - 1] ?? null
  const isSolved = state.status === 'solved'
  const isDaily = !practiceMode
  const isSolvedDaily = isDaily && isSolved

  const visibleHistory = useMemo(() => {
    if (state.status !== 'solved' || challenge.date === 'practice') return historyEntries

    const alreadyStored = historyEntries.some((entry) => entry.date === challenge.date)
    if (alreadyStored) return historyEntries

    return [
      {
        date: challenge.date,
        startId: challenge.startId,
        destinationId: challenge.destinationId,
        path: state.path,
        hops: state.path.length,
        optimal: challenge.optimalLength,
        timestamp: Date.now(),
      },
      ...historyEntries,
    ]
  }, [state.status, state.path, challenge, historyEntries])

  return (
    <div className="relative mx-auto flex min-h-screen max-w-[480px] flex-col overflow-hidden bg-paper text-ink">
      <div className="noise-overlay" />
      <div className="stage-glow" />

      <main className="relative z-10 flex min-h-screen flex-col">
        <header className="shrink-0 px-5 pb-2 pt-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-4xl tracking-[0.2em] text-gold">WELA</span>
                <span
                  className={[
                    'rounded-full border px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em]',
                    practiceMode
                      ? 'border-ember/25 bg-ember/8 text-ember/65'
                      : 'border-gold/25 bg-gold/8 text-gold/65',
                  ].join(' ')}
                >
                  {practiceMode ? copy.header.practice : copy.header.daily}
                </span>
                {isSolved && (
                  <span className="text-[9px] uppercase tracking-[0.16em] text-ember/60">
                    solved
                  </span>
                )}
              </div>
              <p className="mt-2 max-w-[230px] text-sm leading-5 text-ink/72">{copy.header.tagline}</p>
            </div>

            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-0.5 rounded-full border border-ink/10 bg-white/70 p-0.5 shadow-glow">
                <button
                  onClick={() => setLocale('en')}
                  className={[
                    'rounded-full px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.15em] transition-colors',
                    locale === 'en'
                      ? 'border border-gold/25 bg-gold/15 text-ink'
                      : 'text-haze/60 hover:text-ink',
                  ].join(' ')}
                >
                  EN
                </button>
                <button
                  onClick={() => setLocale('zu')}
                  className={[
                    'rounded-full px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.15em] transition-colors',
                    locale === 'zu'
                      ? 'border border-ember/20 bg-ember/12 text-ember'
                      : 'text-haze/60 hover:text-ink',
                  ].join(' ')}
                >
                  ZU
                </button>
                <button
                  onClick={() => setLocale('xh')}
                  className={[
                    'rounded-full px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.15em] transition-colors',
                    locale === 'xh'
                      ? 'border border-ember/20 bg-ember/12 text-ember'
                      : 'text-haze/60 hover:text-ink',
                  ].join(' ')}
                >
                  XH
                </button>
              </div>

              <button
                onClick={() => setPanelView((current) => (current === 'ledger' ? null : 'ledger'))}
                className={[
                  'flex h-8 w-8 items-center justify-center rounded-full border text-xs transition-colors',
                  panelView === 'ledger'
                    ? 'border-ember/30 bg-ember/10 text-ember'
                    : 'border-ink/10 bg-white/70 text-haze/65 hover:text-ink',
                ].join(' ')}
                aria-label={copy.header.history}
              >
                H
              </button>

              <button
                onClick={() => setShowRules(true)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-ink/10 bg-white/70 text-xs text-haze/65 transition-colors hover:text-ink"
                aria-label={copy.header.rules}
              >
                ?
              </button>
            </div>
          </div>
        </header>

        <div className="shrink-0 px-5 pb-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] tabular-nums text-haze/50">
            {practiceMode ? copy.header.freshEveryTwoMinutes : dateKey}
          </p>
        </div>

        <div className="shrink-0 px-5 pb-4">
          <div className="relative overflow-hidden rounded-3xl border border-ink/8 bg-white/60 px-4 py-4 shadow-glow backdrop-blur-sm">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(183,142,30,0.55),transparent)]" />
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-haze/70">
                  {copy.header.routeLabel}
                </p>
                <p className="mt-1 text-xs text-haze/72">{copy.header.connectionPrompt}</p>
              </div>
              <div className="text-right">
                <span className="rounded-full border border-ink/10 bg-white/70 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-haze/75">
                  {copy.header.hopsUsed(state.path.length)}
                </span>
              </div>
            </div>

            <div className="flex items-stretch gap-3">
              <div className="flex-1 rounded-2xl border border-gold/40 bg-gold/10 px-4 py-3.5 text-center">
                <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.22em] text-gold/55">
                  {copy.header.start}
                </p>
                <p className="font-display text-xl leading-tight tracking-wide text-gold">
                  {startArtist.name}
                </p>
              </div>

              <div className="flex shrink-0 flex-col items-center justify-center gap-1">
                <div className="h-px w-4 bg-gold/20" />
                <div className="rounded-full border border-ink/8 bg-paper px-2 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-haze/55">
                  vs
                </div>
                <div className="h-px w-4 bg-ember/20" />
              </div>

              <div className="relative flex-1 rounded-2xl border border-ember/40 bg-[linear-gradient(180deg,rgba(15,106,72,0.12),rgba(255,255,255,0.85))] px-4 py-3.5 text-center shadow-[0_12px_26px_rgba(15,106,72,0.08)]">
                <div className="pointer-events-none absolute inset-x-5 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(15,106,72,0.5),transparent)]" />
                <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.22em] text-ember/60">
                  {copy.header.target}
                </p>
                <p className="font-display text-xl leading-tight tracking-wide text-ember">
                  {destinationArtist.name}
                </p>
              </div>
            </div>

            <p className="mt-4 text-sm leading-6 text-ink/76">{copy.header.routePromise}</p>
          </div>
        </div>

        <div className="shrink-0 px-5 pb-4">
          {isSolvedDaily ? (
            <ToastBanner tone="success" message={copy.toasts.solvedDaily} />
          ) : isDaily ? (
            <ToastBanner message={copy.toasts.dailyInfo} />
          ) : (
            <ToastBanner message={copy.toasts.practiceInfo} />
          )}
        </div>

        {panelView === 'ledger' && (
          <div className="shrink-0 animate-rise px-5 pb-4">
            <PlayerLedger artists={artists} entries={visibleHistory} copy={copy} />
          </div>
        )}

        {isSolved ? (
          <div className="shrink-0 px-5 pb-2">
            <ResultScreen
              challenge={challenge}
              path={state.path}
              artists={artists}
              graph={graph}
              copy={copy}
              onPractice={() => {
                setPracticeMode((current) => !current)
                setPanelView(null)
              }}
              solvedFromHistory={Boolean(savedDailyEntry && !practiceMode)}
            />
          </div>
        ) : (
          <>
            <div className="shrink-0 px-5 pb-4">
              <HopBadge count={state.path.length} copy={copy} />
            </div>

            <div className="shrink-0 px-5 pb-4">
              <MoveRevealCard artists={artists} copy={copy} step={latestMove} />
            </div>

            {state.path.length > 0 && (
              <PathStack
                startId={challenge.startId}
                destId={challenge.destinationId}
                path={state.path}
                artists={artists}
                copy={copy}
              />
            )}

            <ArtistGrid
              artists={artists}
              graph={graph}
              currentId={state.currentId}
              destinationId={challenge.destinationId}
              pathIds={pathIds}
              copy={copy}
              onMove={makeMove}
            />

            {state.path.length > 0 && (
              <div className="shrink-0 px-5 pb-5 pt-1">
                <button
                  onClick={undo}
                  className="text-xs text-haze/60 transition-colors hover:text-ember"
                >
                  {copy.header.undoLastHop}
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {showRules && <HowToPlayModal copy={copy} onClose={() => setShowRules(false)} />}
    </div>
  )
}

function stateKeyForHistory(challengeDate: string, practiceMode: boolean): string {
  return `${challengeDate}:${practiceMode}`
}

function getStoredLocale(): Locale {
  if (typeof window === 'undefined') return 'en'

  const saved = window.localStorage.getItem(LOCALE_STORAGE_KEY)
  return saved === 'zu' || saved === 'xh' ? saved : 'en'
}
