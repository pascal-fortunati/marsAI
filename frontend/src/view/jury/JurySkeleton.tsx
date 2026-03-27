// Wireframe JurySkeleton : composant squelette (dark / light)
import { useEffect, useState } from "react";
import { StarfieldNeural } from "../../components/ui/StarfieldNeural";

type JurySkeletonProps = {
  theme?: "dark" | "light";
};

export default function JurySkeleton({ theme }: JurySkeletonProps) {
  const [detectedTheme, setDetectedTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const getTheme = () => {
      if (typeof document === "undefined") return "dark";
      const value = document.documentElement.getAttribute("data-theme");
      if (value === "light" || value === "dark") return value;
      if (window.matchMedia?.("(prefers-color-scheme: dark)").matches)
        return "dark";
      return "light";
    };

    setDetectedTheme(getTheme());

    const observer = new MutationObserver(() => setDetectedTheme(getTheme()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  const currentTheme = theme || detectedTheme;
  const isDark = currentTheme === "dark";
  const rootBg = isDark
    ? "bg-gray-900 text-gray-400"
    : "bg-slate-50 text-slate-700";
  const panelBg = isDark ? "bg-gray-800" : "bg-white";
  const panelBorder = isDark ? "border-gray-700" : "border-slate-300";
  const skeletonGray = isDark ? "bg-gray-700" : "bg-slate-300/75";
  const searchBarBg = isDark ? "bg-gray-800/85" : "bg-slate-100/95";
  const gradientBg = isDark
    ? "from-gray-900 via-gray-800 to-gray-700"
    : "from-slate-100 via-slate-200 to-slate-200";

  return (
    <div
      className={`relative min-h-screen overflow-x-hidden transition-colors ${rootBg}`}
    >
      {/* Wireframe NavBar (hauteur ~100px, fixed en haut) */}
      <div
        className={`fixed inset-x-0 top-0 z-50 w-full h-[100px] ${panelBg}/95 backdrop-blur-[12px] border-b ${panelBorder} animate-pulse flex items-center`}
      >
        <div className="flex items-center justify-between w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[59px]">
          {/* Logo + titre */}
          <div className="flex items-center gap-3">
            <div
              className={`size-[56px] ${skeletonGray} rounded-full animate-pulse`}
            />
            <div className="flex flex-col gap-1">
              {/* Deux traits : haut normal, bas plus fin */}
              <div
                className={`h-6 w-52 ${skeletonGray} rounded mb-1 animate-pulse`}
              />
              <div
                className={`h-4 w-52 ${skeletonGray} rounded animate-pulse`}
              />
            </div>
          </div>
          {/* Stats wireframe : 6 carrés */}
          <div className="hidden lg:flex gap-[56px]">
            <div
              className={`size-12 ${skeletonGray} rounded-[10px] animate-pulse`}
            />
            <div
              className={`size-12 ${skeletonGray} rounded-[10px] animate-pulse`}
            />
            <div
              className={`size-12 ${skeletonGray} rounded-[10px] animate-pulse`}
            />
            <div
              className={`size-12 ${skeletonGray} rounded-[10px] animate-pulse`}
            />
            <div
              className={`size-12 ${skeletonGray} rounded-[10px] animate-pulse`}
            />
            <div
              className={`size-12 ${skeletonGray} rounded-[10px] animate-pulse`}
            />
          </div>
          {/* Langues wireframe + petit rond */}
          <div className="flex gap-2 items-center">
            <div
              className={`size-8 ${skeletonGray} rounded-full animate-pulse mr-3`}
            />
            <div
              className={`size-[44px] ${skeletonGray} rounded-full animate-pulse`}
            />
            <div
              className={`size-[44px] ${skeletonGray} rounded-full animate-pulse`}
            />
          </div>
        </div>
      </div>
      {/* Décalage du contenu pour la navbar */}
      <div className="relative z-10 pt-[100px]">
        <div className="w-full max-w-screen-2xl mx-auto p-4 lg:p-5">
          {/* Barre sticky de recherche */}
          <div
            className={`sticky top-24 z-40 -mx-2 mt-2 mb-4 ${panelBg} px-2 py-2 min-h-[72px] max-w-full mx-auto backdrop-blur-md lg:mb-5 rounded-[6px] animate-pulse border ${panelBorder}`}
          />
          <section className="grid gap-[9px] lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-8">
            {/* Sidebar wireframe */}
            <aside className="hidden lg:block lg:sticky lg:top-5">
              <div
                className={`w-80 h-[500px] ${panelBg} rounded-[6px] border ${panelBorder} animate-pulse mt-3`}
              />
            </aside>
            {/* Main content wireframe */}
            <main id="jury-main-content" className="space-y-4 lg:space-y-5">
              {/* Wireframe VideoPlayer : aspect-video, max-w-[1120px], rounded-[20px], border */}
              <div
                className={`aspect-video w-full max-w-[1120px] ${panelBg} rounded-[20px] border ${panelBorder} mb-4 animate-pulse mx-auto mt-3`}
              />
              {/* Wireframe FilmDetail : même style que les autres rectangles */}
              <div
                className={`rounded-[20px] ${panelBg} border ${panelBorder} mb-4 animate-pulse w-full max-w-[1120px] mx-auto h-52`}
              />
              {/* Wireframe JuryVote : même style que les autres rectangles */}
              <div
                className={`rounded-[20px] ${panelBg} border ${panelBorder} animate-pulse w-full max-w-[1120px] mx-auto h-96`}
              />
            </main>
          </section>
        </div>
      </div>
      {/* Effet de fond d'étoiles minimaliste (via composant existant) */}
      <div
        className={`absolute inset-0 z-0 pointer-events-none ${
          isDark
            ? "opacity-70 mix-blend-screen"
            : "opacity-100 mix-blend-normal"
        }`}
      >
        <StarfieldNeural
          theme={currentTheme}
          intensity={isDark ? "normal" : "high"}
        />
      </div>
      {/* Effet de fond wireframe */}
      <div
        className={`absolute inset-0 z-10 bg-gradient-to-br ${gradientBg} opacity-35 pointer-events-none`}
      />
    </div>
  );
}

export function JurySkeletonLight(props: Omit<JurySkeletonProps, "theme">) {
  return <JurySkeleton theme="light" {...props} />;
}
