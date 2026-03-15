interface YouTubeEmbedProps {
  youtubeUrl?: string;
}

export function YouTubeEmbed({ youtubeUrl }: YouTubeEmbedProps) {
  const videoId = extractVideoId(youtubeUrl);

  if (!videoId) {
    return null;
  }

  return (
    <section className="panel overflow-hidden border-white/10 bg-black/40 p-4 sm:p-5">
      <div className="mb-4">
        <p className="font-display text-3xl uppercase tracking-[0.16em] text-gold">Video Link-Up</p>
        <p className="text-xs uppercase tracking-[0.28em] text-haze/45">Official YouTube embed fallback</p>
      </div>

      <div className="overflow-hidden rounded-[24px] border border-white/8">
        <iframe
          title="YouTube embed"
          src={`https://www.youtube.com/embed/${videoId}`}
          width="100%"
          height="315"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    </section>
  );
}

function extractVideoId(value?: string) {
  if (!value) {
    return '';
  }

  const match = value.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );

  return match?.[1] ?? '';
}
