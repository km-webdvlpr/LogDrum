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
