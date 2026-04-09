import type { Artist, PathStep } from '../types/wela'
import type { AppCopy } from '../content/copy'
import { getMoveNarrative } from '../content/connectionCopy'

interface MoveRevealCardProps {
  artists: Artist[]
  copy: AppCopy
  step: PathStep | null
}

export function MoveRevealCard({ artists, copy, step }: MoveRevealCardProps) {
  if (!step) {
    return (
      <section className="rounded-[28px] border border-ink/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.84),rgba(244,237,221,0.92))] px-4 py-4 shadow-glow backdrop-blur-sm">
        <div className="mb-2 flex items-center justify-between gap-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-haze/70">
            {copy.moveReveal.emptyTitle}
          </p>
          <span className="rounded-full border border-ink/10 bg-white/70 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-haze/65">
            {copy.moveReveal.idleBadge}
          </span>
        </div>
        <p className="text-sm leading-6 text-ink/78">{copy.moveReveal.emptyBody}</p>
      </section>
    )
  }

  const narrative = getMoveNarrative(step, artists, copy)

  return (
    <section className="animate-rise rounded-[28px] border border-gold/20 bg-[linear-gradient(140deg,rgba(183,142,30,0.16),rgba(255,255,255,0.92)_36%,rgba(15,106,72,0.09)_100%)] px-4 py-4 shadow-glow backdrop-blur-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-gold/85">
          {copy.moveReveal.title}
        </p>
        <span className="rounded-full border border-gold/20 bg-white/70 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-ember">
          {copy.moveReveal.liveBadge}
        </span>
      </div>

      <div className="mb-3 flex items-center gap-2 text-base font-semibold leading-tight text-ink">
        <span className="truncate">{narrative.fromName}</span>
        <span className="font-mono text-sm text-gold/80">{'->'}</span>
        <span className="truncate text-ember">{narrative.toName}</span>
      </div>

      <div className="space-y-2 rounded-[22px] border border-white/60 bg-white/65 px-3.5 py-3">
        <div>
          <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-haze/65">
            {copy.moveReveal.evidenceLabel}
          </p>
          <p className="text-sm font-medium text-gold">{narrative.evidence}</p>
        </div>
        <div>
          <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-haze/65">
            {copy.moveReveal.explanationLabel}
          </p>
          <p className="text-sm leading-6 text-ink/80">{narrative.explanation}</p>
        </div>
      </div>
    </section>
  )
}
