import { useEffect, useState } from "react";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useMatch,
} from "react-router-dom";
import { MarsBackground } from "./components/MarsBackground";
import { NavBar } from "./components/NavBar";
import { NavBarStateProvider } from "./components/NavBarStateProvider";
import { useNavBarState } from "./components/NavBarStateContext";
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

// Contenu de l'app (à l'intérieur du NavBarStateProvider pour accéder au contexte)
function AppContent() {
  const { pathname, search } = useLocation();
  const { isJuryLoading } = useNavBarState();

  const skipIntro =
    INTRO_SKIP_PATHS.some((p) => pathname.startsWith(p)) ||
    new URLSearchParams(search).get("previewHome") === "1";

  useEffect(() => {
    consumeTokenFromUrlHash();
    window.addEventListener("hashchange", consumeTokenFromUrlHash);
    return () =>
      window.removeEventListener("hashchange", consumeTokenFromUrlHash);
  }, []);

  // Détection si on est sur la page de login du jury
  const matchJuryLogin = useMatch("/jury");
  // On va inspecter le localStorage pour savoir si l'utilisateur est loggé ou non
  let showNavBar = true;
  if (matchJuryLogin) {
    try {
      const token = localStorage.getItem("marsai_token");
      showNavBar = !!token && token !== "" && token !== null && !isJuryLoading;
    } catch {
      showNavBar = !isJuryLoading;
    }
  }

  return (
    <div className="relative min-h-full">
      <MarsBackground />
      <div className="relative z-10 min-h-full">
        {showNavBar && <NavBar />}
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
  );
}

// Application principale
function App() {
  const [introDone, setIntroDone] = useState(readIntroDone());

  const skipIntro =
    INTRO_SKIP_PATHS.some((p) => {
      try {
        return new URL(window.location.href).pathname.startsWith(p);
      } catch {
        return false;
      }
    }) ||
    new URLSearchParams(window.location.search).get("previewHome") === "1";

  const handleIntroDone = () => {
    setIntroDone(true);
    persistIntroDone();
  };

  if (!skipIntro && !introDone) {
    return <IntroScreen onDone={handleIntroDone} />;
  }

  return (
    <NavBarStateProvider>
      <AppContent />
    </NavBarStateProvider>
  );
}

export default App;
