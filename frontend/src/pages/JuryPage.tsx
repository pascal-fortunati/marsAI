import { useEffect, useState } from "react";
import { JuryView } from "../view/jury/JuryView";
import { LoginView } from "../view/jury/LoginView";
import {
  apiFetchJson,
  clearStoredToken,
  getStoredToken,
  setStoredToken,
} from "../lib/api";

// Page du jury
export function JuryPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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

      try {
        await apiFetchJson<{ user: unknown }>("/api/auth/me");
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
  }, []);

  const handleLogin = (token: string) => {
    setStoredToken(token);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    clearStoredToken();
    setIsLoggedIn(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        Chargement...
      </div>
    );
  }

  return isLoggedIn ? (
    <JuryView />
  ) : (
    <LoginView
      isLoggedIn={isLoggedIn}
      onLogin={handleLogin}
      onLogout={handleLogout}
    />
  );
}
