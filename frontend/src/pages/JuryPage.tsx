import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { JuryView } from "../view/jury/JuryView";
import { LoginView } from "../view/jury/LoginView";
import {
  apiFetchJson,
  clearStoredToken,
  getStoredToken,
  setStoredToken,
} from "../lib/api";
import { DEMO_TOKEN } from "../components/NavBarStateContext";

export function JuryPage() {
  const { t } = useTranslation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.title = `marsAI · ${t("meta.jury")}`;
    let cancelled = false;

    const checkSession = async () => {
      const token = getStoredToken();
      if (!token) {
        if (!cancelled) {
          setIsLoggedIn(false);
          setIsLoading(false);
        }
        return;
      }
      // ===== PATCH DEMO: START - Remove entire block to disable demo mode =====
      // Mode démo : bypass API
      if (token === DEMO_TOKEN) {
        setIsLoggedIn(true);
        setIsLoading(false);
        return;
      }
      try {
        await apiFetchJson("/api/auth/me");
        if (!cancelled) {
          setIsLoggedIn(true);
        }
      } catch {
        clearStoredToken();
        if (!cancelled) {
          setIsLoggedIn(false);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };
    checkSession();
    return () => {
      cancelled = true;
    };
  }, [t]);

  // TODO: brancher le composant LoginView ici si besoin

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-foreground">
        Chargement...
      </div>
    );
  }

  return isLoggedIn ? (
    <JuryView />
  ) : (
    <div className="flex items-center justify-center min-h-screen text-foreground">
      <LoginView redirectPath="/jury" />
    </div>
  );
}
