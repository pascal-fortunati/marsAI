import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { PalmaresView } from '../view/palmares/PalmaresView'

export function PalmaresPage() {
    const { t } = useTranslation()

    useEffect(() => {
        document.title = `marsAI · ${t('palmares.title')}`
    }, [t])

    return <PalmaresView />
}
