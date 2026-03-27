import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { CatalogueView } from '../view/catalogue/CatalogueView'

// Page de catalogue des projets
export function CataloguePage() {
  const { t } = useTranslation()

  useEffect(() => {
    document.title = `marsAI · ${t('catalogue.title')}`
  }, [t])

  return <CatalogueView />
}