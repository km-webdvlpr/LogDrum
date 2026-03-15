import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { assignDailyChallenge, createSong, fetchAdminOverview } from '../services/adminApi';
import type { AdminAnalyticsSummary, SongLightRow } from '../types/backend';
import type { SongEntry } from '../types/game';
import starterSongs from '../data/amapianoSongs.json';
import { ToastBanner } from './ToastBanner';

interface AdminDashboardProps {
  isOpen: boolean;
  canManage: boolean;
  dateKey: string;
  dateLabel: string;
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

export function AdminDashboard({ isOpen, canManage, dateKey, dateLabel }: AdminDashboardProps) {
  const [songForm, setSongForm] = useState<SongEntry>(emptySong);
  const [challengeDate, setChallengeDate] = useState(dateKey);
  const [challengeSongId, setChallengeSongId] = useState('');
  const [songSearch, setSongSearch] = useState('');
  const [message, setMessage] = useState<{ tone: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [busyAction, setBusyAction] = useState<string | null>(null);
  const [overview, setOverview] = useState<AdminAnalyticsSummary | null>(null);
  const [loadingOverview, setLoadingOverview] = useState(false);

  useEffect(() => {
    setChallengeDate(dateKey);
  }, [dateKey]);

  useEffect(() => {
    if (!isOpen || !canManage) {
      return;
    }

    void loadOverview();
  }, [isOpen, canManage, dateKey]);

  const filteredSongs = useMemo(() => {
    const library = overview?.songs ?? [];
    const query = songSearch.trim().toLowerCase();

    if (!query) {
      return library.slice(0, 8);
    }

    return library
      .filter(
        (song) =>
          song.song_title.toLowerCase().includes(query) ||
          song.primary_artist.toLowerCase().includes(query) ||
          song.song_id.toLowerCase().includes(query)
      )
      .slice(0, 8);
  }, [overview?.songs, songSearch]);

  if (!isOpen || !canManage) {
    return null;
  }

  async function loadOverview() {
    setLoadingOverview(true);

    try {
      const next = await fetchAdminOverview(dateKey);
      setOverview(next);
    } catch (error) {
      setMessage({ tone: 'error', text: getErrorMessage(error) });
    } finally {
      setLoadingOverview(false);
    }
  }

  async function handleSongSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!songForm.song_id || !songForm.song_title || !songForm.primary_artist) {
      setMessage({ tone: 'error', text: 'Song ID, title, and primary artist are required.' });
      return;
    }

    setBusyAction('song');

    try {
      await createSong({
        ...songForm,
        title_length: songForm.song_title.length
      });

      setMessage({ tone: 'success', text: 'Song saved to the library.' });
      setSongForm(emptySong);
      await loadOverview();
    } catch (error) {
      setMessage({ tone: 'error', text: getErrorMessage(error) });
    } finally {
      setBusyAction(null);
    }
  }

  async function handleChallengeSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const matchedSong = overview?.songs.find((song) => song.song_id === challengeSongId.trim());

    if (!/^\d{4}-\d{2}-\d{2}$/.test(challengeDate)) {
      setMessage({ tone: 'error', text: 'Challenge date must use YYYY-MM-DD format.' });
      return;
    }

    if (!matchedSong) {
      setMessage({ tone: 'error', text: 'Pick a valid Song ID from the current library.' });
      return;
    }

    setBusyAction('challenge');

