import { useMemo, useEffect, useState } from 'react'
import artistsData from './data/artists.json'
import songsData from './data/songs.json'
import { buildGraph } from './engine/graph'
import { getDailyChallenge, getSADateKey } from './engine/challenge'
import { useGame } from './store/useGame'
import { ArtistGrid } from './components/ArtistGrid'
import { PathTrail } from './components/PathTrail'
import { ResultScreen } from './components/ResultScreen'
import type { Artist, Song, Challenge } from './types/wela'

const artists = artistsData as Artist[]
const songs = songsData as Song[]

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

  const challenge = useMemo<Challenge>(() => {
    if (practiceMode) {
      const seed = String(Math.floor(Date.now() / 120_000))
      return { ...getDailyChallenge(graph, seed), date: 'practice' }
    }
    return getDailyChallenge(graph, dateKey)
  }, [graph, dateKey, practiceMode])

  const { state, makeMove, undo } = useGame(graph, challenge)

  const startArtist = artists.find((a) => a.id === challenge.startId)!
  const destArtist = artists.find((a) => a.id === challenge.destinationId)!
  const pathIds = new Set(state.path.map((s) => s.toId))

  return (
    <div className="min-h-screen bg-[#060606] text-white flex flex-col max-w-[480px] mx-auto relative">
      <div className="noise-overlay" />

      <header className="flex items-center justify-between px-5 pt-5 pb-3 shrink-0">
        <span className="font-display text-4xl tracking-[0.2em] text-gold">WELA</span>
        <span className="text-haze/30 text-xs tabular-nums">
          {practiceMode ? 'practice' : dateKey}
        </span>
      </header>

      <div className="px-5 pb-4 shrink-0">
        <p className="text-[10px] text-haze/35 uppercase tracking-[0.15em] mb-2">
          Bridge the connection
        </p>
        <div className="flex items-center gap-3">
          <div className="flex-1 rounded-2xl border border-gold/30 bg-gold/8 px-3 py-2.5 text-center">
            <p className="text-gold text-sm font-semibold leading-tight">{startArtist.name}</p>
          </div>
          <span className="text-haze/25 text-lg shrink-0">→</span>
          <div className="flex-1 rounded-2xl border border-ember/40 bg-ember/8 px-3 py-2.5 text-center">
            <p className="text-ember text-sm font-semibold leading-tight">{destArtist.name}</p>
          </div>
        </div>
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
            ← undo last hop
          </button>
        </div>
      )}
    </div>
  )
}
