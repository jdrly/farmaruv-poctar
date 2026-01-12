import { useStore } from '@tanstack/react-store'
import type { Language } from '@/stores/language.store'
import type { Translations } from '@/lib/i18n/translations'
import { languageActions, languageStore } from '@/stores/language.store'
import { translations } from '@/lib/i18n/translations'

interface UseTranslationReturn {
    t: Translations
    language: Language
    setLanguage: (lang: Language) => void
    toggleLanguage: () => void
}

export function useTranslation(): UseTranslationReturn {
    const { language } = useStore(languageStore)

    return {
        t: translations[language],
        language,
        setLanguage: languageActions.setLanguage,
        toggleLanguage: languageActions.toggleLanguage,
    }
}
