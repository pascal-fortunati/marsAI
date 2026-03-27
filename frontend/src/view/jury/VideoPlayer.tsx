import { useTranslation } from "react-i18next";
import { formatFilmDisplayTitle, type Film } from "./types";

type VideoPlayerProps = {
  film: Film | null;
  hasFilms: boolean;
};

export function VideoPlayer({ film, hasFilms }: VideoPlayerProps) {
  const { t } = useTranslation();

  // TODO: utiliser un lecteur plus robuste si besoin (Vimeo, MP4, etc.)
  if (!film) {
    const titleKey = hasFilms ? "jury.noResultsTitle" : "jury.noAssignedTitle";
    const descKey = hasFilms ? "jury.noResultsDesc" : "jury.noAssignedDesc";

    return (
      <div className="aspect-video w-full max-w-[1120px] overflow-hidden rounded-[20px] border border-border bg-background/80 p-6 text-center">
        <h3 className="text-lg font-bold text-foreground">{t(titleKey)}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{t(descKey)}</p>
      </div>
    );
  }

  if (!film.youtubeId) {
    return (
      <div className="aspect-video w-full max-w-[1120px] overflow-hidden rounded-[20px] border border-border bg-background/80 p-6 text-center">
        <h3 className="text-lg font-bold text-foreground">
          {t("jury.noVideo")}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("jury.filmDetailsTitle")}
        </p>
      </div>
    );
  }

  return (
    <div className="aspect-video w-full max-w-[1120px] overflow-hidden rounded-[20px] border border-border">
      <iframe
        className="h-full w-full"
        src={`https://www.youtube-nocookie.com/embed/${film.youtubeId}`}
        title={`Lecteur de ${formatFilmDisplayTitle(film)}`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
