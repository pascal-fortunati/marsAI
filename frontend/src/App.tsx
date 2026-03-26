import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import SubmitPage from "./pages/SubmitPage";
import CataloguePage from "./pages/CataloguePage";
import JuryPage from "./pages/JuryPage";
import AdminPage from "./pages/AdminPage";

export default function App() {
  // État de langue global — à connecter à i18n.ts si besoin
  const [lang, setLang] = useState<"fr" | "en">("fr");
  const location = useLocation();
  const isJuryRoute = location.pathname.startsWith("/jury");
  const isAdminRoute = location.pathname.startsWith("/panel") || location.pathname.startsWith("/admin");
  const showPublicNavbar = !isJuryRoute && !isAdminRoute;

  return (
    <>
      {/* Navbar fixe — présente sur toutes les routes sauf jury */}
      {showPublicNavbar && <Navbar lang={lang} onLangChange={setLang} />}

      {/* Contenu décalé de h-20 quand la navbar est affichée */}
      <div className={showPublicNavbar ? "pt-20" : ""}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalogue" element={<CataloguePage />} />
          <Route path="/submit" element={<SubmitPage />} />
          <Route path="/jury" element={<JuryPage />} />
          <Route path="/panel" element={<AdminPage />} />
          <Route path="/admin" element={<Navigate to="/panel" replace />} />
        </Routes>
      </div>
    </>
  );
}
