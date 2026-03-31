import { AuthLoginCard } from "../../components/AuthLoginCard";
import { useTranslation } from "react-i18next";

export function LoginView({
  eyebrow,
  title,
  subtitle,
  redirectPath = "/",
}: {
  eyebrow?: string;
  title?: string;
  subtitle?: React.ReactNode;
  redirectPath?: string;
}) {
  const { t } = useTranslation();
  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <AuthLoginCard
          eyebrow={eyebrow || t("login.eyebrow", "Connexion requise")}
          title={title || t("login.title", "Connexion à marsAI")}
          subtitle={
            subtitle || (
              <>
                {t(
                  "login.subtitle1",
                  "Merci de vous connecter avec Google pour accéder à cette page.",
                )}
              </>
            )
          }
          redirectPath={redirectPath}
        />
        {/* Lien temporaire pour mode démo, à supprimer plus tard */}
        <div style={{ textAlign: "center", marginTop: -82 }}>
          <a
            href="#demo"
            style={{
              fontSize: 12,
              color: "#888",
              textDecoration: "underline",
              cursor: "pointer",
            }}
            onClick={(e) => {
              e.preventDefault();
              localStorage.setItem("marsai_token", "__marsai_demo_local__");
              window.location.reload();
            }}
          >
            Passer en mode démo (temporaire)
          </a>
        </div>
      </div>
    </>
  );
}
