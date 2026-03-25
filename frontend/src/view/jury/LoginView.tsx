import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StarfieldNeural } from "../../components/ui/StarfieldNeural";
import marsAiLogo from "../../assets/marsai_logo.png";
import { apiFetchJson, DEMO_LOCAL_TOKEN } from "../../lib/api";

type GoogleCredentialResponse = {
  credential?: string;
};

type GoogleIdApi = {
  initialize: (options: {
    client_id: string;
    callback: (response: GoogleCredentialResponse) => void;
  }) => void;
  prompt: () => void;
};

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: GoogleIdApi;
      };
    };
  }
}

let googleScriptPromise: Promise<void> | null = null;

function getGoogleClientId() {
  const value = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;
  return value?.trim() || "";
}

function loadGoogleScript() {
  if (window.google?.accounts?.id) {
    return Promise.resolve();
  }

  if (googleScriptPromise) {
    return googleScriptPromise;
  }

  googleScriptPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector(
      'script[src="https://accounts.google.com/gsi/client"]',
    ) as HTMLScriptElement | null;
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(), {
        once: true,
      });
      existingScript.addEventListener(
        "error",
        () => reject(new Error("Unable to load Google Identity script")),
        { once: true },
      );
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error("Unable to load Google Identity script"));
    document.head.appendChild(script);
  });

  return googleScriptPromise;
}

function requestGoogleCredential(clientId: string) {
  return new Promise<string>((resolve, reject) => {
    const idApi = window.google?.accounts?.id;
    if (!idApi) {
      reject(new Error("Google Identity API unavailable"));
      return;
    }

    const timeout = window.setTimeout(() => {
      reject(new Error("Google sign-in timed out"));
    }, 20000);

    idApi.initialize({
      client_id: clientId,
      callback: (response) => {
        window.clearTimeout(timeout);
        if (!response?.credential) {
          reject(new Error("No Google credential received"));
          return;
        }
        resolve(response.credential);
      },
    });

    idApi.prompt();
  });
}

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
      const clientId = getGoogleClientId();
      if (!clientId) {
        throw new Error("VITE_GOOGLE_CLIENT_ID is missing");
      }

      await loadGoogleScript();
      const credential = await requestGoogleCredential(clientId);

      const response = await apiFetchJson<{ token: string }>(
        "/api/auth/google",
        {
          method: "POST",
          body: JSON.stringify({ credential }),
        },
      );

      const token = response.token;
      onLogin(token);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Google Sign-In failed. Please try again.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = async () => {
    setError("");
    onLogin(DEMO_LOCAL_TOKEN);
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-background text-foreground transition-colors">
      {/* Fond animé */}
      <StarfieldNeural className="absolute inset-0 z-0" />

      {/* Voile leger pour la lisibilite, compatible clair/sombre */}
      <div className="absolute inset-0 z-10 bg-background/35" />

      {/* Contenu */}
      <div className="relative z-20 flex flex-col items-center gap-3">
        <div className="panel flex h-[389px] w-[384px] flex-col justify-center overflow-hidden rounded-[20px] p-8">
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
              <p className="text-muted-foreground text-[12px] f-mono tracking-[0.15em] uppercase mb-0">
                ACCÈS RESTREINT · JURY
              </p>

              {/* Titre + sous-texte */}
              <div className="flex flex-col items-center space-y-1">
                <h1 className="text-[24px] font-black text-foreground tracking-tight f-orb">
                  Espace Jury
                </h1>

                <div className="flex flex-col items-center space-y-[2px]">
                  <p className="text-muted-foreground text-[14px] f-mono tracking-wider mb-0">
                    MARSAI · Festival 2026
                  </p>
                  <p className="text-muted-foreground text-[14px] f-mono tracking-wider mt-0">
                    Authentication Google requise.
                  </p>
                </div>
              </div>

              {error && (
                <div className="feedback-error text-[10px] px-2 py-1">
                  {error}
                </div>
              )}

              {/* Bouton de connexion Google */}
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
              <p className="text-muted-foreground text-[10px] f-orb tracking-wider pt-2">
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
            className="text-muted-foreground hover:text-foreground text-xs f-mono underline transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ou continuer en démo
          </button>
        )}
      </div>
    </div>
  );
}
