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
    'border-gold/30 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,242,227,0.95))] text-ink/92 cursor-pointer active:scale-[0.98] hover:-translate-y-[1px] hover:border-gold/60 hover:bg-gold/10 hover:shadow-[0_14px_28px_rgba(183,142,30,0.14)] transition-all',
  destination:
    'border-ember bg-[linear-gradient(180deg,rgba(15,106,72,0.16),rgba(255,255,255,0.9))] text-ember shadow-[0_14px_30px_rgba(15,106,72,0.16)] cursor-pointer active:scale-[0.98] hover:-translate-y-[1px] transition-all',
  start:
    'border-gold/30 bg-gold/10 text-gold/80',
  'in-path':
    'border-ink/8 bg-white/55 text-haze/78 cursor-default',
  disabled:
    'border-ink/6 bg-white/20 text-haze/38 cursor-default',
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
        relative w-full rounded-[22px] border px-3 py-4
        text-center text-sm font-medium leading-tight
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
