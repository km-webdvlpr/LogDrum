import type { Artist } from '../types/wela'
import type { Graph } from '../types/wela'
import { getConnections } from '../engine/graph'
import { ArtistNode } from './ArtistNode'
import type { NodeState } from './ArtistNode'
import type { AppCopy } from '../content/copy'

interface ArtistGridProps {
  artists: Artist[]
  graph: Graph
  currentId: string
  destinationId: string
  pathIds: Set<string>
  copy: AppCopy
  onMove: (toId: string) => void
}

function artistName(artists: Artist[], id: string): string {
  return artists.find((artist) => artist.id === id)?.name ?? id
}

export function ArtistGrid({
  artists,
  graph,
  currentId,
  destinationId,
  pathIds,
  copy,
  onMove,
}: ArtistGridProps) {
  const validNextIds = new Set(getConnections(graph, currentId))
  const remainingValidMoves = validNextIds.size

  function resolveState(artist: Artist): NodeState {
    const id = artist.id
    if (id === currentId) return 'current'
    if (id === destinationId) return 'destination'
    if (pathIds.has(id)) return 'in-path'
    if (validNextIds.has(id)) return 'valid'
    return 'disabled'
  }

  return (
    <div className="flex-1 px-4 pb-4 overflow-y-auto">
      <div className="mb-3 rounded-2xl border border-ink/10 bg-white/75 px-3 py-2.5 shadow-glow">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] text-haze/70 uppercase tracking-widest mb-1">
              {copy.grid.currentArtist}
            </p>
            <p className="text-sm font-semibold text-gold">{artistName(artists, currentId)}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-haze/70 uppercase tracking-widest mb-1">
              {copy.grid.liveOptions}
            </p>
            <p className="text-sm font-semibold text-ink/80 tabular-nums">
              {remainingValidMoves}
            </p>
          </div>
        </div>
      </div>

      <p className="text-[10px] text-haze/70 uppercase tracking-widest mb-3">
        {copy.grid.tapConnectedArtist}
      </p>
      <div className="grid grid-cols-3 gap-2">
        {artists.map((artist) => {
          const ns = resolveState(artist)
          return (
            <ArtistNode
              key={artist.id}
              artist={artist}
              nodeState={ns}
              labels={copy.grid}
              onClick={() => onMove(artist.id)}
            />
          )
        })}
      </div>
    </div>
  )
}
