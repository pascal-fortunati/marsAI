type LoginViewProps = {
  isLoggedIn: boolean;
  onLogin: (token: string) => void;
  onLogout: () => void;
};

export function LoginView({ isLoggedIn, onLogin, onLogout }: LoginViewProps) {
  // TODO: remplacer ce stub par un vrai formulaire d'authentification (email/mdp ou OAuth)
  // Le token doit être envoyé à `onLogin`.

  return (
    <div className="bg-gray-900 text-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Connexion</h2>

      {isLoggedIn ? (
        <>
          <p className="mb-6">
            Vous êtes connecté(e). Vous pouvez maintenant voter.
          </p>
          <button
            className="rounded bg-primary px-4 py-2 text-white hover:opacity-90"
            onClick={onLogout}
          >
            Se déconnecter
          </button>
        </>
      ) : (
        <>
          <p className="mb-6">Connectez-vous pour accéder à l'espace jury.</p>
          <button
            className="rounded bg-primary px-4 py-2 text-white hover:opacity-90"
            onClick={() => onLogin("dummy-token")}
          >
            Se connecter (stub)
          </button>
          <p className="mt-4 text-sm text-gray-400">
            TODO: remplacer par un vrai formulaire et appeler l’API d’auth.
          </p>
        </>
      )}
    </div>
  );
}
