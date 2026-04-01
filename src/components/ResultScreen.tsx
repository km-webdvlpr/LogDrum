import { useState } from 'react'
import type { Challenge, PathStep, Artist } from '../types/wela'
import { findShortestPath, getSongsBetween } from '../engine/graph'
import type { Graph } from '../types/wela'
import { ToastBanner } from './ToastBanner'
import type { AppCopy } from '../content/copy'

interface ResultScreenProps {
  challenge: Challenge
  path: PathStep[]
  artists: Artist[]
  graph: Graph
  copy: AppCopy
  onPractice: () => void
  solvedFromHistory?: boolean
}

function artistName(artists: Artist[], id: string) {
  return artists.find((a) => a.id === id)?.name ?? id
}

function buildShareText(
  challenge: Challenge,
  path: PathStep[],
  artists: Artist[],
  copy: AppCopy
): string {
  const names = [
    artistName(artists, challenge.startId),
    ...path.map((s) => artistName(artists, s.toId)),
  ]
  return copy.share.build(challenge.date, path.length, challenge.optimalLength, names)
}

export function ResultScreen({
  challenge,
  path,
  artists,
  graph,
  copy,
  onPractice,
  solvedFromHistory = false,
}: ResultScreenProps) {
  const [shareState, setShareState] = useState<'idle' | 'copied' | 'error'>('idle')

  const hops = path.length
  const optimal = challenge.optimalLength
  const isOptimal = hops === optimal
  const isDaily = challenge.date !== 'practice'
  const shareText = buildShareText(challenge, path, artists, copy)

  const optimalArtistPath =
    findShortestPath(graph, challenge.startId, challenge.destinationId) ?? []

  async function handleShare() {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable')
      await navigator.clipboard.writeText(shareText)
      setShareState('copied')
      setTimeout(() => setShareState('idle'), 2000)
    } catch {
      setShareState('error')
      setTimeout(() => setShareState('idle'), 2800)
    }
  }

  return (
    <div className="flex-1 px-4 pb-8 pt-2 animate-rise">
      <div className="mb-4 space-y-3">
        {solvedFromHistory && isDaily && (
          <ToastBanner
            tone="info"
            message={copy.toasts.restoredHistory}
          />
        )}
        {shareState === 'error' && (
          <ToastBanner
            tone="error"
            message={copy.toasts.shareError}
          />
        )}
      </div>

      <div className="mb-6 text-center">
        <p className="font-display text-5xl tracking-widest text-gold mb-1">
          {hops}
          <span className="text-2xl text-gold/50 ml-1">
            {copy.result.hopUnit(hops)}
          </span>
        </p>
        <p className="text-haze/80 text-sm">
          {isOptimal ? copy.result.optimalMatched : copy.result.optimalWas(optimal)}
        </p>
      </div>

      <div className="mb-5">
        <p className="text-[10px] text-haze/70 uppercase tracking-widest mb-2">
          {copy.result.yourPath}
        </p>
        <PathDisplay path={path} artists={artists} challenge={challenge} />
      </div>

      {!isOptimal && optimalArtistPath.length > 0 && (
        <div className="mb-6">
          <p className="text-[10px] text-haze/70 uppercase tracking-widest mb-2">
            {copy.result.optimalPath}
          </p>
          <OptimalDisplay
            artistIds={optimalArtistPath}
            artists={artists}
            graph={graph}
          />
        </div>
      )}

      <div className="flex flex-col gap-3 mt-6">
        <button
          onClick={handleShare}
          className="w-full rounded-2xl border border-gold/30 bg-gold/10 py-3.5 text-gold text-sm font-semibold tracking-wide active:scale-98 transition-transform shadow-glow"
        >
          {shareState === 'copied' ? copy.result.copiedToClipboard : copy.result.shareResult}
        </button>

        <button
          onClick={onPractice}
          className="w-full rounded-2xl border border-ink/10 bg-white/75 py-3 text-ink/80 text-sm active:scale-98 transition-transform"
        >
          {isDaily ? copy.result.openPractice : copy.result.returnToDaily}
        </button>

        {isDaily && (
          <p className="text-center text-haze/70 text-xs mt-1">{copy.result.nextDaily}</p>
        )}
      </div>

      {shareState === 'error' && (
        <div className="mt-4">
          <p className="text-[10px] text-haze/70 uppercase tracking-widest mb-2">
            {copy.result.manualShareText}
          </p>
          <textarea
            readOnly
            value={shareText}
            className="w-full min-h-[112px] rounded-2xl border border-ink/10 bg-white/75 p-3 text-xs leading-relaxed text-ink/80 resize-none"
          />
        </div>
      )}
    </div>
  )
}

function PathDisplay({
  path,
  artists,
  challenge,
}: {
  path: PathStep[]
  artists: Artist[]
  challenge: Challenge
}) {
  const steps = [challenge.startId, ...path.map((s) => s.toId)]

  return (
    <div className="rounded-2xl border border-ink/10 bg-white/75 p-4 space-y-2 shadow-glow">
      {steps.map((id, i) => {
        const isLast = i === steps.length - 1
        const name = artistName(artists, id)
        const songTitle = i < path.length ? path[i].song.title : null
        return (
          <div key={i}>
            <div
              className={`text-sm font-medium ${isLast ? 'text-ember' : i === 0 ? 'text-gold/80' : 'text-ink/85'}`}
            >
              {name}
            </div>
            {songTitle && (
              <div className="flex items-center gap-1.5 ml-3 mt-0.5">
                <span className="text-gold/30 text-xs">v</span>
                <span className="text-[10px] text-haze/80 italic">{songTitle}</span>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

function OptimalDisplay({
  artistIds,
  artists,
  graph,
}: {
  artistIds: string[]
  artists: Artist[]
  graph: Graph
}) {
  return (
    <div className="rounded-2xl border border-ink/10 bg-paper/80 p-4 space-y-2 opacity-75">
      {artistIds.map((id, i) => {
        const isLast = i === artistIds.length - 1
        const name = artistName(artists, id)
        const nextId = artistIds[i + 1]
        const song = nextId ? getSongsBetween(graph, id, nextId)[0] ?? null : null
        return (
          <div key={i}>
            <div
              className={`text-sm font-medium ${isLast ? 'text-ember/70' : i === 0 ? 'text-gold/70' : 'text-ink/70'}`}
            >
              {name}
            </div>
            {song && (
              <div className="flex items-center gap-1.5 ml-3 mt-0.5">
                <span className="text-gold/20 text-xs">v</span>
                <span className="text-[10px] text-haze/70 italic">{song.title}</span>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
