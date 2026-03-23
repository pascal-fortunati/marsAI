import { formatFilmDisplayTitle, type Film } from "./types";

type VideoPlayerProps = {
  film: Film | null;
};

const FALLBACK_YOUTUBE_ID = "M7lc1UVf-VE";

export function VideoPlayer({ film }: VideoPlayerProps) {
  const youtubeId = film?.youtubeId ?? FALLBACK_YOUTUBE_ID;

  // TODO: utiliser un lecteur plus robuste si besoin (Vimeo, MP4, etc.)
  return (
    <div className="aspect-video w-full max-w-[1120px] overflow-hidden rounded-[20px] border border-slate-800">
      <iframe
        className="h-full w-full"
        src={`https://www.youtube-nocookie.com/embed/${youtubeId}`}
        title={
          film
            ? `Lecteur de ${formatFilmDisplayTitle(film)}`
            : "Lecteur YouTube"
        }
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
