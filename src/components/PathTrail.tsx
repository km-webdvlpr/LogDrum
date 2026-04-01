import type { PathStep, Artist } from '../types/wela'

interface PathTrailProps {
  startId: string
  path: PathStep[]
  artists: Artist[]
  currentId: string
}

function artistName(artists: Artist[], id: string): string {
  return artists.find((a) => a.id === id)?.name ?? id
}

export function PathTrail({ startId, path, artists, currentId }: PathTrailProps) {
  if (path.length === 0) return null

  return (
    <div className="px-4 pb-3 overflow-x-auto">
      <div className="flex items-start gap-0 min-w-max">
        {/* Start node */}
        <TrailNode label={artistName(artists, startId)} isStart />

        {path.map((step, i) => (
          <div key={i} className="flex items-start">
            {/* Arrow + song label */}
            <div className="flex flex-col items-center justify-center px-1 pt-2">
              <span className="text-gold/60 text-base leading-none">{'->'}</span>
              <span className="text-[9px] text-haze/40 mt-0.5 max-w-[60px] text-center leading-tight truncate">
                {step.song.title}
              </span>
            </div>
            {/* Next artist node */}
            <TrailNode
              label={artistName(artists, step.toId)}
              isActive={step.toId === currentId}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

function TrailNode({
  label,
  isStart,
  isActive,
}: {
  label: string
  isStart?: boolean
  isActive?: boolean
}) {
  return (
    <div
      className={`
        flex flex-col items-center justify-center rounded-xl border px-2 py-1.5 min-w-[60px] max-w-[80px]
        ${isStart ? 'border-gold/30 bg-gold/8 text-gold/70' : ''}
        ${isActive ? 'border-gold bg-gold/15 text-gold shadow-[0_0_8px_rgba(212,169,61,0.3)]' : ''}
        ${!isStart && !isActive ? 'border-white/10 bg-white/5 text-white/40' : ''}
      `}
    >
      <span className="text-[10px] font-medium leading-tight text-center">{label}</span>
    </div>
  )
}