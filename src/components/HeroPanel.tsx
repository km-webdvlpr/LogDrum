export function HeroPanel() {
  return (
    <section className="panel relative overflow-hidden px-5 py-6 sm:px-8 sm:py-8">
      <div className="absolute inset-y-0 right-0 hidden w-1/3 bg-gradient-to-l from-gold/10 to-transparent lg:block" />
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div className="space-y-4">
          <div className="inline-flex -rotate-2 rounded-full border border-ember/30 bg-ember/10 px-4 py-2">
            <span className="spray-label text-xs uppercase tracking-[0.35em] text-spice">
              Johannesburg energy, daily puzzle ritual
            </span>
          </div>

          <div className="space-y-3">
            <h1 className="font-display text-5xl uppercase leading-none tracking-[0.08em] text-haze sm:text-7xl">
              Crack the
              <span className="block text-transparent [text-stroke:1px_rgba(212,169,61,0.7)] [-webkit-text-stroke:1px_rgba(212,169,61,0.7)]">
                Song of the Day
              </span>
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-balance text-haze/75 sm:text-base">
              A daily Amapiano guessing game with clue drops, vinyl-crate attitude, and a premium
              JHB-inspired visual pulse. No cloned grids. No recycled branding. Just rhythm, memory,
              and discovery.
            </p>
          </div>
        </div>

        <div className="relative mx-auto flex w-full max-w-sm items-center justify-center py-4">
          <div className="absolute h-56 w-56 rounded-full bg-ember/20 blur-3xl animate-pulseGlow" />
          <div className="vinyl-ring animate-float relative h-56 w-56 rounded-full border border-gold/25 shadow-gold">
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,transparent_0,transparent_52%,rgba(255,255,255,0.05)_53%,transparent_54%)]" />
            <div className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/35 bg-gradient-to-br from-gold/75 to-ember/80 shadow-lg" />
          </div>
        </div>
      </div>
    </section>
  );
}
