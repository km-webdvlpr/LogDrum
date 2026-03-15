import { useMemo, useState } from 'react';
import { AdminDashboard } from './components/AdminDashboard';
import { AboutModal } from './components/AboutModal';
import { AuthPanel } from './components/AuthPanel';
import { HeroPanel } from './components/HeroPanel';
import { HowToPlay } from './components/HowToPlay';
import { SetupNotice } from './components/SetupNotice';
import { useAuthSession } from './hooks/useAuthSession';
import { useSouthAfricaClock } from './hooks/useSouthAfricaClock';
import { appEnv } from './lib/env';
import { DailyPuzzlePage } from './pages/DailyPuzzlePage';

function App() {
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const { user, loading, signInWithEmail, signOut } = useAuthSession();
  const { dateKey, dateLabel } = useSouthAfricaClock();
  const canManage = useMemo(() => {
    const email = user?.email?.toLowerCase() ?? '';
    return Boolean(email && appEnv.adminEmails.includes(email));
  }, [user?.email]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-mural text-haze">
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute left-[-10%] top-10 h-52 w-52 rounded-full bg-ember/30 blur-3xl md:h-80 md:w-80" />
        <div className="absolute right-[-10%] top-24 h-72 w-72 rounded-full bg-gold/20 blur-3xl md:h-96 md:w-96" />
        <div className="absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-plum/20 blur-3xl" />
      </div>

      <div className="noise-overlay" />

      <main className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-12 pt-5 sm:px-6 lg:px-8">
        <header className="mb-6 flex items-center justify-between gap-3">
          <div>
            <p className="font-display text-2xl uppercase tracking-[0.3em] text-gold sm:text-3xl">
              LogDrum
            </p>
            <p className="text-xs uppercase tracking-[0.3em] text-haze/60">
              Daily Amapiano discovery game
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsAboutOpen(true)}
            className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.3em] text-haze transition hover:border-gold/50 hover:bg-white/10"
          >
            About
          </button>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div className="space-y-6">
            <HeroPanel dateLabel={dateLabel} />
            <SetupNotice backendEnabled={appEnv.hasSupabase} />
            <AuthPanel
              backendEnabled={appEnv.hasSupabase}
              userEmail={user?.email ?? null}
              loading={loading}
              onSignIn={signInWithEmail}
              onSignOut={signOut}
            />
            {canManage ? (
              <button
                type="button"
                onClick={() => setIsAdminOpen((current) => !current)}
                className="rounded-full border border-gold/25 bg-gold/10 px-4 py-2 text-xs uppercase tracking-[0.22em] text-gold transition hover:bg-gold/15"
              >
                {isAdminOpen ? 'Hide Control Room' : 'Open Control Room'}
              </button>
            ) : null}
            <AdminDashboard
              isOpen={isAdminOpen}
              canManage={canManage && appEnv.hasSupabase}
              dateKey={dateKey}
              dateLabel={dateLabel}
            />
            <DailyPuzzlePage dateKey={dateKey} dateLabel={dateLabel} user={user} backendEnabled={appEnv.hasSupabase} />
          </div>
          <HowToPlay />
        </div>
      </main>

      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
    </div>
  );
}

export default App;
