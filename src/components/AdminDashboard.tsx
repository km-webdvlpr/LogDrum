import { useState, type FormEvent } from 'react';
import { assignDailyChallenge, createSong } from '../services/adminApi';
import type { SongEntry } from '../types/game';
import starterSongs from '../data/amapianoSongs.json';

interface AdminDashboardProps {
  isOpen: boolean;
  canManage: boolean;
}

const emptySong: SongEntry = {
  song_id: '',
  song_title: '',
  primary_artist: '',
  featured_artists: [],
  year: new Date().getFullYear(),
  mood: '',
  substyle: '',
  tempo_band: 'Mid',
  difficulty: 'medium',
  title_length: 0,
  spotify_id: '',
  youtube_url: '',
  insight_story: ''
};

export function AdminDashboard({ isOpen, canManage }: AdminDashboardProps) {
  const [songForm, setSongForm] = useState<SongEntry>(emptySong);
  const [challengeDate, setChallengeDate] = useState('');
  const [challengeSongId, setChallengeSongId] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [busyAction, setBusyAction] = useState<string | null>(null);

  if (!isOpen || !canManage) {
    return null;
  }

  async function handleSongSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusyAction('song');

    try {
      await createSong({
        ...songForm,
        title_length: songForm.song_title.length
      });

      setMessage('Song saved to the library.');
      setSongForm(emptySong);
    } catch (error) {
      setMessage(getErrorMessage(error));
    } finally {
      setBusyAction(null);
    }
  }

  async function handleChallengeSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusyAction('challenge');

    try {
      await assignDailyChallenge(challengeDate, challengeSongId);
      setMessage('Daily challenge assigned.');
      setChallengeDate('');
      setChallengeSongId('');
    } catch (error) {
      setMessage(getErrorMessage(error));
    } finally {
      setBusyAction(null);
    }
  }

  async function handleImportStarterLibrary() {
    setBusyAction('import');

    try {
      for (const song of starterSongs as SongEntry[]) {
        await createSong(song);
      }

      setMessage('Starter song library imported into Supabase.');
    } catch (error) {
      setMessage(getErrorMessage(error));
    } finally {
      setBusyAction(null);
    }
  }

  return (
    <section className="panel space-y-6 border-gold/20 bg-zinc-950/80 px-5 py-6 sm:px-6">
      <div>
        <p className="font-display text-4xl uppercase tracking-[0.14em] text-gold">Control Room</p>
        <p className="mt-2 text-sm leading-6 text-haze/70">
          Add songs, update metadata, and lock in the daily challenge without touching code.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => {
              void handleImportStarterLibrary();
            }}
            disabled={busyAction !== null}
            className="rounded-2xl border border-gold/25 bg-gold/10 px-5 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-gold disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busyAction === 'import' ? 'Importing...' : 'Import Starter Library'}
          </button>
          <p className="max-w-xl text-sm leading-6 text-haze/60">
            This loads the current 30-song local dataset into Supabase so you can start assigning daily
            challenges immediately.
          </p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <form onSubmit={handleSongSubmit} className="space-y-3 rounded-[28px] border border-white/8 bg-black/25 p-4">
          <p className="font-display text-2xl uppercase tracking-[0.12em] text-spice">Add Song</p>
          <DashboardInput label="Song ID" value={songForm.song_id} onChange={(value) => setSongForm((current) => ({ ...current, song_id: value }))} />
          <DashboardInput label="Title" value={songForm.song_title} onChange={(value) => setSongForm((current) => ({ ...current, song_title: value }))} />
          <DashboardInput label="Primary artist" value={songForm.primary_artist} onChange={(value) => setSongForm((current) => ({ ...current, primary_artist: value }))} />
          <DashboardInput
            label="Featured artists"
            value={songForm.featured_artists.join(', ')}
            onChange={(value) =>
              setSongForm((current) => ({
                ...current,
                featured_artists: value.split(',').map((entry) => entry.trim()).filter(Boolean)
              }))
            }
          />
          <DashboardInput label="Mood" value={songForm.mood} onChange={(value) => setSongForm((current) => ({ ...current, mood: value }))} />
          <DashboardInput label="Substyle" value={songForm.substyle} onChange={(value) => setSongForm((current) => ({ ...current, substyle: value }))} />
          <DashboardInput label="Spotify ID" value={songForm.spotify_id} onChange={(value) => setSongForm((current) => ({ ...current, spotify_id: value }))} />
          <DashboardInput label="YouTube URL" value={songForm.youtube_url ?? ''} onChange={(value) => setSongForm((current) => ({ ...current, youtube_url: value }))} />
          <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-haze/45">Insight story</span>
            <textarea
              value={songForm.insight_story}
              onChange={(event) => setSongForm((current) => ({ ...current, insight_story: event.target.value }))}
              className="min-h-28 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-haze outline-none focus:border-gold/40"
            />
          </label>
          <button
            disabled={busyAction !== null}
            className="rounded-2xl bg-gradient-to-r from-gold via-spice to-ember px-5 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-black disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busyAction === 'song' ? 'Saving...' : 'Save Song'}
          </button>
        </form>

        <form onSubmit={handleChallengeSubmit} className="space-y-3 rounded-[28px] border border-white/8 bg-black/25 p-4">
          <p className="font-display text-2xl uppercase tracking-[0.12em] text-spice">Assign Daily Challenge</p>
          <DashboardInput label="Challenge date (YYYY-MM-DD)" value={challengeDate} onChange={setChallengeDate} />
          <DashboardInput label="Song ID" value={challengeSongId} onChange={setChallengeSongId} />
          <button
            disabled={busyAction !== null}
            className="rounded-2xl border border-gold/25 bg-gold/10 px-5 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-gold disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busyAction === 'challenge' ? 'Saving...' : 'Save Challenge'}
          </button>
        </form>
      </div>

      {message ? <p className="text-sm text-gold">{message}</p> : null}
    </section>
  );
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Something went wrong while saving to Supabase.';
}

function DashboardInput({
  label,
  value,
  onChange
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-haze/45">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-haze outline-none focus:border-gold/40"
      />
    </label>
  );
}
