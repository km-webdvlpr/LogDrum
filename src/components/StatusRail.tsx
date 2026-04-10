import type { ReactNode } from 'react'
import type { AppCopy } from '../content/copy'

interface StatusRailProps {
  score: number
  finalScore: number | null
  timerRemaining: number
  livesRemaining: number
  stepsTaken: number
  par: number
  difficultyLabel: string
  copy: AppCopy
}

export function StatusRail({
  score,
  finalScore,
  timerRemaining,
  livesRemaining,
  stepsTaken,
  par,
  difficultyLabel,
  copy,
}: StatusRailProps) {
  const timeCritical = timerRemaining <= 60

  return (
    <aside className="grid grid-cols-2 gap-3 lg:grid-cols-1">
      <RailCard label={copy.status.score} accent="gold">
        <p className="font-score text-3xl tracking-[0.14em] text-[#F5C842]">{formatNumber(score)}</p>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[#8A6510]">
          {finalScore == null ? copy.status.liveScore : `${copy.status.finalScore} ${formatNumber(finalScore)}`}
        </p>
      </RailCard>

      <RailCard label={copy.status.timer} accent={timeCritical ? 'red' : 'green'}>
        <p
          className={[
            'font-score text-3xl tracking-[0.12em]',
            timeCritical ? 'text-[#FF8080]' : 'text-[#2EFF7A]',
          ].join(' ')}
        >
          {formatTime(timerRemaining)}
        </p>
      </RailCard>

      <RailCard label={copy.status.lives} accent={livesRemaining <= 1 ? 'red' : 'green'}>
        <div className="flex gap-2">
          {Array.from({ length: 3 }, (_, index) => {
            const isLive = index < livesRemaining
            return (
              <span
                key={index}
                className={[
                  'h-4 w-4 border',
                  isLive
                    ? 'border-[#2EFF7A] bg-[#00B050] shadow-[0_0_12px_rgba(46,255,122,0.28)]'
                    : 'border-[#6B1010] bg-[#2A0E0E]',
                ].join(' ')}
              />
            )
          })}
        </div>
      </RailCard>

      <RailCard label={copy.status.steps} accent="gold">
        <p className="font-score text-2xl tracking-[0.14em] text-[#F5C842]">{stepsTaken}</p>
      </RailCard>

      <RailCard label={copy.status.par} accent="gold">
        <p className="font-score text-2xl tracking-[0.14em] text-[#F5C842]">{par}</p>
      </RailCard>

      <RailCard label={copy.status.difficulty} accent="green">
        <p className="font-mono text-sm uppercase tracking-[0.22em] text-[#2EFF7A]">
          {difficultyLabel}
        </p>
      </RailCard>
    </aside>
  )
}

function RailCard({
  label,
  accent,
  children,
}: {
  label: string
  accent: 'gold' | 'green' | 'red'
  children: ReactNode
}) {
  const accentStyles: Record<typeof accent, string> = {
    gold: 'border-[#8A6510] shadow-[inset_0_0_0_1px_rgba(245,200,66,0.08)]',
    green: 'border-[#004D24] shadow-[inset_0_0_0_1px_rgba(46,255,122,0.08)]',
    red: 'border-[#6B1010] shadow-[inset_0_0_0_1px_rgba(224,48,48,0.08)]',
  }

  return (
    <section className={`rounded-[4px] border bg-[#0F1A0D] px-4 py-4 ${accentStyles[accent]}`}>
      <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[#A89E80]">{label}</p>
      {children}
    </section>
  )
}

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value)
}
