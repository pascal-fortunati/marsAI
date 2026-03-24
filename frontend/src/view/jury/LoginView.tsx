import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StarfieldNeural } from "../../components/ui/StarfieldNeural";
import marsAiLogo from "../../assets/mars_ai_logo.png";

type LoginViewProps = {
  isLoggedIn: boolean;
  onLogin: (token: string) => void;
  onLogout: () => void;
};

export function LoginView({ isLoggedIn, onLogin, onLogout }: LoginViewProps) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError("");

    try {
      // Simuler un délai API
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Pour une vraie intégration, utiliser google-auth-library:
      // const result = await window.google?.accounts?.id?.initialize(...)
      // Pour la démo, on génère un token simulé
      const token = `google-${Date.now()}-${Math.random().toString(36).substring(7)}`;
      onLogin(token);
    } catch (err) {
      setError("Google Sign-In failed. Please try again.");
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    // Token de démo pour passer sans connexion
    const token = `demo-${Date.now()}`;
    onLogin(token);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Fond animé */}
      <StarfieldNeural className="absolute inset-0 z-0" />

      {/* Overlay sombre */}
      <div className="absolute inset-0 bg-black/40 z-10" />

      {/* Contenu */}
      <div className="relative z-20 flex flex-col items-center gap-3">
        <div className="w-[384px] h-[389px] rounded-[20px] border border-slate-800 bg-slate-900/45 p-8 shadow-lg text-white flex flex-col justify-center overflow-hidden">
          {!isLoggedIn && (
            <div className="text-center space-y-5">
              {/* Logo */}
              <div className="flex justify-center mb-6">
                <img
                  src={marsAiLogo}
                  alt="MARSAI"
                  className="h-14 w-14 object-contain opacity-95"
                />
              </div>

              {/* Texte restreint */}
              <p className="text-slate-400 text-[12px] f-mono tracking-[0.15em] uppercase mb-0">
                ACCÈS RESTREINT · JURY
              </p>

              {/* Titre + sous-texte */}
              <div className="flex flex-col items-center space-y-1">
                <h1 className="text-[24px] font-black text-foreground tracking-tight f-orb">
                  Espace Jury
                </h1>

                <div className="flex flex-col items-center space-y-[2px]">
                  <p className="text-slate-400 text-[14px] f-mono tracking-wider mb-0">
                    MARSAI · Festival 2026
                  </p>
                  <p className="text-slate-400 text-[14px] f-mono tracking-wider mt-0">
                    Authentication Google requise.
                  </p>
                </div>
              </div>

              {error && (
                <div className="rounded-lg bg-red-900/40 border border-red-500/40 px-2 py-1 text-red-200 text-[10px] f-mono">
                  {error}
                </div>
              )}

              {/* Google Sign-In Button */}
              <button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground px-4 py-2.5 text-xs font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border border-border hover:border-border/80 f-mono"
              >
                {/* Google G Logo en couleur */}
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                  {/* Bleu */}
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  {/* Vert */}
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  {/* Orange/Jaune */}
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC04"
                  />
                  {/* Rouge */}
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                <span>
                  {isLoading ? "Connexion..." : "Se connecter avec Google"}
                </span>
              </button>

              {/* Footer */}
              <p className="text-slate-500 text-[10px] f-orb tracking-wider pt-2">
                MARSAI · Espace Jury
              </p>
            </div>
          )}

          {isLoggedIn && (
            <div className="text-center space-y-6">
              <h2 className="text-3xl font-bold text-foreground text-center f-orb">
                {t("jury.loginSuccess")}
              </h2>
              <button
                className="w-full rounded-2xl bg-accent text-accent-foreground px-6 py-3 font-semibold hover:opacity-90 transition-all font-mono"
                onClick={onLogout}
              >
                {t("jury.logoutButton")}
              </button>
            </div>
          )}
        </div>

        {!isLoggedIn && (
          <button
            onClick={handleSkip}
            disabled={isLoading}
            className="text-slate-400 hover:text-slate-200 text-xs f-mono underline transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ou continuer en démo
          </button>
        )}
      </div>
    </div>
  );
}
