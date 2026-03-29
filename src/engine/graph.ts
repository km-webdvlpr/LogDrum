import type { Artist, Song, Graph } from '../types/wela'

export function buildGraph(artists: Artist[], songs: Song[]): Graph {
  const adjacency = new Map<string, Set<string>>()
  const edges = new Map<string, Song[]>()

  for (const a of artists) {
    adjacency.set(a.id, new Set())
  }

  for (const song of songs) {
    const ids = song.artists
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        const a = ids[i]
        const b = ids[j]
        adjacency.get(a)?.add(b)
        adjacency.get(b)?.add(a)
        const key = edgeKey(a, b)
        if (!edges.has(key)) edges.set(key, [])
        edges.get(key)!.push(song)
      }
    }
  }

  return { adjacency, edges }
}

export function edgeKey(a: string, b: string): string {
  return [a, b].sort().join(':')
}

export function getConnections(graph: Graph, artistId: string): string[] {
  return Array.from(graph.adjacency.get(artistId) ?? [])
}

export function getSongsBetween(graph: Graph, a: string, b: string): Song[] {
  return graph.edges.get(edgeKey(a, b)) ?? []
}

export function canConnect(graph: Graph, from: string, to: string): boolean {
  return graph.adjacency.get(from)?.has(to) ?? false
}

// Returns array of artist IDs from start to end (inclusive), or null if no path
export function findShortestPath(
  graph: Graph,
  start: string,
  end: string
): string[] | null {
  if (start === end) return [start]
  const visited = new Set<string>([start])
  const queue: string[][] = [[start]]

  while (queue.length > 0) {
    const path = queue.shift()!
    const current = path[path.length - 1]
    for (const neighbor of graph.adjacency.get(current) ?? []) {
      if (neighbor === end) return [...path, neighbor]
      if (!visited.has(neighbor)) {
        visited.add(neighbor)
        queue.push([...path, neighbor])
      }
    }
  }
  return null
}

export interface CandidatePair {
  startId: string
  endId: string
  distance: number
}

// Find all reachable pairs within a distance range — used for challenge seeding
export function findPairsInRange(
  graph: Graph,
  minDist: number,
  maxDist: number
): CandidatePair[] {
  const ids = Array.from(graph.adjacency.keys())
  const pairs: CandidatePair[] = []

  for (let i = 0; i < ids.length; i++) {
    for (let j = i + 1; j < ids.length; j++) {
      const path = findShortestPath(graph, ids[i], ids[j])
      if (!path) continue
      const dist = path.length - 1
      if (dist >= minDist && dist <= maxDist) {
        pairs.push({ startId: ids[i], endId: ids[j], distance: dist })
      }
    }
  }

  return pairs
}
