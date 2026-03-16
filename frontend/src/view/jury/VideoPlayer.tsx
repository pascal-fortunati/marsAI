import type { Film } from "./types";

type VideoPlayerProps = {
  film: Film | null;
};

export function VideoPlayer({ film }: VideoPlayerProps) {
  if (!film || !film.youtubeId) {
    return (
      <div className="bg-gray-900 text-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Lecteur vidéo</h2>
        <p className="text-gray-400">
          Sélectionne un film avec une vidéo disponible.
        </p>
      </div>
    );
  }

  // TODO: utiliser un lecteur plus robuste si besoin (Vimeo, MP4, etc.)
  return (
    <div className="bg-gray-900 text-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Lecteur vidéo</h2>
      <div className="aspect-video w-full overflow-hidden rounded-md border border-gray-700">
        <iframe
          className="h-full w-full"
          src={`https://www.youtube.com/embed/${film.youtubeId}`}
          title={`Lecteur de ${film.title}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}
