import { useMemo, useEffect, useState } from 'react'
import artistsData from './data/artists.json'
import songsData from './data/songs.json'
import { buildGraph } from './engine/graph'
import { getDailyChallenge, getSADateKey } from './engine/challenge'
import { useGame } from './store/useGame'
import { getTodayEntry, loadHistory } from './store/history'
import { ArtistGrid } from './components/ArtistGrid'
import { PathTrail } from './components/PathTrail'
import { ResultScreen } from './components/ResultScreen'
import { ToastBanner } from './components/ToastBanner'
import { HowToPlayPanel } from './components/HowToPlayPanel'
import { PlayerLedger } from './components/PlayerLedger'
import { getCopy, type Locale } from './content/copy'
import type { Artist, Song, Challenge } from './types/wela'

const artists = artistsData as Artist[]
const songs = songsData as Song[]

type PanelView = 'rules' | 'ledger' | null
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

export default function App() {
  const graph = useMemo(() => buildGraph(artists, songs), [])
  const dateKey = useSADate()
  const [practiceMode, setPracticeMode] = useState(false)
  const [panelView, setPanelView] = useState<PanelView>('rules')
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

  const startArtist = artists.find((a) => a.id === challenge.startId)!
  const destArtist = artists.find((a) => a.id === challenge.destinationId)!
  const pathIds = new Set(state.path.map((s) => s.toId))
  const isDaily = !practiceMode
  const isSolvedDaily = isDaily && state.status === 'solved'

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
    <div className="min-h-screen bg-paper text-ink flex flex-col max-w-[480px] mx-auto relative overflow-hidden">
      <div className="noise-overlay" />
      <div className="stage-glow" />

      <main className="relative z-10 flex min-h-screen flex-col">
        <header className="flex items-center justify-between px-5 pt-5 pb-3 shrink-0">
          <div>
            <span className="font-display text-4xl tracking-[0.2em] text-gold">WELA</span>
            <p className="text-[10px] uppercase tracking-[0.18em] text-haze/80 mt-1">
              {copy.header.tagline}
            </p>
          </div>
          <div className="text-right space-y-2">
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-haze/80">
                {practiceMode ? copy.header.practiceRun : copy.header.dailyRoute}
              </p>
              <span className="text-haze/70 text-xs tabular-nums">
                {practiceMode ? copy.header.freshEveryTwoMinutes : dateKey}
              </span>
            </div>
            <div className="space-y-1">
              <p className="text-[9px] uppercase tracking-[0.18em] text-haze/65">
                {copy.header.languageToggle}
              </p>
              <div className="inline-flex items-center gap-1 rounded-full border border-ink/10 bg-white/70 p-1 shadow-glow backdrop-blur-sm">
                <button
                  onClick={() => setLocale('en')}
                  className={`rounded-full px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] transition-colors ${
                    locale === 'en'
                      ? 'bg-gold/15 text-ink border border-gold/30'
                      : 'text-haze/75'
                  }`}
                >
                  {copy.locale.english}
                </button>
                <button
                  onClick={() => setLocale('zu')}
                  className={`rounded-full px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] transition-colors ${
                    locale === 'zu'
                      ? 'bg-ember/12 text-ember border border-ember/25'
                      : 'text-haze/75'
                  }`}
                >
                  {copy.locale.zulu}
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="px-5 pb-4 shrink-0 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-haze/80">
              <span className="rounded-full border border-ink/10 bg-white/70 px-2.5 py-1 shadow-glow">
                {practiceMode ? copy.header.practice : copy.header.daily}
              </span>
              <span className="rounded-full border border-ink/10 bg-white/70 px-2.5 py-1 tabular-nums shadow-glow">
                {copy.header.hopsUsed(state.path.length)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPanelView((current) => (current === 'rules' ? null : 'rules'))}
                className={`rounded-full border px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] transition-colors ${
                  panelView === 'rules'
                    ? 'border-gold/35 bg-gold/12 text-ink'
                    : 'border-ink/10 bg-white/70 text-haze/75 hover:border-gold/25 hover:text-ink'
                }`}
              >
                {copy.header.rules}
              </button>
              <button
                onClick={() => setPanelView((current) => (current === 'ledger' ? null : 'ledger'))}
                className={`rounded-full border px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] transition-colors ${
                  panelView === 'ledger'
                    ? 'border-ember/25 bg-ember/10 text-ember'
                    : 'border-ink/10 bg-white/70 text-haze/75 hover:border-ember/20 hover:text-ink'
                }`}
              >
                {copy.header.history}
              </button>
            </div>
          </div>

          <p className="text-[10px] text-haze/80 uppercase tracking-[0.15em]">
            {copy.header.connectionPrompt}
          </p>
          <div className="flex items-center gap-3 rounded-[28px] border border-ink/10 bg-white/70 px-3 py-3 shadow-glow backdrop-blur-sm">
            <div className="flex-1 rounded-2xl border border-gold/30 bg-gold/10 px-3 py-2.5 text-center">
              <p className="text-[10px] uppercase tracking-[0.15em] text-gold/70 mb-1">
                {copy.header.start}
              </p>
              <p className="text-gold text-sm font-semibold leading-tight">{startArtist.name}</p>
            </div>
            <span className="text-haze/45 text-lg shrink-0">{'->'}</span>
            <div className="flex-1 rounded-2xl border border-ember/30 bg-ember/10 px-3 py-2.5 text-center">
              <p className="text-[10px] uppercase tracking-[0.15em] text-ember/70 mb-1">
                {copy.header.target}
              </p>
              <p className="text-ember text-sm font-semibold leading-tight">{destArtist.name}</p>
            </div>
          </div>

          {isSolvedDaily ? (
            <ToastBanner
              tone="success"
              message={copy.toasts.solvedDaily}
            />
          ) : isDaily ? (
            <ToastBanner
              message={copy.toasts.dailyInfo}
            />
          ) : (
            <ToastBanner
              message={copy.toasts.practiceInfo}
            />
          )}

          {panelView === 'rules' ? <HowToPlayPanel copy={copy} /> : null}
          {panelView === 'ledger' ? (
            <PlayerLedger artists={artists} entries={visibleHistory} copy={copy} />
          ) : null}
        </div>

        <div className="shrink-0">
          <PathTrail
            startId={challenge.startId}
            path={state.path}
            artists={artists}
            currentId={state.currentId}
          />
        </div>

        {state.status === 'solved' ? (
          <ResultScreen
            challenge={challenge}
            path={state.path}
            artists={artists}
            graph={graph}
            copy={copy}
            onPractice={() => setPracticeMode((p) => !p)}
            solvedFromHistory={Boolean(savedDailyEntry && !practiceMode)}
          />
        ) : (
          <ArtistGrid
            artists={artists}
            graph={graph}
            currentId={state.currentId}
            destinationId={challenge.destinationId}
            pathIds={pathIds}
            copy={copy}
            onMove={makeMove}
          />
        )}

        {state.status === 'playing' && state.path.length > 0 && (
          <div className="shrink-0 px-5 pb-5 pt-1">
            <button
              onClick={undo}
              className="text-haze/70 text-xs hover:text-ember transition-colors"
            >
              {copy.header.undoLastHop}
            </button>
          </div>
        )}
      </main>
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
