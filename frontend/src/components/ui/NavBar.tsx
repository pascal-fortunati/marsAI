import { useState } from "react";
import logo from "../../assets/mars_ai_logo.png";
import { Button } from "./Button";

export function NavBar() {
  const [lang, setLang] = useState<"fr" | "en">("fr");
  const toggleLang = (l: "fr" | "en") => setLang(l);

  return (
    <div className="h-[84px] w-full bg-blue-500 grid grid-cols-12 items-center px-4">
      {/* Bloc logo */}
      <div className="col-span-2 flex items-center">
        <img src={logo} className="h-[60px] w-[60px]" alt="Logomark" />
      </div>

      {/* Bloc texte décoratif */}
      <div className="col-span-6 flex flex-col justify-center">
        <div className="font-[Orbitron] text-3xl font-black tracking-[2.1px]">
          <span className="text-white">MARS</span>
          <span className="text-[#FF5C35]">AI</span>
        </div>
        <div className="font-[Share Tech Mono] text-2xl tracking-[1.6px] text-gray-400">
          Festival
        </div>
      </div>

      {/* Bloc menu/langue */}
      <div className="col-span-4 flex items-center justify-end gap-4">
        {/* Onglets/menu (exemple) */}
        <nav className="flex gap-2">
          <Button variant="nav" size="nav">
            Accueil
          </Button>
          <Button variant="nav" size="nav">
            Films
          </Button>
          <Button variant="nav" size="nav">
            Jury
          </Button>
        </nav>
        {/* Boutons FR/EN */}
        <Button
          variant={lang === "fr" ? "default" : "ghost"}
          size="sm"
          onClick={() => toggleLang("fr")}
        >
          FR
        </Button>
        <Button
          variant={lang === "en" ? "default" : "ghost"}
          size="sm"
          onClick={() => toggleLang("en")}
        >
          EN
        </Button>
      </div>
    </div>
  );
}
