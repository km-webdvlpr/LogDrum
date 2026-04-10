import type { ReactNode } from 'react'
import type { AppCopy } from '../content/copy'
import type { Artist, Challenge, PathStep, ResultReason, ScoreBreakdown } from '../types/wela'

interface ResultScreenProps {
  challenge: Challenge
  path: PathStep[]
  artists: Artist[]
  breakdown: ScoreBreakdown
  status: 'solved' | 'failed'
  resultReason: ResultReason | null
  solvedFromHistory?: boolean
  copy: AppCopy
  onReset: () => void
}

export function ResultScreen({
  challenge,
  path,
  artists,
  breakdown,
  status,
  resultReason,
  solvedFromHistory = false,
  copy,
  onReset,
}: ResultScreenProps) {
  const outcomeLabel = status === 'solved' ? copy.result.sessionSolved : copy.result.sessionFailed
  const reasonLabel =
    status === 'failed'
      ? resultReason === 'timer'
        ? copy.result.failByTimer
        : copy.result.failByLives
      : challenge.par > 0 && path.length < challenge.par
        ? `${copy.result.canonicalPath}: ${path.length}/${challenge.par}`
        : path.length === challenge.par
          ? copy.result.optimalMatched
          : copy.result.optimalWas(challenge.par)

  const routeNames = [challenge.startId, ...path.map((step) => step.toId)].map((id) =>
    artistName(artists, id)
  )
  const canonicalNames = challenge.canonicalPath.map((id) => artistName(artists, id))

  return (
    <section className="rounded-[4px] border border-[#8A6510] bg-[#0F1A0D] px-4 py-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#F5C842]">
            {status === 'solved' ? copy.cabinet.solved : copy.cabinet.failed}
          </p>
          <p className="mt-2 font-title text-2xl text-[#F0EAD0]">{outcomeLabel}</p>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#A89E80]">{reasonLabel}</p>
        </div>

        <div className="rounded-[4px] border border-[#8A6510] bg-[#1A1408] px-4 py-3 text-right">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#A89E80]">
            {copy.result.finalScoreLabel}
          </p>
          <p className="mt-2 font-score text-4xl tracking-[0.14em] text-[#F5C842]">
            {formatNumber(breakdown.finalScore)}
          </p>
        </div>
      </div>

      {solvedFromHistory && (
        <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-[#2EFF7A]">
          {copy.cabinet.savedState}
        </p>
      )}

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          <Panel label={copy.result.yourPath}>
            <p className="text-sm leading-7 text-[#F0EAD0]">{routeNames.join(' -> ')}</p>
          </Panel>

          <Panel label={copy.result.canonicalPath}>
            <p className="text-sm leading-7 text-[#F0EAD0]">{canonicalNames.join(' -> ')}</p>
          </Panel>
        </div>

        <Panel label={copy.result.routeComplete}>
          <BreakdownRow label={copy.result.timeMultiplierLabel} value={`x${breakdown.timeMultiplier.toFixed(2)}`} />
          <BreakdownRow label={copy.result.cluePenaltyLabel} value={`-${formatNumber(breakdown.cluePenalty)}`} />
          <BreakdownRow label={copy.result.lifePenaltyLabel} value={`-${formatNumber(breakdown.lifePenalty)}`} />
          <BreakdownRow label={copy.result.pureRunLabel} value={`+${formatNumber(breakdown.pureRunBonus)}`} />
          <BreakdownRow label={copy.result.parBonusLabel} value={`+${formatNumber(breakdown.parBonus)}`} />
        </Panel>
      </div>

      <div className="mt-5">
        <button
          onClick={onReset}
          className="rounded-[3px] border border-[#8A6510] bg-[#1A1408] px-4 py-3 font-mono text-[11px] uppercase tracking-[0.22em] text-[#F5C842] transition-colors hover:border-[#F5C842]"
        >
          {copy.result.replay}
        </button>
      </div>
    </section>
  )
}

function Panel({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section className="rounded-[4px] border border-[#1C3018] bg-[#0A0E09] px-4 py-4">
      <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-[#A89E80]">{label}</p>
      {children}
    </section>
  )
}

function BreakdownRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 py-1.5">
      <span className="text-sm text-[#A89E80]">{label}</span>
      <span className="font-mono text-sm uppercase tracking-[0.14em] text-[#F5C842]">{value}</span>
    </div>
  )
}

function artistName(artists: Artist[], id: string): string {
  return artists.find((artist) => artist.id === id)?.name ?? id
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value)
}
