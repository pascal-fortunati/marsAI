import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { MarsBackground } from "./components/MarsBackground";
import { NavBar } from "./components/NavBar";
import { NavBarStateProvider } from "./components/NavBarStateProvider";
import { IntroScreen } from "./components/IntroScreen";
import { PublicFooter } from "./components/PublicFooter";
import { Toaster } from "./components/ui/toaster";
import { consumeTokenFromUrlHash } from "./lib/api";
import { CataloguePage } from "./pages/CataloguePage";
import { HomePage } from "./pages/HomePage";
import { JuryPage } from "./pages/JuryPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { PalmaresPage } from "./pages/PalmaresPage";
//import { PanelPage } from "./pages/PanelPage";
import { SubmitPage } from "./pages/SubmitPage";

const INTRO_SKIP_PATHS = ["/panel", "/jury"];
const INTRO_DONE_STORAGE_KEY = "marsai_intro_done";

// Vérifier si l'introduction a été effectuée précédemment
const readIntroDone = () => {
  try {
    return localStorage.getItem(INTRO_DONE_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
};

// Stocker le résultat dans le localStorage
const persistIntroDone = () => {
  try {
    localStorage.setItem(INTRO_DONE_STORAGE_KEY, "1");
  } catch {
    return;
  }
};

// Application principale
function App() {
  const { pathname, search } = useLocation();
  const [introDone, setIntroDone] = useState(readIntroDone);

  const skipIntro =
    INTRO_SKIP_PATHS.some((p) => pathname.startsWith(p)) ||
    new URLSearchParams(search).get("previewHome") === "1";

  useEffect(() => {
    consumeTokenFromUrlHash();
    window.addEventListener("hashchange", consumeTokenFromUrlHash);
    return () =>
      window.removeEventListener("hashchange", consumeTokenFromUrlHash);
  }, []);

  const handleIntroDone = () => {
    setIntroDone(true);
    persistIntroDone();
  };

  if (!skipIntro && !introDone) {
    return <IntroScreen onDone={handleIntroDone} />;
  }

  return (
    <NavBarStateProvider>
      <div className="relative min-h-full">
        <MarsBackground />
        <div className="relative z-10 min-h-full">
          <NavBar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/submit" element={<SubmitPage />} />
            <Route path="/catalogue" element={<CataloguePage />} />
            <Route path="/palmares" element={<PalmaresPage />} />
            <Route path="/jury" element={<JuryPage />} />
            {/* <Route path="/panel" element={<PanelPage />} /> */}
            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          <PublicFooter />
          <Toaster />
        </div>
      </div>
    </NavBarStateProvider>
  );
}

export default App;
