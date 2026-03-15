const steps = [
  'You get one South Africa-timed Song of the Day.',
  'Enter up to 6 guesses using titles from the built-in Amapiano crate.',
  'Every miss unlocks the next clue, from artist through to first letter.',
  'After the Drop reveals full song context and a Spotify embed when available.'
];

export function HowToPlay() {
  return (
    <aside className="panel sticky top-5 h-fit overflow-hidden border-white/10 bg-zinc-950/60 px-5 py-6 sm:px-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="font-display text-3xl uppercase tracking-[0.18em] text-gold">How To Play</p>
          <p className="text-xs uppercase tracking-[0.28em] text-haze/55">Rules in the crate</p>
        </div>
        <div className="rounded-full border border-ember/30 bg-ember/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-spice">
          6 tries
        </div>
      </div>

      <div className="space-y-3">
        {steps.map((step, index) => (
          <div
            key={step}
            className="rounded-3xl border border-white/8 bg-white/[0.03] p-4 transition hover:border-gold/30 hover:bg-white/[0.05]"
          >
            <p className="mb-2 font-display text-2xl uppercase tracking-[0.14em] text-spice">
              0{index + 1}
            </p>
            <p className="text-sm leading-6 text-haze/75">{step}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-3xl border border-gold/15 bg-gradient-to-br from-gold/10 to-ember/10 p-4 text-sm leading-6 text-haze/75">
        <p className="font-semibold text-haze">Non-commercial note</p>
        <p>
          LogDrum is built as a portfolio and discovery project. It does not stream hosted music, reuse
          lyrics, or imitate existing puzzle brands.
        </p>
      </div>
    </aside>
  );
}
