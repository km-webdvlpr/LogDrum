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
    'border-gold bg-gold/12 text-gold shadow-[0_0_16px_rgba(183,142,30,0.25)] animate-pulse-glow cursor-default',
  valid:
    'border-gold/35 bg-white/85 text-ink/90 cursor-pointer active:scale-95 hover:border-gold/60 hover:bg-gold/10 transition-all',
  destination:
    'border-ember bg-ember/10 text-ember shadow-[0_0_16px_rgba(15,106,72,0.22)]',
  start:
    'border-gold/30 bg-gold/8 text-gold/80',
  'in-path':
    'border-ink/10 bg-paper/85 text-haze/80 cursor-default',
  disabled:
    'border-ink/10 bg-transparent text-haze/45 cursor-default',
  idle:
    'border-ink/10 bg-paper/70 text-ink/70 cursor-default',
}

export function ArtistNode({ artist, nodeState, labels, onClick }: ArtistNodeProps) {
  const isInteractive = nodeState === 'valid' || nodeState === 'destination'

  return (
    <button
      onClick={isInteractive ? onClick : undefined}
      disabled={!isInteractive}
      className={`
        relative w-full rounded-2xl border px-2 py-3
        text-center text-xs font-medium leading-tight
        transition-transform duration-150 select-none
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
