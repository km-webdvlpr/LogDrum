import type { AppCopy } from '../content/copy'

interface HowToPlayPanelProps {
  copy: AppCopy
}

export function HowToPlayPanel({ copy }: HowToPlayPanelProps) {
  const guideCards = [
    {
      title: copy.guide.goalTitle,
      body: copy.guide.goalBody,
      tone: 'gold',
    },
    {
      title: copy.guide.logicTitle,
      body: copy.guide.logicBody,
      tone: 'green',
    },
    {
      title: copy.guide.pathTitle,
      body: copy.guide.pathBody,
      tone: 'gold',
    },
    {
      title: copy.guide.moveTitle,
      body: copy.guide.moveBody,
      tone: 'green',
    },
    {
      title: copy.guide.costTitle,
      body: copy.guide.costBody,
      tone: 'red',
    },
    {
      title: copy.guide.scoreTitle,
      body: copy.guide.scoreBody,
      tone: 'gold',
    },
    {
      title: copy.guide.winTitle,
      body: copy.guide.winBody,
      tone: 'green',
    },
  ] as const

  return (
    <section className="rounded-[4px] border border-[#8A6510] bg-[#0F1A0D] px-4 py-4">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#F5C842]">
            {copy.cabinet.howPanel}
          </p>
          <p className="mt-2 font-title text-xl text-[#F0EAD0]">{copy.guide.title}</p>
          <p className="mt-2 text-sm leading-6 text-[#A89E80]">{copy.guide.subtitle}</p>
        </div>
        <span className="rounded-[3px] border border-[#1C3018] bg-[#0A0E09] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#2EFF7A]">
          {copy.rules.badge}
        </span>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {guideCards.map((card) => (
          <article
            key={card.title}
            className={[
              'rounded-[4px] border px-3 py-3',
              card.tone === 'green'
                ? 'border-[#004D24] bg-[#0A0E09]'
                : card.tone === 'red'
                  ? 'border-[#6B1010] bg-[#120C0C]'
                  : 'border-[#8A6510] bg-[#0A0E09]',
            ].join(' ')}
          >
            <p
              className={[
                'font-mono text-[10px] uppercase tracking-[0.22em]',
                card.tone === 'green'
                  ? 'text-[#2EFF7A]'
                  : card.tone === 'red'
                    ? 'text-[#FF8080]'
                    : 'text-[#F5C842]',
              ].join(' ')}
            >
              {card.title}
            </p>
            <p className="mt-2 text-sm leading-6 text-[#F0EAD0]">{card.body}</p>
          </article>
        ))}
      </div>

      <div className="mt-4 rounded-[4px] border border-[#1C3018] bg-[#0A0E09] px-3 py-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#F5C842]">
          {copy.guide.futureTitle}
        </p>
        <p className="mt-2 text-sm leading-6 text-[#A89E80]">{copy.guide.futureBody}</p>
      </div>
    </section>
  )
}
