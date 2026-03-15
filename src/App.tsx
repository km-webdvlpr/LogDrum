import { useState } from 'react';
import { AboutModal } from './components/AboutModal';
import { HeroPanel } from './components/HeroPanel';
import { HowToPlay } from './components/HowToPlay';
import { DailyPuzzlePage } from './pages/DailyPuzzlePage';

function App() {
  const [isAboutOpen, setIsAboutOpen] = useState(false);

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
            <HeroPanel />
            <DailyPuzzlePage />
          </div>
          <HowToPlay />
        </div>
      </main>

      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
    </div>
  );
}

export default App;
