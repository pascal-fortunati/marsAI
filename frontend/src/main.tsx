import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./App.css";
import "./lib/i18n"; // initialise i18next (traductions)
import { initializeTheme } from "./lib/theme";
import App from "./App.tsx";

// Applique le theme sauvegarde/systeme avant le premier rendu.
initializeTheme();

// Composant principal de l'application
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
