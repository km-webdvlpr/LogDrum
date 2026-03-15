export interface ProfileRow {
  id: string;
  email: string | null;
  streak: number;
  best_streak: number;
  credits: number;
  total_solves: number;
  total_plays: number;
  is_admin: boolean;
}

export interface SongLightRow {
  song_id: string;
  song_title: string;
  primary_artist: string;
  year: number;
  mood: string;
  substyle: string;
}

export interface GameAttemptRow {
  challenge_date: string;
  guess_index: number;
  guess_text: string;
  is_correct: boolean;
}

export interface GameResultRow {
  challenge_date: string;
  song_id: string;
  won: boolean;
  attempts_used: number;
  credits_awarded: number;
}

export interface PlayerHistoryRow {
  challenge_date: string;
  song_id: string;
  won: boolean;
  attempts_used: number;
  credits_awarded: number;
  songs: SongLightRow;
}

export interface ChallengeDetailRow {
  challenge_date: string;
  song_id: string;
  songs: SongLightRow;
}

export interface AdminAnalyticsSummary {
  libraryCount: number;
  totalPlayers: number;
  totalResults: number;
  totalWins: number;
  activeChallenge: ChallengeDetailRow | null;
  recentResults: PlayerHistoryRow[];
  topPlayers: ProfileRow[];
  songs: SongLightRow[];
}
