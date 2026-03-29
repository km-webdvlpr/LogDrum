import type { HistoryEntry } from '../types/wela'

const KEY = 'wela-history-v1'

export function loadHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as HistoryEntry[]) : []
  } catch {
    return []
  }
}

export function saveResult(entry: HistoryEntry): void {
  const history = loadHistory()
  // Replace existing entry for the same date (in case of practice reload)
  const idx = history.findIndex((h) => h.date === entry.date)
  if (idx >= 0) {
    history[idx] = entry
  } else {
    history.unshift(entry)
  }
  // Keep last 90 entries
  localStorage.setItem(KEY, JSON.stringify(history.slice(0, 90)))
}

export function hasSolvedToday(dateKey: string): boolean {
  return loadHistory().some((h) => h.date === dateKey)
}

export function getTodayEntry(dateKey: string): HistoryEntry | null {
  return loadHistory().find((h) => h.date === dateKey) ?? null
}
