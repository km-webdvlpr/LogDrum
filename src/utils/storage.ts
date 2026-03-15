import type { StoredProgress } from '../types/game';

const STORAGE_KEY = 'logdrum-progress-v1';

const defaultProgress: StoredProgress = {
  streak: 0,
  bestStreak: 0,
  solvedHistory: [],
  lastPlayedDate: '',
  lastCompletedDate: '',
  completionByDate: {},
  activeSession: null
};

export function getStoredProgress(): StoredProgress {
  if (typeof window === 'undefined') {
    return defaultProgress;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return defaultProgress;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<StoredProgress>;
    return {
      ...defaultProgress,
      ...parsed,
      completionByDate: parsed.completionByDate ?? {},
      solvedHistory: parsed.solvedHistory ?? [],
      activeSession: parsed.activeSession ?? null
    };
  } catch {
    return defaultProgress;
  }
}

export function saveStoredProgress(progress: StoredProgress) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}
