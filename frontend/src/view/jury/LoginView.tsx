import { AuthLoginCard } from "../../components/AuthLoginCard";
import { DemoModeLink } from "./demoMode";
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
        {/* ===== PATCH DEMO: START - Remove next line to disable demo mode ===== */}
        <DemoModeLink />
        {/* ===== PATCH DEMO: END ===== */}
      </div>
    </>
  );
}
