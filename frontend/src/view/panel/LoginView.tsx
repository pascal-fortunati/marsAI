import { AuthLoginCard } from '../../components/AuthLoginCard'
import { useTranslation } from 'react-i18next'

// Affiche la vue de connexion avec un formulaire d'authentification
export function LoginView() {
  const { t } = useTranslation()
  return (
    <AuthLoginCard
      eyebrow={t('panel.loginEyebrow')}
      title={t('panel.loginTitle')}
      subtitle={
        <>
          {t('panel.loginSubtitle1')}
          <br />
          {t('panel.loginSubtitle2')}
        </>
      }
      redirectPath="/panel"
    />
  )
}
