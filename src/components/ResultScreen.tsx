import { useState } from 'react'
import type { Challenge, PathStep, Artist } from '../types/wela'
import { findShortestPath, getSongsBetween } from '../engine/graph'
import type { Graph } from '../types/wela'
import { ToastBanner } from './ToastBanner'

interface ResultScreenProps {
  challenge: Challenge
  path: PathStep[]
  artists: Artist[]
  graph: Graph
  onPractice: () => void
  solvedFromHistory?: boolean
}

function artistName(artists: Artist[], id: string) {
  return artists.find((a) => a.id === id)?.name ?? id
}

function buildShareText(
  challenge: Challenge,
  path: PathStep[],
  artists: Artist[]
): string {
  const names = [
    artistName(artists, challenge.startId),
    ...path.map((s) => artistName(artists, s.toId)),
  ]
  const hops = path.length
  const optimal = challenge.optimalLength
  const hopLabel = hops === 1 ? '1 hop' : `${hops} hops`
  const optLabel = optimal === 1 ? '1 hop' : `${optimal} hops`
  const efficiency = hops === optimal ? 'optimal line' : `(optimal: ${optLabel})`

  return [
    `WELA | ${challenge.date}`,
    `${hopLabel} ${efficiency}`,
    names.join(' -> '),
    '#WELA #Amapiano',
  ].join('\n')
}

export function ResultScreen({
  challenge,
  path,
  artists,
  graph,
  onPractice,
  solvedFromHistory = false,
}: ResultScreenProps) {
  const [shareState, setShareState] = useState<'idle' | 'copied' | 'error'>('idle')

  const hops = path.length
  const optimal = challenge.optimalLength
  const isOptimal = hops === optimal
  const isDaily = challenge.date !== 'practice'
  const shareText = buildShareText(challenge, path, artists)

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
            message="This result was restored from local history for today's daily route."
          />
        )}
        {shareState === 'error' && (
          <ToastBanner
            tone="error"
            message="Share copy was blocked in this browser session. A manual copy version is available below."
          />
        )}
      </div>

      <div className="mb-6 text-center">
        <p className="font-display text-5xl tracking-widest text-gold mb-1">
          {hops}
          <span className="text-2xl text-gold/50 ml-1">
            {hops === 1 ? 'hop' : 'hops'}
          </span>
        </p>
        <p className="text-haze/50 text-sm">
          {isOptimal
            ? 'Optimal path matched.'
            : `Optimal was ${optimal} ${optimal === 1 ? 'hop' : 'hops'}`}
        </p>
      </div>

      <div className="mb-5">
        <p className="text-[10px] text-haze/40 uppercase tracking-widest mb-2">Your path</p>
        <PathDisplay path={path} artists={artists} challenge={challenge} />
      </div>

      {!isOptimal && optimalArtistPath.length > 0 && (
        <div className="mb-6">
          <p className="text-[10px] text-haze/40 uppercase tracking-widest mb-2">Optimal path</p>
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
          className="w-full rounded-2xl border border-gold/30 bg-gold/10 py-3.5 text-gold text-sm font-semibold tracking-wide active:scale-98 transition-transform"
        >
          {shareState === 'copied' ? 'Copied to clipboard' : 'Share result'}
        </button>

        <button
          onClick={onPractice}
          className="w-full rounded-2xl border border-white/8 bg-white/4 py-3 text-haze/70 text-sm active:scale-98 transition-transform"
        >
          {isDaily ? 'Open practice mode' : 'Return to daily route'}
        </button>

        {isDaily && (
          <p className="text-center text-haze/30 text-xs mt-1">
            New challenge tomorrow at midnight SA time
          </p>
        )}
      </div>

      {shareState === 'error' && (
        <div className="mt-4">
          <p className="text-[10px] text-haze/40 uppercase tracking-widest mb-2">
            Manual share text
          </p>
          <textarea
            readOnly
            value={shareText}
            className="w-full min-h-[112px] rounded-2xl border border-white/10 bg-white/4 p-3 text-xs leading-relaxed text-haze/75 resize-none"
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
    <div className="rounded-2xl border border-white/8 bg-white/3 p-4 space-y-2">
      {steps.map((id, i) => {
        const isLast = i === steps.length - 1
        const name = artistName(artists, id)
        const songTitle = i < path.length ? path[i].song.title : null
        return (
          <div key={i}>
            <div
              className={`text-sm font-medium ${isLast ? 'text-ember' : i === 0 ? 'text-gold/70' : 'text-white/80'}`}
            >
              {name}
            </div>
            {songTitle && (
              <div className="flex items-center gap-1.5 ml-3 mt-0.5">
                <span className="text-gold/30 text-xs">v</span>
                <span className="text-[10px] text-haze/40 italic">{songTitle}</span>
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
    <div className="rounded-2xl border border-white/5 bg-white/2 p-4 space-y-2 opacity-60">
      {artistIds.map((id, i) => {
        const isLast = i === artistIds.length - 1
        const name = artistName(artists, id)
        const nextId = artistIds[i + 1]
        const song = nextId ? getSongsBetween(graph, id, nextId)[0] ?? null : null
        return (
          <div key={i}>
            <div
              className={`text-sm font-medium ${isLast ? 'text-ember/60' : i === 0 ? 'text-gold/50' : 'text-white/60'}`}
            >
              {name}
            </div>
            {song && (
              <div className="flex items-center gap-1.5 ml-3 mt-0.5">
                <span className="text-gold/20 text-xs">v</span>
                <span className="text-[10px] text-haze/30 italic">{song.title}</span>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
