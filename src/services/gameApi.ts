import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { GameAttemptRow, GameResultRow, ProfileRow } from '../types/backend';
import type { SongEntry } from '../types/game';

interface ChallengeRow {
  challenge_date: string;
  song_id: string;
  songs: SongEntry;
}

export async function fetchSongLibrary(): Promise<SongEntry[]> {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from('songs')
    .select('*')
    .order('song_title', { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []) as SongEntry[];
}

export async function fetchDailyChallenge(dateKey: string): Promise<SongEntry | null> {
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from('daily_challenges')
    .select('challenge_date, song_id, songs(*)')
    .eq('challenge_date', dateKey)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }

    throw error;
  }

  const row = data as unknown as ChallengeRow;
  return row.songs;
}

export async function fetchProfile(user: User): Promise<ProfileRow | null> {
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (data as ProfileRow | null) ?? null;
}

export async function fetchAttempts(userId: string, dateKey: string): Promise<GameAttemptRow[]> {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from('game_attempts')
    .select('challenge_date, guess_index, guess_text, is_correct')
    .eq('user_id', userId)
    .eq('challenge_date', dateKey)
    .order('guess_index', { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []) as GameAttemptRow[];
}

export async function fetchResult(userId: string, dateKey: string): Promise<GameResultRow | null> {
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from('game_results')
    .select('challenge_date, song_id, won, attempts_used, credits_awarded')
    .eq('user_id', userId)
    .eq('challenge_date', dateKey)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (data as GameResultRow | null) ?? null;
}

export async function saveAttempt(params: {
  userId: string;
  dateKey: string;
  songId: string;
  guessText: string;
  guessIndex: number;
  isCorrect: boolean;
}) {
  if (!supabase) {
    return;
  }

  const { error } = await supabase.from('game_attempts').insert({
    user_id: params.userId,
    challenge_date: params.dateKey,
    song_id: params.songId,
    guess_text: params.guessText,
    guess_index: params.guessIndex,
    is_correct: params.isCorrect
  });

  if (error) {
    throw error;
  }
}

export async function finalizeResult(params: {
  userId: string;
  dateKey: string;
  songId: string;
  won: boolean;
  attemptsUsed: number;
  creditsAwarded: number;
}) {
  if (!supabase) {
    return null;
  }

  const { error } = await supabase.rpc('record_game_result', {
    p_user_id: params.userId,
    p_challenge_date: params.dateKey,
    p_song_id: params.songId,
    p_won: params.won,
    p_attempts_used: params.attemptsUsed,
    p_credits_awarded: params.creditsAwarded
  });

  if (error) {
    throw error;
  }

  return true;
}
