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

export function ArtistGrid({
  artists,
  graph,
  currentId,
  destinationId,
  pathIds,
  onMove,
}: ArtistGridProps) {
  const validNextIds = new Set(getConnections(graph, currentId))

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
