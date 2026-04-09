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
  const playableArtists = artists
    .filter((artist) => {
      const id = artist.id
      if (id === destinationId) return validNextIds.has(id)
      if (id === currentId) return false
      if (pathIds.has(id)) return false
      return validNextIds.has(id)
    })
    .sort((a, b) => {
      if (a.id === destinationId) return -1
      if (b.id === destinationId) return 1
      return a.name.localeCompare(b.name)
    })

  const remainingValidMoves = playableArtists.length

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
      <div className="mb-3 rounded-[24px] border border-ink/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.84),rgba(248,242,227,0.84))] px-3.5 py-3 shadow-glow backdrop-blur-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.22em] text-haze/70">
              {copy.grid.currentArtist}
            </p>
            <p className="text-base font-semibold text-gold">{artistName(artists, currentId)}</p>
          </div>
          <div className="text-right">
            <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.22em] text-haze/70">
              {copy.grid.liveOptions}
            </p>
            <p className="font-mono text-base font-semibold text-ink/80 tabular-nums">
              {remainingValidMoves}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-haze/70">
          {copy.grid.availableMoves}
        </p>
        <p className="text-xs text-haze/72">{copy.grid.tapConnectedArtist}</p>
      </div>

      {playableArtists.length === 0 ? (
        <div className="rounded-[26px] border border-ink/10 bg-white/65 px-4 py-4 shadow-glow backdrop-blur-sm">
          <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.22em] text-haze/70">
            {copy.grid.noMovesTitle}
          </p>
          <p className="text-sm leading-6 text-ink/76">{copy.grid.noMovesBody}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {playableArtists.map((artist) => {
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
      )}
    </div>
  )
}
