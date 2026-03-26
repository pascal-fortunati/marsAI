// Wireframe JurySkeleton : composant squelette gris
import { StarfieldNeural } from "./StarfieldNeural";

export default function JurySkeleton() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gray-900 text-gray-400 transition-colors">
      {/* Wireframe NavBar (hauteur ~100px, fixed en haut) */}
      <div className="fixed inset-x-0 top-0 z-50 w-full h-[100px] bg-gray-800/95 backdrop-blur-[12px] border-b border-gray-700 animate-pulse flex items-center">
        <div className="flex items-center justify-between w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[59px]">
          {/* Logo + titre */}
          <div className="flex items-center gap-3">
            <div className="size-[56px] bg-gray-700 rounded-full animate-pulse" />
            <div className="flex flex-col gap-1">
              {/* Deux traits : haut normal, bas plus fin */}
              <div className="h-6 w-52 bg-gray-700 rounded mb-1 animate-pulse" />
              <div className="h-4 w-52 bg-gray-700 rounded animate-pulse" />
            </div>
          </div>
          {/* Stats wireframe : 6 carrés */}
          <div className="hidden lg:flex gap-[56px]">
            <div className="size-12 bg-gray-700 rounded-[10px] animate-pulse" />
            <div className="size-12 bg-gray-700 rounded-[10px] animate-pulse" />
            <div className="size-12 bg-gray-700 rounded-[10px] animate-pulse" />
            <div className="size-12 bg-gray-700 rounded-[10px] animate-pulse" />
            <div className="size-12 bg-gray-700 rounded-[10px] animate-pulse" />
            <div className="size-12 bg-gray-700 rounded-[10px] animate-pulse" />
          </div>
          {/* Langues wireframe + petit rond */}
          <div className="flex gap-2 items-center">
            <div className="size-8 bg-gray-700 rounded-full animate-pulse mr-3" />
            <div className="size-[44px] bg-gray-700 rounded-full animate-pulse" />
            <div className="size-[44px] bg-gray-700 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
      {/* Décalage du contenu pour la navbar */}
      <div className="relative z-10 pt-[100px]">
        <div className="w-full max-w-screen-2xl mx-auto p-4 lg:p-5">
          {/* Barre sticky de recherche */}
          <div className="sticky top-24 z-40 -mx-2 mt-2 mb-4 bg-gray-800/85 px-2 py-2 min-h-[72px] max-w-full mx-auto backdrop-blur-md lg:mb-5 rounded-[6px] animate-pulse" />
          <section className="grid gap-[9px] lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-8">
            {/* Sidebar wireframe */}
            <aside className="hidden lg:block lg:sticky lg:top-5">
              <div className="w-80 h-[500px] bg-gray-800 rounded-[6px] animate-pulse mt-3" />
            </aside>
            {/* Main content wireframe */}
            <main id="jury-main-content" className="space-y-4 lg:space-y-5">
              {/* Wireframe VideoPlayer : aspect-video, max-w-[1120px], rounded-[20px], border */}
              <div className="aspect-video w-full max-w-[1120px] bg-gray-800 rounded-[20px] border border-gray-700 mb-4 animate-pulse mx-auto mt-3" />
              {/* Wireframe FilmDetail : même style que les autres rectangles */}
              <div className="bg-gray-800 rounded-[20px] border border-gray-700 mb-4 animate-pulse w-full max-w-[1120px] mx-auto h-52" />
              {/* Wireframe JuryVote : même style que les autres rectangles */}
              <div className="bg-gray-800 rounded-[20px] border border-gray-700 animate-pulse w-full max-w-[1120px] mx-auto h-96" />
            </main>
          </section>
        </div>
      </div>
      {/* Effet de fond d'étoiles minimaliste (via composant existant) */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-70 mix-blend-screen">
        <StarfieldNeural />
      </div>
      {/* Effet de fond wireframe */}
      <div className="absolute inset-0 z-10 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 opacity-35 pointer-events-none" />
    </div>
  );
}