    try {
      await assignDailyChallenge(challengeDate, challengeSongId.trim());
      setMessage({ tone: 'success', text: `Daily challenge assigned to ${matchedSong.song_title}.` });
      await loadOverview();
    } catch (error) {
      setMessage({ tone: 'error', text: getErrorMessage(error) });
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

      setMessage({ tone: 'success', text: 'Starter song library imported into Supabase.' });
      await loadOverview();
    } catch (error) {
      setMessage({ tone: 'error', text: getErrorMessage(error) });
    } finally {
      setBusyAction(null);
    }
  }

  function applySongToChallenge(song: SongLightRow) {
    setChallengeSongId(song.song_id);
    setSongSearch(song.song_title);
  }

  function fillTomorrow() {
    const base = new Date(`${dateKey}T00:00:00Z`);
    base.setUTCDate(base.getUTCDate() + 1);
    setChallengeDate(base.toISOString().slice(0, 10));
  }

  return (
    <section className="panel space-y-6 border-gold/20 bg-zinc-950/80 px-5 py-6 sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-display text-4xl uppercase tracking-[0.14em] text-gold">Control Room</p>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-haze/70">
            Run the daily programming of LogDrum from one place: library, challenge assignment, and
            lightweight performance signals.
          </p>
        </div>
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
      </div>

      {message ? <ToastBanner tone={message.tone} message={message.text} /> : null}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MiniStat label="Library" value={overview?.libraryCount ?? 0} />
        <MiniStat label="Players" value={overview?.totalPlayers ?? 0} />
        <MiniStat label="Sessions" value={overview?.totalResults ?? 0} />
        <MiniStat label="Wins" value={overview?.totalWins ?? 0} />
      </div>

      <div className="rounded-[28px] border border-white/8 bg-black/25 p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-display text-2xl uppercase tracking-[0.12em] text-spice">Current Programming</p>
            <p className="text-xs uppercase tracking-[0.24em] text-haze/45">{dateLabel}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              void loadOverview();
            }}
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.18em] text-haze/70"
          >
            {loadingOverview ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {overview?.activeChallenge ? (
          <div className="mt-4 rounded-3xl border border-gold/20 bg-gold/10 p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-gold">
              Live challenge / {overview.activeChallenge.challenge_date}
            </p>
            <p className="mt-2 text-lg font-semibold text-haze">{overview.activeChallenge.songs.song_title}</p>
            <p className="text-sm text-haze/65">{overview.activeChallenge.songs.primary_artist}</p>
          </div>
        ) : (
          <p className="mt-4 text-sm text-haze/60">No challenge is assigned for this RSA date yet.</p>
        )}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <form onSubmit={handleChallengeSubmit} className="space-y-4 rounded-[28px] border border-white/8 bg-black/25 p-4">
            <div>
              <p className="font-display text-2xl uppercase tracking-[0.12em] text-spice">Assign Daily Challenge</p>
              <p className="text-sm leading-6 text-haze/60">Choose a date, search the library, and assign the drop.</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setChallengeDate(dateKey)}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.18em] text-haze/70"
              >
                Use today
              </button>
              <button
                type="button"
                onClick={fillTomorrow}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.18em] text-haze/70"
              >
                Use tomorrow
              </button>
            </div>

            <DashboardInput label="Challenge date (YYYY-MM-DD)" value={challengeDate} onChange={setChallengeDate} />
            <DashboardInput
              label="Find song"
              value={songSearch}
              onChange={setSongSearch}
              placeholder="Search by title, artist, or song ID"
            />
            <DashboardInput label="Song ID" value={challengeSongId} onChange={setChallengeSongId} placeholder="Choose from search results below" />

            <div className="rounded-3xl border border-white/8 bg-white/[0.03] p-3">
              <p className="mb-3 text-xs uppercase tracking-[0.22em] text-haze/45">Song picker</p>
              <div className="grid gap-2">
                {filteredSongs.length === 0 ? (
                  <p className="text-sm text-haze/60">No matching songs yet.</p>
                ) : (
                  filteredSongs.map((song) => (
                    <button
                      key={song.song_id}
                      type="button"
                      onClick={() => applySongToChallenge(song)}
                      className="rounded-2xl border border-white/8 bg-black/25 px-4 py-3 text-left transition hover:border-gold/25 hover:bg-gold/10"
                    >
                      <p className="text-sm font-semibold text-haze">
                        {song.song_title} <span className="text-haze/40">/ {song.song_id}</span>
                      </p>
                      <p className="text-xs uppercase tracking-[0.18em] text-haze/55">{song.primary_artist}</p>
                    </button>
                  ))
                )}
              </div>
            </div>

            <button
              disabled={busyAction !== null}
              className="rounded-2xl border border-gold/25 bg-gold/10 px-5 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-gold disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busyAction === 'challenge' ? 'Saving...' : 'Save Challenge'}
            </button>
          </form>

          <div className="rounded-[28px] border border-white/8 bg-black/25 p-4">
            <p className="font-display text-2xl uppercase tracking-[0.12em] text-spice">Recent Results</p>
            <div className="mt-4 space-y-3">
              {(overview?.recentResults ?? []).length === 0 ? (
                <p className="text-sm text-haze/60">No player results yet.</p>
              ) : (
                overview?.recentResults.map((entry) => (
                  <div key={`${entry.challenge_date}-${entry.song_id}`} className="rounded-3xl border border-white/8 bg-white/[0.03] p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.22em] text-haze/45">{entry.challenge_date}</p>
                        <p className="mt-1 text-base font-semibold text-haze">{entry.songs.song_title}</p>
                      </div>
                      <div className="flex gap-2">
                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.18em] text-haze/65">
                          {entry.attempts_used} tries
                        </span>
                        <span className={`rounded-full px-3 py-1 text-xs uppercase tracking-[0.18em] ${entry.won ? 'border border-gold/25 bg-gold/10 text-gold' : 'border border-white/10 bg-white/5 text-haze/65'}`}>
                          {entry.won ? 'Solved' : 'Missed'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
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
                  featured_artists: value
                    .split(',')
                    .map((entry) => entry.trim())
                    .filter(Boolean)
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

          <div className="rounded-[28px] border border-white/8 bg-black/25 p-4">
            <p className="font-display text-2xl uppercase tracking-[0.12em] text-spice">Top Players</p>
            <div className="mt-4 space-y-3">
              {(overview?.topPlayers ?? []).length === 0 ? (
                <p className="text-sm text-haze/60">No leaderboard data yet.</p>
              ) : (
                overview?.topPlayers.map((player, index) => (
                  <div key={player.id} className="rounded-3xl border border-white/8 bg-white/[0.03] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.22em] text-haze/45">Rank 0{index + 1}</p>
                        <p className="mt-1 text-sm font-semibold text-haze">{player.email ?? 'Unknown player'}</p>
                      </div>
                      <div className="flex gap-2">
                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.18em] text-haze/65">
                          {player.total_solves} solves
                        </span>
                        <span className="rounded-full border border-gold/25 bg-gold/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-gold">
                          {player.credits} credits
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
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
  onChange,
  placeholder = ''
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-haze/45">{label}</span>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-haze outline-none focus:border-gold/40"
      />
    </label>
  );
}

function MiniStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-[24px] border border-white/8 bg-white/[0.04] px-4 py-4">
      <p className="text-xs uppercase tracking-[0.22em] text-haze/45">{label}</p>
      <p className="mt-2 font-display text-3xl uppercase tracking-[0.08em] text-haze">{value}</p>
    </div>
  );
}
