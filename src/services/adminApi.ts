import { supabase } from '../lib/supabase';
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
