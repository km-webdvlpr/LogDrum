import type { AppCopy } from '../content/copy'
import type { ChallengeClue } from '../types/wela'

interface CluePanelProps {
  clues: ChallengeClue[]
  revealedClueIds: number[]
  onReveal: (clueId: number) => void
  copy: AppCopy
}

export function CluePanel({ clues, revealedClueIds, onReveal, copy }: CluePanelProps) {
  return (
    <section className="rounded-[4px] border border-[#8A6510] bg-[#0F1A0D] px-4 py-4">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#F5C842]">
            {copy.cabinet.cluesPanel}
          </p>
          <p className="mt-2 text-sm leading-6 text-[#F0EAD0]">{copy.clues.subtitle}</p>
        </div>
      </div>

      <div className="space-y-2">
        {clues.map((clue, index) => {
          const isOpen = revealedClueIds.includes(clue.id)
          const isNext = revealedClueIds.length === index
          return (
            <article
              key={clue.id}
              className={[
                'rounded-[4px] border px-3 py-3',
                isOpen ? 'border-[#00B050] bg-[#162413]' : 'border-[#1C3018] bg-[#0A0E09]',
              ].join(' ')}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#A89E80]">
                    {`0${clue.id} • ${clue.title}`}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#F0EAD0]">
                    {isOpen ? clue.body : copy.clues.locked}
                  </p>
                </div>

                <button
                  onClick={() => onReveal(clue.id)}
                  disabled={!isNext || isOpen}
                  className={[
                    'shrink-0 rounded-[3px] border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors',
                    isOpen
                      ? 'border-[#00B050] bg-[#004D24] text-[#2EFF7A]'
                      : isNext
                        ? 'border-[#8A6510] bg-[#1A1408] text-[#F5C842] hover:border-[#F5C842]'
                        : 'border-[#1C3018] bg-[#0A0E09] text-[#5F674E]',
                  ].join(' ')}
                >
                  {isOpen
                    ? copy.clues.open
                    : clue.cost === 0
                      ? copy.clues.free
                      : copy.clues.cost(clue.cost)}
                </button>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
