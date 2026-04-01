const steps = [
  'Every daily route uses the South Africa date and gives everyone the same start and target artists.',
  'Tap only artists connected to your current artist through a shared song.',
  'Each move adds one hop to your line. Fewer hops means a cleaner solve.',
  'Finish the daily route, compare it with the optimal path, then use practice mode for fresh runs.'
]

export function HowToPlayPanel() {
  return (
    <section className="rounded-[28px] border border-white/8 bg-white/[0.04] px-4 py-4 shadow-glow backdrop-blur-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="font-display text-3xl tracking-[0.16em] text-gold">How To Play</p>
          <p className="text-xs uppercase tracking-[0.24em] text-haze/45">WELA in four moves</p>
        </div>
        <div className="rounded-full border border-ember/30 bg-ember/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-ember">
          Daily + practice
        </div>
      </div>

      <div className="space-y-3">
        {steps.map((step, index) => (
          <div
            key={step}
            className="rounded-3xl border border-white/8 bg-white/[0.03] p-4 transition-colors hover:border-gold/25"
          >
            <p className="mb-2 font-display text-2xl tracking-[0.12em] text-ember">0{index + 1}</p>
            <p className="text-sm leading-6 text-haze/75">{step}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-3xl border border-gold/15 bg-gradient-to-br from-gold/10 to-ember/10 p-4 text-sm leading-6 text-haze/75">
        <p className="font-semibold text-haze">Product note</p>
        <p>
          WELA keeps the strong cultural framing and polished ritual feel we wanted, but strips out the
          backend baggage and guess-the-title friction that made the earlier LogDrum direction harder to love.
        </p>
      </div>
    </section>
  )
}