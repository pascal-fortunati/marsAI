import { useEffect } from 'react'
import { CatalogueView } from '../view/catalogue/CatalogueView'

// Page de catalogue des projets
export function CataloguePage() {

  useEffect(() => {
    document.title = marsAI · ${t('catalogue.title')}
  }, [t])

  return <CatalogueView />
}