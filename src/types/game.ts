export interface SongEntry {
  song_id: string;
  song_title: string;
  primary_artist: string;
  featured_artists: string[];
  year: number;
  mood: string;
  substyle: string;
  tempo_band: string;
  difficulty: 'easy' | 'medium' | 'hard';
  title_length: number;
  spotify_id: string;
  insight_story: string;
}

export interface DailyCompletionRecord {
  won: boolean;
  attempts: number;
  songId: string;
}

export interface StoredProgress {
  streak: number;
  bestStreak: number;
  solvedHistory: string[];
  lastPlayedDate: string;
  lastCompletedDate: string;
  completionByDate: Record<string, DailyCompletionRecord>;
  activeSession: {
    date: string;
    guesses: string[];
    isComplete: boolean;
  } | null;
}
