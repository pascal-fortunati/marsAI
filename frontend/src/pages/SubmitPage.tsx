import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { SubmitView } from '../view/submit/SubmitView'

// Page de soumission de projet
export function SubmitPage() {
    const { t } = useTranslation()

    useEffect(() => {
        document.title = `marsAI · ${t('submit.title')}`
    }, [t])

    return <SubmitView />
}
