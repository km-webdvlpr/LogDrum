import type { AppCopy } from '../content/copy'

interface TickerStripProps {
  date: string
  par: number
  timerSeconds: number
  difficultyLabel: string
  copy: AppCopy
}

export function TickerStrip({
  date,
  par,
  timerSeconds,
  difficultyLabel,
  copy,
}: TickerStripProps) {
  const items = [
    copy.ticker.today(date),
    copy.ticker.difficulty(difficultyLabel),
    copy.ticker.par(par),
    copy.ticker.timer(Math.round(timerSeconds / 60)),
    copy.ticker.scoreBase,
  ]

  const track = [...items, ...items].join('   •   ')

  return (
    <div className="overflow-hidden rounded-[4px] border border-[#8A6510] bg-[#0F1A0D]">
      <div className="ticker-run whitespace-nowrap px-4 py-2 font-mono text-[10px] uppercase tracking-[0.26em] text-[#F5C842]">
        <span>{track}</span>
      </div>
    </div>
  )
}
