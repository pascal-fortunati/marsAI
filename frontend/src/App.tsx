import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import SubmitPage from "./pages/SubmitPage";
import CataloguePage from "./pages/CataloguePage";
import JuryPage from "./pages/JuryPage";
import AdminPage from "./pages/AdminPage";;

export default function App() {
  // État de langue global — à connecter à i18n.ts si besoin
  const [lang, setLang] = useState<"fr" | "en">("fr");
  const location = useLocation();
  const isJuryRoute = location.pathname.startsWith("/jury");

  return (
    <>
      {/* Navbar fixe — présente sur toutes les routes sauf jury */}
      {!isJuryRoute && <Navbar lang={lang} onLangChange={setLang} />}

      {/* Contenu décalé de h-20 quand la navbar est affichée */}
      <div className={isJuryRoute ? "" : "pt-20"}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalogue" element={<CataloguePage />} />
          <Route path="/submit" element={<SubmitPage />} />
          <Route path="/jury" element={<JuryPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </div>
    </>
  );
}
