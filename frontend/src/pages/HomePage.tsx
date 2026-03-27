import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { HomeView } from '../view/home/HomeView'

export function HomePage() {
  const { t } = useTranslation()

  useEffect(() => {
    document.title = `marsAI · ${t('meta.home')}`
  }, [t])

  return <HomeView />
}
