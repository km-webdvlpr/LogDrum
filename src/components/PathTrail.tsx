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
  return (
    <div className="overflow-x-auto rounded-[4px] border border-[#1C3018] bg-[#0A0E09] px-4 py-4">
      <div className="flex min-w-max items-start gap-0">
        {/* Start node */}
        <TrailNode label={artistName(artists, startId)} isStart />

        {path.map((step, index) => (
          <div key={`${step.toId}-${index}`} className="flex items-start">
            {/* Arrow + song label */}
            <div className="flex flex-col items-center justify-center px-1 pt-2">
              <span className="font-mono text-sm leading-none text-[#8A6510]">{'->'}</span>
              <span className="mt-1 max-w-[86px] text-center font-mono text-[9px] uppercase leading-tight tracking-[0.12em] text-[#A89E80]">
                {step.song.title}
              </span>
            </div>
            {/* Next artist node */}
            <TrailNode
              label={artistName(artists, step.toId)}
              isActive={step.toId === currentId}
              isLocked={index < path.length - 1}
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
  isLocked,
}: {
  label: string
  isStart?: boolean
  isActive?: boolean
  isLocked?: boolean
}) {
  return (
    <div
      className={`
        flex min-w-[92px] max-w-[120px] flex-col items-center justify-center rounded-[3px] border px-3 py-2
        ${isStart ? 'border-[#8A6510] bg-[#1A1408] text-[#F5C842]' : ''}
        ${isActive ? 'border-[#00B050] bg-[#004D24] text-[#2EFF7A] shadow-[0_0_18px_rgba(46,255,122,0.14)]' : ''}
        ${isLocked ? 'border-[#1C3018] bg-[#0F1A0D] text-[#F0EAD0]' : ''}
        ${!isStart && !isActive && !isLocked ? 'border-[#1C3018] bg-[#0F1A0D] text-[#A89E80]' : ''}
      `}
    >
      <span className="text-center font-title text-xs leading-tight">{label}</span>
    </div>
  )
}
