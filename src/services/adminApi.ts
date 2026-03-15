import { supabase } from '../lib/supabase';
import type { AdminAnalyticsSummary, ChallengeDetailRow, PlayerHistoryRow, ProfileRow, SongLightRow } from '../types/backend';
import type { SongEntry } from '../types/game';

export async function createSong(song: SongEntry) {
  if (!supabase) {
    throw new Error('Supabase is not configured.');
  }

  const payload = {
    ...song,
    youtube_url: song.youtube_url ?? ''
  };

  const { error } = await supabase.from('songs').upsert(payload, {
    onConflict: 'song_id'
  });

  if (error) {
    throw error;
  }
}

export async function assignDailyChallenge(dateKey: string, songId: string) {
  if (!supabase) {
    throw new Error('Supabase is not configured.');
  }

  const { error } = await supabase.from('daily_challenges').upsert(
    {
      challenge_date: dateKey,
      song_id: songId
    },
    { onConflict: 'challenge_date' }
  );

  if (error) {
    throw error;
  }
}

export async function fetchAdminOverview(dateKey: string): Promise<AdminAnalyticsSummary> {
  if (!supabase) {
    throw new Error('Supabase is not configured.');
  }

  const [
    libraryCountResult,
    playerCountResult,
    resultsCountResult,
    winsCountResult,
    activeChallengeResult,
    recentResultsResult,
    topPlayersResult,
    songsResult
  ] = await Promise.all([
    supabase.from('songs').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('game_results').select('*', { count: 'exact', head: true }),
    supabase.from('game_results').select('*', { count: 'exact', head: true }).eq('won', true),
    supabase
      .from('daily_challenges')
      .select('challenge_date, song_id, songs(song_id, song_title, primary_artist, year, mood, substyle)')
      .eq('challenge_date', dateKey)
      .maybeSingle(),
    supabase
      .from('game_results')
      .select(
        'challenge_date, song_id, won, attempts_used, credits_awarded, songs(song_id, song_title, primary_artist, year, mood, substyle)'
      )
      .order('challenge_date', { ascending: false })
      .limit(8),
    supabase
      .from('profiles')
      .select('*')
      .order('total_solves', { ascending: false })
      .order('credits', { ascending: false })
      .limit(5),
    supabase.from('songs').select('song_id, song_title, primary_artist, year, mood, substyle').order('song_title', { ascending: true })
  ]);

  const results = [
    libraryCountResult,
    playerCountResult,
    resultsCountResult,
    winsCountResult,
    activeChallengeResult,
    recentResultsResult,
    topPlayersResult,
    songsResult
  ];

  for (const result of results) {
    if ('error' in result && result.error) {
      throw result.error;
    }
  }

  return {
    libraryCount: libraryCountResult.count ?? 0,
    totalPlayers: playerCountResult.count ?? 0,
    totalResults: resultsCountResult.count ?? 0,
    totalWins: winsCountResult.count ?? 0,
    activeChallenge: activeChallengeResult.data ? mapChallengeDetailRow(activeChallengeResult.data) : null,
    recentResults: ((recentResultsResult.data ?? []) as unknown[]).map(mapPlayerHistoryRow),
    topPlayers: (topPlayersResult.data ?? []) as ProfileRow[],
    songs: (songsResult.data ?? []) as SongLightRow[]
  };
}

function mapChallengeDetailRow(input: unknown): ChallengeDetailRow {
  const row = input as {
    challenge_date: string;
    song_id: string;
    songs: SongLightRow | SongLightRow[];
  };

  return {
    challenge_date: row.challenge_date,
    song_id: row.song_id,
    songs: Array.isArray(row.songs) ? row.songs[0] : row.songs
  };
}

function mapPlayerHistoryRow(input: unknown): PlayerHistoryRow {
  const row = input as {
    challenge_date: string;
    song_id: string;
    won: boolean;
    attempts_used: number;
    credits_awarded: number;
    songs: SongLightRow | SongLightRow[];
  };

  return {
    challenge_date: row.challenge_date,
    song_id: row.song_id,
    won: row.won,
    attempts_used: row.attempts_used,
    credits_awarded: row.credits_awarded,
    songs: Array.isArray(row.songs) ? row.songs[0] : row.songs
  };
}
