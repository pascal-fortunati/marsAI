import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import SubmitPage from "./pages/SubmitPage";
import CataloguePage from "./pages/CataloguePage";
import JuryPage from "./pages/JuryPage";

export default function App() {
  // État de langue global — à connecter à i18n.ts si besoin
  const [lang, setLang] = useState<"fr" | "en">("fr");

  return (
    <>
      {/* Navbar fixe — présente sur toutes les routes */}
      <Navbar lang={lang} onLangChange={setLang} />

      {/* Contenu décalé de h-20 (hauteur navbar) pour ne pas passer dessous */}
      <div className="pt-20">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalogue" element={<CataloguePage />} />
          <Route path="/submit" element={<SubmitPage />} />
          <Route path="/jury" element={<JuryPage />} />
        </Routes>
      </div>
    </>
  );
}
