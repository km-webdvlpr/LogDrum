import type { Artist } from '../types/wela'
import type { Graph } from '../types/wela'
import { getConnections } from '../engine/graph'
import { ArtistNode } from './ArtistNode'
import type { NodeState } from './ArtistNode'

interface ArtistGridProps {
  artists: Artist[]
  graph: Graph
  currentId: string
  destinationId: string
  pathIds: Set<string>
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
      <div className="mb-3 rounded-2xl border border-white/8 bg-white/4 px-3 py-2.5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] text-haze/35 uppercase tracking-widest mb-1">
              Current artist
            </p>
            <p className="text-sm font-semibold text-gold">{artistName(artists, currentId)}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-haze/35 uppercase tracking-widest mb-1">
              Live options
            </p>
            <p className="text-sm font-semibold text-haze/80 tabular-nums">
              {remainingValidMoves}
            </p>
          </div>
        </div>
      </div>

      <p className="text-[10px] text-haze/35 uppercase tracking-widest mb-3">
        Tap a connected artist
      </p>
      <div className="grid grid-cols-3 gap-2">
        {artists.map((artist) => {
          const ns = resolveState(artist)
          return (
            <ArtistNode
              key={artist.id}
              artist={artist}
              nodeState={ns}
              onClick={() => onMove(artist.id)}
            />
          )
        })}
      </div>
    </div>
  )
}