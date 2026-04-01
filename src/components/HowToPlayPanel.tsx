import type { AppCopy } from '../content/copy'

interface HowToPlayPanelProps {
  copy: AppCopy
}

export function HowToPlayPanel({ copy }: HowToPlayPanelProps) {
  return (
    <section className="rounded-[28px] border border-ink/10 bg-white/70 px-4 py-4 shadow-glow backdrop-blur-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="font-display text-3xl tracking-[0.16em] text-gold">{copy.rules.title}</p>
          <p className="text-xs uppercase tracking-[0.24em] text-haze/70">{copy.rules.subtitle}</p>
        </div>
        <div className="rounded-full border border-ember/25 bg-ember/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-ember">
          {copy.rules.badge}
        </div>
      </div>

      <div className="space-y-3">
        {copy.rules.steps.map((step, index) => (
          <div
            key={step}
            className="rounded-3xl border border-ink/10 bg-paper/70 p-4 transition-colors hover:border-gold/25"
          >
            <p className="mb-2 font-display text-2xl tracking-[0.12em] text-ember">0{index + 1}</p>
            <p className="text-sm leading-6 text-ink/80">{step}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-3xl border border-gold/15 bg-gradient-to-br from-gold/10 to-ember/10 p-4 text-sm leading-6 text-ink/80">
        <p className="font-semibold text-ink">{copy.rules.noteTitle}</p>
        <p>{copy.rules.noteBody}</p>
      </div>
    </section>
  )
}
