import type { Artist } from '../types/wela'

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
  onClick: () => void
}

const styles: Record<NodeState, string> = {
  current:
    'border-gold bg-gold/10 text-gold shadow-[0_0_16px_rgba(212,169,61,0.35)] animate-pulse-glow cursor-default',
  valid:
    'border-gold/40 bg-gold/5 text-white/90 cursor-pointer active:scale-95 hover:border-gold/70 hover:bg-gold/10 transition-all',
  destination:
    'border-ember bg-ember/10 text-ember shadow-[0_0_16px_rgba(255,107,26,0.3)]',
  start:
    'border-gold/30 bg-white/5 text-gold/80',
  'in-path':
    'border-white/5 bg-white/3 text-white/30 cursor-default',
  disabled:
    'border-white/5 bg-transparent text-white/15 cursor-default',
  idle:
    'border-white/8 bg-white/3 text-white/50 cursor-default',
}

export function ArtistNode({ artist, nodeState, onClick }: ArtistNodeProps) {
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
      aria-label={`${artist.name}${nodeState === 'destination' ? ' - destination' : ''}${nodeState === 'current' ? ' - current position' : ''}`}
    >
      {nodeState === 'destination' && (
        <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 text-[9px] text-ember/80 uppercase tracking-widest">
          reach
        </span>
      )}
      {nodeState === 'current' && (
        <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 text-[9px] text-gold/80 uppercase tracking-widest">
          here
        </span>
      )}
      <span className="block">{artist.name}</span>
    </button>
  )
}