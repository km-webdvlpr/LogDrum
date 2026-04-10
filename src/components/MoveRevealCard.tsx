import type { Artist, PathStep, SessionFeedback } from '../types/wela'
import type { AppCopy } from '../content/copy'
import { getMoveNarrative } from '../content/connectionCopy'

interface MoveRevealCardProps {
  artists: Artist[]
  copy: AppCopy
  step: PathStep | null
  feedback: SessionFeedback | null
}

export function MoveRevealCard({ artists, copy, step, feedback }: MoveRevealCardProps) {
  const tone = feedback?.tone ?? 'idle'
  const palette =
    tone === 'success'
      ? {
          border: 'border-[#00B050]',
          tag: 'text-[#2EFF7A]',
          badge: 'border-[#00B050] bg-[#004D24] text-[#2EFF7A]',
        }
      : tone === 'error'
        ? {
            border: 'border-[#E03030]',
            tag: 'text-[#FF8080]',
            badge: 'border-[#E03030] bg-[#2A0E0E] text-[#FF8080]',
          }
        : {
            border: 'border-[#8A6510]',
            tag: 'text-[#F5C842]',
            badge: 'border-[#8A6510] bg-[#1A1408] text-[#F5C842]',
          }

  const narrative =
    step && tone !== 'error' ? getMoveNarrative(step, artists, copy) : null

  return (
    <section className={`rounded-[4px] border bg-[#0F1A0D] px-4 py-4 ${palette.border}`}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className={`font-mono text-[10px] uppercase tracking-[0.24em] ${palette.tag}`}>
          {narrative ? copy.moveReveal.title : copy.moveReveal.emptyTitle}
        </p>
        <span className={`rounded-[3px] border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] ${palette.badge}`}>
          {tone === 'success'
            ? copy.moveReveal.liveBadge
            : tone === 'error'
              ? copy.cabinet.failed
              : copy.moveReveal.idleBadge}
        </span>
      </div>

      {narrative ? (
        <>
          <div className="mb-3 flex items-center gap-2 text-base font-semibold leading-tight text-[#F0EAD0]">
            <span className="truncate">{narrative.fromName}</span>
            <span className="font-mono text-sm text-[#8A6510]">{'->'}</span>
            <span className="truncate text-[#2EFF7A]">{narrative.toName}</span>
          </div>

          <div className="space-y-2 rounded-[4px] border border-[#1C3018] bg-[#0A0E09] px-3.5 py-3">
            <div>
              <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[#A89E80]">
                {copy.moveReveal.evidenceLabel}
              </p>
              <p className="text-sm font-medium text-[#F5C842]">{narrative.evidence}</p>
            </div>
            <div>
              <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[#A89E80]">
                {copy.moveReveal.explanationLabel}
              </p>
              <p className="text-sm leading-6 text-[#F0EAD0]">{narrative.explanation}</p>
            </div>
          </div>
        </>
      ) : (
        <div className="rounded-[4px] border border-[#1C3018] bg-[#0A0E09] px-3.5 py-3">
          <p className="font-title text-base text-[#F0EAD0]">{feedback?.title ?? copy.moveReveal.emptyTitle}</p>
          <p className="mt-2 text-sm leading-6 text-[#A89E80]">
            {feedback?.body ?? copy.moveReveal.emptyBody}
          </p>
        </div>
      )}
    </section>
  )
}
