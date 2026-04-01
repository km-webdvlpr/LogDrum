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
import type { Artist, Song, Challenge } from './types/wela'

const artists = artistsData as Artist[]
const songs = songsData as Song[]

type PanelView = 'rules' | 'ledger' | null

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
    <div className="min-h-screen bg-[#060606] text-white flex flex-col max-w-[480px] mx-auto relative overflow-hidden">
      <div className="noise-overlay" />
      <div className="stage-glow" />

      <main className="relative z-10 flex min-h-screen flex-col">
        <header className="flex items-center justify-between px-5 pt-5 pb-3 shrink-0">
          <div>
            <span className="font-display text-4xl tracking-[0.2em] text-gold">WELA</span>
            <p className="text-[10px] uppercase tracking-[0.18em] text-haze/35 mt-1">
              Amapiano artist connection game
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-[0.18em] text-haze/35">
              {practiceMode ? 'practice run' : 'daily route'}
            </p>
            <span className="text-haze/50 text-xs tabular-nums">
              {practiceMode ? 'fresh every 2 min' : dateKey}
            </span>
          </div>
        </header>

        <div className="px-5 pb-4 shrink-0 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-haze/35">
              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1">
                {practiceMode ? 'practice' : 'daily'}
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 tabular-nums">
                {state.path.length} hops used
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPanelView((current) => (current === 'rules' ? null : 'rules'))}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-haze/70 transition-colors hover:border-gold/30 hover:text-haze"
              >
                Rules
              </button>
              <button
                onClick={() => setPanelView((current) => (current === 'ledger' ? null : 'ledger'))}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-haze/70 transition-colors hover:border-gold/30 hover:text-haze"
              >
                Ledger
              </button>
            </div>
          </div>

          <p className="text-[10px] text-haze/35 uppercase tracking-[0.15em]">
            Bridge the connection
          </p>
          <div className="flex items-center gap-3 rounded-[28px] border border-white/8 bg-white/[0.03] px-3 py-3 shadow-glow backdrop-blur-sm">
            <div className="flex-1 rounded-2xl border border-gold/30 bg-gold/8 px-3 py-2.5 text-center">
              <p className="text-[10px] uppercase tracking-[0.15em] text-gold/50 mb-1">Start</p>
              <p className="text-gold text-sm font-semibold leading-tight">{startArtist.name}</p>
            </div>
            <span className="text-haze/25 text-lg shrink-0">{'->'}</span>
            <div className="flex-1 rounded-2xl border border-ember/40 bg-ember/8 px-3 py-2.5 text-center">
              <p className="text-[10px] uppercase tracking-[0.15em] text-ember/50 mb-1">Target</p>
              <p className="text-ember text-sm font-semibold leading-tight">{destArtist.name}</p>
            </div>
          </div>

          {isSolvedDaily ? (
            <ToastBanner
              tone="success"
              message="Today's daily route is already solved on this device. You can review it below or jump into practice mode."
            />
          ) : isDaily ? (
            <ToastBanner
              message="One shared-song route updates each day at midnight South Africa time. Practice mode stays separate from the daily result."
            />
          ) : (
            <ToastBanner
              message="Practice mode generates short fresh routes and never overwrites your saved daily result."
            />
          )}

          {panelView === 'rules' ? <HowToPlayPanel /> : null}
          {panelView === 'ledger' ? <PlayerLedger artists={artists} entries={visibleHistory} /> : null}
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
            onMove={makeMove}
          />
        )}

        {state.status === 'playing' && state.path.length > 0 && (
          <div className="shrink-0 px-5 pb-5 pt-1">
            <button
              onClick={undo}
              className="text-haze/30 text-xs hover:text-haze/60 transition-colors"
            >
              {'<- undo last hop'}
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