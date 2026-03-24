import { useEffect, useState } from "react";
import { JuryView } from "../view/jury/JuryView";
import { LoginView } from "../view/jury/LoginView";

const AUTH_TOKEN_KEY = "jury-auth-token";

// Page du jury
export function JuryPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Vérifier si l'utilisateur a un token valide au chargement
  useEffect(() => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
      setIsLoggedIn(true);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (token: string) => {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
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
