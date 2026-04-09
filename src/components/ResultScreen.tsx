import { useState } from 'react'
import type { Challenge, PathStep, Artist } from '../types/wela'
import { findShortestPath, getSongsBetween } from '../engine/graph'
import type { Graph } from '../types/wela'
import { ToastBanner } from './ToastBanner'
import type { AppCopy } from '../content/copy'
import { getMoveNarrative } from '../content/connectionCopy'

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

      <div className="mb-4 flex justify-center">
        <span className="rounded-full border border-ember/20 bg-ember/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-ember">
          {copy.result.routeComplete}
        </span>
      </div>

      <div className="mb-6 rounded-[30px] border border-ink/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.74),rgba(248,242,227,0.7))] px-4 py-5 text-center shadow-glow backdrop-blur-sm">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.24em] text-ember/75">
          WELA
        </p>
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
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-haze/70">
          {copy.result.yourPath}
        </p>
        <PathDisplay path={path} artists={artists} challenge={challenge} copy={copy} />
      </div>

      {!isOptimal && optimalArtistPath.length > 0 && (
        <div className="mb-6">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-haze/70">
            {copy.result.optimalPath}
          </p>
          <OptimalDisplay
            artistIds={optimalArtistPath}
            artists={artists}
            graph={graph}
            copy={copy}
          />
        </div>
      )}

      <div className="mt-6 flex flex-col gap-3">
        <button
          onClick={handleShare}
          className="w-full rounded-[22px] border border-gold/30 bg-[linear-gradient(135deg,rgba(183,142,30,0.18),rgba(255,255,255,0.84))] py-3.5 text-gold text-sm font-semibold tracking-wide active:scale-[0.98] transition-transform shadow-glow"
        >
          {shareState === 'copied' ? copy.result.copiedToClipboard : copy.result.shareResult}
        </button>

        <button
          onClick={onPractice}
          className="w-full rounded-[22px] border border-ink/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.86),rgba(248,242,227,0.8))] py-3 text-ink/80 text-sm active:scale-[0.98] transition-transform"
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
  copy,
}: {
  path: PathStep[]
  artists: Artist[]
  challenge: Challenge
  copy: AppCopy
}) {
  const steps = [challenge.startId, ...path.map((s) => s.toId)]

  return (
    <div className="space-y-2 rounded-[24px] border border-ink/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.8),rgba(248,242,227,0.74))] p-4 shadow-glow backdrop-blur-sm">
      {steps.map((id, i) => {
        const isLast = i === steps.length - 1
        const name = artistName(artists, id)
        const move = i < path.length ? path[i] : null
        const narrative = move ? getMoveNarrative(move, artists, copy) : null
        return (
          <div key={i}>
            <div
              className={`text-sm font-medium ${isLast ? 'text-ember' : i === 0 ? 'text-gold/80' : 'text-ink/85'}`}
            >
              {name}
            </div>
            {narrative && (
              <div className="ml-3 mt-1 rounded-2xl border border-ink/8 bg-white/60 px-3 py-2">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold/65">
                    {copy.moveReveal.evidenceLabel}
                  </span>
                  <span className="text-[11px] font-medium text-gold">{narrative.evidence}</span>
                </div>
                <p className="mt-1 text-[11px] leading-5 text-ink/72">{narrative.explanation}</p>
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
  copy,
}: {
  artistIds: string[]
  artists: Artist[]
  graph: Graph
  copy: AppCopy
}) {
  return (
    <div className="space-y-2 rounded-[24px] border border-ink/10 bg-paper/80 p-4 opacity-75">
      {artistIds.map((id, i) => {
        const isLast = i === artistIds.length - 1
        const name = artistName(artists, id)
        const nextId = artistIds[i + 1]
        const song = nextId ? getSongsBetween(graph, id, nextId)[0] ?? null : null
        const narrative =
          song && nextId
            ? getMoveNarrative(
                {
                  fromId: id,
                  toId: nextId,
                  song,
                },
                artists,
                copy
              )
            : null
        return (
          <div key={i}>
            <div
              className={`text-sm font-medium ${isLast ? 'text-ember/70' : i === 0 ? 'text-gold/70' : 'text-ink/70'}`}
            >
              {name}
            </div>
            {narrative && (
              <div className="ml-3 mt-1 rounded-2xl border border-ink/8 bg-white/55 px-3 py-2">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold/55">
                    {copy.moveReveal.evidenceLabel}
                  </span>
                  <span className="text-[11px] font-medium text-gold/80">{narrative.evidence}</span>
                </div>
                <p className="mt-1 text-[11px] leading-5 text-ink/68">{narrative.explanation}</p>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
