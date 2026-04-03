import { useEffect, useMemo, useRef, useState } from 'react'
import artistsData from './data/artists.json'
import songsData from './data/songs.json'
import { ArtistGrid } from './components/ArtistGrid'
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
            <p className="font-display text-3xl tracking-[0.18em] text-gold">{copy.rules.title}</p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-haze/70">
              {copy.rules.subtitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-ink/10 bg-white/70 text-base text-haze/65 transition-colors hover:text-ink"
            aria-label={copy.header.rules}
          >
            x
          </button>
        </div>

        <div className="space-y-4">
          {copy.rules.steps.map((step, index) => (
            <div key={step} className="flex gap-3">
              <span className="mt-0.5 w-5 shrink-0 font-display text-lg leading-none text-gold/45">
                {String(index + 1).padStart(2, '0')}
              </span>
              <p className="text-sm leading-relaxed text-ink/80">{step}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-2xl border border-ink/8 bg-white/55 px-4 py-3">
          <p className="mb-1 text-xs font-semibold text-ink/65">{copy.rules.noteTitle}</p>
          <p className="text-xs leading-relaxed text-haze/75">{copy.rules.noteBody}</p>
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
}: {
  startId: string
  destId: string
  path: PathStep[]
  artists: Artist[]
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
                  start
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

function HopBadge({ count }: { count: number }) {
  if (count === 0) return null

  return (
    <div className="flex justify-center pb-2">
      <div className="inline-flex items-center gap-1.5 rounded-full border border-ink/8 bg-white/70 px-3 py-1 shadow-glow">
        <span className="font-display text-sm leading-none tracking-widest text-gold">{count}</span>
        <span className="text-[9px] uppercase tracking-[0.15em] text-haze/65">
          {count === 1 ? 'hop' : 'hops'}
        </span>
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
    document.documentElement.lang = locale === 'zu' ? 'zu' : 'en'
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
              <span className="font-display text-4xl tracking-[0.2em] text-gold">WELA</span>
              <div className="mt-1 flex items-center gap-2">
                <span
                  className={[
                    'rounded-full border px-2 py-0.5 text-[9px] uppercase tracking-[0.18em]',
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
            </div>

            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-0.5 rounded-full border border-ink/10 bg-white/70 p-0.5 shadow-glow">
                <button
                  onClick={() => setLocale('en')}
                  className={[
                    'rounded-full px-2.5 py-1 text-[9px] uppercase tracking-[0.15em] transition-colors',
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
                    'rounded-full px-2.5 py-1 text-[9px] uppercase tracking-[0.15em] transition-colors',
                    locale === 'zu'
                      ? 'border border-ember/20 bg-ember/12 text-ember'
                      : 'text-haze/60 hover:text-ink',
                  ].join(' ')}
                >
                  ZU
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
          <p className="text-[10px] tabular-nums text-haze/45">
            {practiceMode ? copy.header.freshEveryTwoMinutes : dateKey}
          </p>
        </div>

        <div className="shrink-0 px-5 pb-4">
          <div className="relative rounded-3xl border border-ink/8 bg-white/60 px-4 py-4 shadow-glow backdrop-blur-sm">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-[10px] uppercase tracking-[0.18em] text-haze/70">
                {copy.header.connectionPrompt}
              </p>
              <span className="rounded-full border border-ink/10 bg-white/70 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-haze/75">
                {copy.header.hopsUsed(state.path.length)}
              </span>
            </div>

            <div className="flex items-stretch gap-3">
              <div className="flex-1 rounded-2xl border border-gold/40 bg-gold/10 px-4 py-3.5 text-center">
                <p className="mb-2 text-[9px] uppercase tracking-[0.22em] text-gold/55">
                  {copy.header.start}
                </p>
                <p className="font-display text-xl leading-tight tracking-wide text-gold">
                  {startArtist.name}
                </p>
              </div>

              <div className="flex shrink-0 flex-col items-center justify-center gap-1">
                <div className="h-px w-4 bg-gold/20" />
                <div className="h-1.5 w-1.5 rounded-full border border-haze/25 bg-paper" />
                <div className="h-px w-4 bg-ember/20" />
              </div>

              <div className="flex-1 rounded-2xl border border-ember/40 bg-ember/8 px-4 py-3.5 text-center">
                <p className="mb-2 text-[9px] uppercase tracking-[0.22em] text-ember/55">
                  {copy.header.target}
                </p>
                <p className="font-display text-xl leading-tight tracking-wide text-ember">
                  {destinationArtist.name}
                </p>
              </div>
            </div>
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
          <>
            <PathStack
              startId={challenge.startId}
              destId={challenge.destinationId}
              path={state.path}
              artists={artists}
            />
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
          </>
        ) : (
          <>
            {state.path.length > 0 && (
              <>
                <PathStack
                  startId={challenge.startId}
                  destId={challenge.destinationId}
                  path={state.path}
                  artists={artists}
                />
                <HopBadge count={state.path.length} />
              </>
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
  return saved === 'zu' ? 'zu' : 'en'
}
