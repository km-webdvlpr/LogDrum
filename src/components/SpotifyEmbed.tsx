interface SpotifyEmbedProps {
  spotifyId: string;
}

export function SpotifyEmbed({ spotifyId }: SpotifyEmbedProps) {
  if (!spotifyId) {
    return null;
  }

  return (
    <section className="panel overflow-hidden border-white/10 bg-black/40 p-4 sm:p-5">
      <div className="mb-4">
        <p className="font-display text-3xl uppercase tracking-[0.16em] text-gold">Reward Spin</p>
        <p className="text-xs uppercase tracking-[0.28em] text-haze/45">Official Spotify discovery embed</p>
      </div>

      <div className="overflow-hidden rounded-[24px] border border-white/8 bg-black/40">
        <iframe
          title="Spotify track embed"
          src={`https://open.spotify.com/embed/track/${spotifyId}?utm_source=generator`}
          width="100%"
          height="352"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          style={{ borderRadius: '24px' }}
        />
      </div>
    </section>
  );
}
