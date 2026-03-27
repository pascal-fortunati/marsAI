import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { JuryView } from '../view/jury/JuryView'

export function JuryPage() {
  const { t } = useTranslation()

  useEffect(() => {
    document.title = `marsAI · ${t('meta.jury')}`
  }, [t])

  return <JuryView />
}
