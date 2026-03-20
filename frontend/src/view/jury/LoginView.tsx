import { useTranslation } from "react-i18next";

type LoginViewProps = {
  isLoggedIn: boolean;
  onLogin: (token: string) => void;
  onLogout: () => void;
};

export function LoginView({ isLoggedIn, onLogin, onLogout }: LoginViewProps) {
  const { t } = useTranslation();

  // TODO: remplacer ce stub par un vrai formulaire d'authentification (email/mdp ou OAuth)
  // Le token doit être envoyé à `onLogin`.

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900 p-8 text-white shadow-lg">
      <h2 className="text-2xl font-bold mb-4">{t("jury.loginTitle")}</h2>

      {isLoggedIn ? (
        <>
          <p className="mb-6">{t("jury.loginSuccess")}</p>
          <button
            className="rounded bg-primary px-4 py-2 text-white hover:opacity-90"
            onClick={onLogout}
          >
            {t("jury.logoutButton")}
          </button>
        </>
      ) : (
        <>
          <p className="mb-6">{t("jury.loginPrompt")}</p>
          <button
            className="rounded bg-primary px-4 py-2 text-white hover:opacity-90"
            onClick={() => onLogin("dummy-token")}
          >
            {t("jury.loginButton")} (stub)
          </button>
          <p className="mt-4 text-sm text-gray-400">
            TODO: remplacer par un vrai formulaire et appeler l’API d’auth.
          </p>
        </>
      )}
    </div>
  );
}
