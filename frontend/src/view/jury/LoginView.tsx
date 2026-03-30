import { AuthLoginCard } from "../../components/AuthLoginCard";
import { useTranslation } from "react-i18next";

// Composant de connexion pour les jurys
export function JuryLoginView() {
  const { t } = useTranslation();
  return (
    <AuthLoginCard
      eyebrow={t("jury.loginEyebrow")}
      title={t("jury.loginTitle")}
      subtitle={
        <>
          {t("jury.loginSubtitle1")}
          <br />
          {t("jury.loginSubtitle2")}
        </>
      }
      redirectPath="/jury"
    />
  );
}
