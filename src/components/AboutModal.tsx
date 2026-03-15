interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AboutModal({ isOpen, onClose }: AboutModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
      <div className="panel relative w-full max-w-xl overflow-hidden border-gold/20 bg-zinc-950/95 p-6 sm:p-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.25em] text-haze/70 transition hover:border-gold/40 hover:text-haze"
        >
          Close
        </button>

        <p className="font-display text-4xl uppercase tracking-[0.2em] text-gold">About LogDrum</p>
        <div className="mt-4 space-y-4 text-sm leading-7 text-haze/80">
          <p>
            LogDrum is a non-commercial portfolio experience built around Amapiano discovery. It is a
            cultural passion project with original branding, an original interaction model, and no
            self-hosted audio.
          </p>
          <p>
            Each day brings one South Africa-timed song puzzle. You get six tries, clues unlock after
            misses, and the finish state opens an "After the Drop" screen with context about the track.
          </p>
          <p>
            The goal is to celebrate the scene through playful design, product thinking, and respectful
            discovery rather than imitation or monetization.
          </p>
        </div>
      </div>
    </div>
  );
}
