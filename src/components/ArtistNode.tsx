import type { Artist } from '../types/wela'
import type { AppCopy } from '../content/copy'

export type NodeState =
  | 'start'
  | 'destination'
  | 'current'
  | 'valid'
  | 'in-path'
  | 'disabled'
  | 'idle'

interface ArtistNodeProps {
  artist: Artist
  nodeState: NodeState
  labels: AppCopy['grid']
  onClick: () => void
}

const styles: Record<NodeState, string> = {
  current:
    'border-gold bg-[linear-gradient(180deg,rgba(183,142,30,0.22),rgba(255,255,255,0.88))] text-gold shadow-[0_12px_28px_rgba(183,142,30,0.18)] animate-pulse-glow cursor-default',
  valid:
    'border-gold/25 bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(248,242,227,0.92))] text-ink/90 cursor-pointer active:scale-[0.98] hover:-translate-y-[1px] hover:border-gold/55 hover:bg-gold/10 hover:shadow-[0_10px_22px_rgba(183,142,30,0.12)] transition-all',
  destination:
    'border-ember bg-[linear-gradient(180deg,rgba(15,106,72,0.16),rgba(255,255,255,0.88))] text-ember shadow-[0_12px_28px_rgba(15,106,72,0.14)]',
  start:
    'border-gold/30 bg-gold/10 text-gold/80',
  'in-path':
    'border-ink/10 bg-white/60 text-haze/80 cursor-default',
  disabled:
    'border-ink/8 bg-white/20 text-haze/45 cursor-default',
  idle:
    'border-ink/10 bg-paper/75 text-ink/70 cursor-default',
}

export function ArtistNode({ artist, nodeState, labels, onClick }: ArtistNodeProps) {
  const isInteractive = nodeState === 'valid' || nodeState === 'destination'

  return (
    <button
      onClick={isInteractive ? onClick : undefined}
      disabled={!isInteractive}
      className={`
        relative w-full rounded-[20px] border px-2 py-3.5
        text-center text-xs font-medium leading-tight
        transition-transform duration-150 select-none backdrop-blur-[2px]
        ${styles[nodeState]}
      `}
      aria-label={`${artist.name}${nodeState === 'destination' ? labels.destinationSuffix : ''}${nodeState === 'current' ? labels.currentSuffix : ''}`}
    >
      {nodeState === 'destination' && (
        <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 text-[9px] text-ember/80 uppercase tracking-widest">
          {labels.reach}
        </span>
      )}
      {nodeState === 'current' && (
        <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 text-[9px] text-gold/80 uppercase tracking-widest">
          {labels.here}
        </span>
      )}
      <span className="block">{artist.name}</span>
    </button>
  )
}
