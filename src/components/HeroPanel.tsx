export function HeroPanel({ dateLabel }: { dateLabel: string }) {
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
              A daily Amapiano guessing game with clue drops, log-drum attitude, and a premium
              JHB-inspired visual pulse. Today in South Africa: {dateLabel}. No cloned grids. No
              recycled branding. Just rhythm, memory, and discovery.
            </p>
          </div>
        </div>

        <div className="relative mx-auto flex w-full max-w-sm items-center justify-center py-4">
          <div className="absolute h-56 w-56 rounded-full bg-ember/20 blur-3xl animate-pulseGlow" />
          <div className="animate-float relative flex h-56 w-56 items-center justify-center">
            <div className="absolute h-44 w-44 rounded-full border border-gold/20 bg-gradient-to-br from-[#2b170c] via-[#130c07] to-black shadow-gold" />
            <div className="absolute h-32 w-32 rounded-full border border-gold/35 bg-gradient-to-br from-gold/45 via-ember/40 to-black" />
            <div className="absolute h-20 w-20 rounded-full border border-white/10 bg-black/70" />
            <div className="absolute left-8 top-14 h-24 w-6 rounded-full border border-gold/20 bg-gradient-to-b from-gold/70 to-ember/80 rotate-[-28deg]" />
            <div className="absolute right-10 top-10 h-28 w-6 rounded-full border border-gold/20 bg-gradient-to-b from-spice/90 to-ember/80 rotate-[22deg]" />
            <div className="absolute bottom-9 left-12 h-6 w-32 rounded-full border border-white/10 bg-gradient-to-r from-black via-gold/55 to-black" />
          </div>
        </div>
      </div>
    </section>
  );
}
