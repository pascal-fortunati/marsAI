import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { PanelView } from '../view/panel/PanelView'

export function PanelPage() {
  const { t } = useTranslation()
  const { search } = useLocation()

  useEffect(() => {
    const tab = new URLSearchParams(search).get('tab') || 'films'
    const tabMap: Record<string, string> = {
      films: t('nav.tabs.films'),
      users: t('nav.tabs.users'),
      site: t('nav.tabs.site'),
      partners: t('nav.tabs.partners'),
      youtube: t('nav.tabs.youtube'),
      email: t('nav.tabs.email'),
    }
    const tabLabel = tabMap[tab] || t('meta.panel')
    document.title = `marsAI · ${t('meta.panel')} · ${tabLabel}`
  }, [search, t])

  return <PanelView />
}
